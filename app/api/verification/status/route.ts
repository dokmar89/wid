import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseClient, createVerificationHash } from "@/lib/supabase"
import type { CompleteVerificationRequest, CompleteVerificationResponse, VerificationStatus } from "@/lib/types"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const body: CompleteVerificationRequest = await request.json()

    // Validace požadavku
    if (!body.session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
    }

    // Získání verifikační relace
    const { data: session, error: sessionError } = await supabase
      .from("verification_sessions")
      .select("id, status, verification_method, shop_id")
      .eq("id", body.session_id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Verification session not found" }, { status: 404 })
    }

    // Kontrola stavu relace
    if (session.status !== "processing" && session.status !== "requires_action") {
      return NextResponse.json(
        { error: "Verification session is not in a valid state for completion" },
        { status: 400 },
      )
    }

    // Aktualizace stavu relace
    const newStatus = body.success ? "success" : "failed_technical"
    const now = new Date().toISOString()

    const { error: updateError } = await supabase
      .from("verification_sessions")
      .update({
        status: newStatus,
        verification_result: body.success ? "approved" : "rejected",
        updated_at: now,
        completed_at: now,
      })
      .eq("id", body.session_id)

    if (updateError) {
      console.error("Error updating verification session:", updateError)
      return NextResponse.json({ error: "Failed to update verification session" }, { status: 500 })
    }

    // Pokud ověření bylo úspěšné a máme metodu uložení, vytvoříme záznam o uložení
    let verificationHash: string | undefined
    let validUntil: string | undefined

    if (body.success && body.save_method && session.verification_method) {
      // Vytvoření hash pro uložení ověření
      verificationHash = createVerificationHash(body.session_id, session.verification_method)

      // Výpočet data platnosti
      const validDays = body.valid_days || 180 // Výchozí platnost 180 dní
      const validUntilDate = new Date()
      validUntilDate.setDate(validUntilDate.getDate() + validDays)
      validUntil = validUntilDate.toISOString()

      // Vytvoření záznamu o uložení ověření
      const { error: savedVerificationError } = await supabase.from("saved_verifications").insert({
        verification_hash: verificationHash,
        method: session.verification_method,
        expires_at: validUntil,
        is_validated: true,
        validation_token: `token_${Date.now()}`,
        validation_expires_at: validUntil,
      })

      if (savedVerificationError) {
        console.error("Error creating saved verification:", savedVerificationError)
        // Pokračujeme i přes chybu, protože hlavní verifikace proběhla úspěšně
      }

      // Vytvoření záznamu o výsledku ověření
      const { error: verificationResultError } = await supabase
        .from("verification_results")
        .insert({
          verification_id: body.session_id,
          save_method: body.save_method,
          identifier: body.identifier,
          valid_until: validUntil,
          metadata: body.metadata || {},
        })

      if (verificationResultError) {
        console.error("Error creating verification result:", verificationResultError)
        // Pokračujeme i přes chybu, protože hlavní verifikace proběhla úspěšně
      }
    }

    // Příprava odpovědi
    const response: CompleteVerificationResponse = {
      status: newStatus as VerificationStatus,
    }

    if (body.success) {
      response.verification_id = body.session_id

      if (verificationHash) {
        response.verification_hash = verificationHash
      }

      if (validUntil) {
        response.valid_until = validUntil
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
