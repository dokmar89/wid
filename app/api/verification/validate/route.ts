import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseClient } from "@/lib/supabase"
import type { ValidateVerificationRequest, ValidateVerificationResponse } from "@/lib/types"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const body: ValidateVerificationRequest = await request.json()

    // Validace požadavku
    if (!body.verification_hash) {
      return NextResponse.json({ error: "Missing verification_hash" }, { status: 400 })
    }

    // Získání uloženého ověření
    const { data: savedVerification, error: savedVerificationError } = await supabase
      .from("saved_verifications")
      .select("method, expires_at, is_validated")
      .eq("verification_hash", body.verification_hash)
      .single()

    if (savedVerificationError || !savedVerification) {
      return NextResponse.json({ error: "Verification not found" }, { status: 404 })
    }

    // Kontrola platnosti ověření
    const isValid = savedVerification.is_validated && new Date(savedVerification.expires_at) > new Date()

    // Získání metadat z výsledku ověření
    let metadata: Record<string, any> | undefined

    if (isValid) {
      const { data: verificationResult } = await supabase
        .from("verification_results")
        .select("metadata")
        .eq("verification_id", body.verification_hash.split("_")[0])
        .single()

      if (verificationResult) {
        metadata = verificationResult.metadata
      }
    }

    // Příprava odpovědi
    const response: ValidateVerificationResponse = {
      is_valid: isValid,
    }

    if (isValid) {
      response.method = savedVerification.method
      response.valid_until = savedVerification.expires_at

      if (metadata) {
        response.metadata = metadata
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

