import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseClient, isMethodAllowedForShop } from "@/lib/supabase"
import type { SelectVerificationMethodRequest, SelectVerificationMethodResponse } from "@/lib/types"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const body: SelectVerificationMethodRequest = await request.json()

    // Validace požadavku
    if (!body.session_id || !body.method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Získání verifikační relace
    const { data: session, error: sessionError } = await supabase
      .from("verification_sessions")
      .select("id, shop_id, status")
      .eq("id", body.session_id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Verification session not found" }, { status: 404 })
    }

    // Kontrola stavu relace
    if (session.status !== "initiated") {
      return NextResponse.json({ error: "Verification session already has a method selected" }, { status: 400 })
    }

    // Kontrola, zda je metoda povolena pro daný obchod
    const isMethodAllowed = await isMethodAllowedForShop(supabase, body.method, session.shop_id)
    if (!isMethodAllowed) {
      return NextResponse.json({ error: "Verification method not allowed for this shop" }, { status: 400 })
    }

    // Specifická logika pro jednotlivé metody
    let verificationDetails: Record<string, any> = {}
    let status: "processing" | "requires_action" = "processing"

    switch (body.method) {
      case "bankid":
        // Generování přesměrovací URL pro BankID
        const bankIdRedirectUrl = `https://api.passprove.cz/bankid/auth?session=${body.session_id}`
        verificationDetails = {
          redirect_url: bankIdRedirectUrl,
          provider_tx_id: `bankid_${Date.now()}`,
        }
        status = "requires_action"
        break

      case "mojeid":
        // Generování přesměrovací URL pro MojeID
        const mojeIdRedirectUrl = `https://api.passprove.cz/mojeid/auth?session=${body.session_id}`
        verificationDetails = {
          redirect_url: mojeIdRedirectUrl,
          provider_tx_id: `mojeid_${Date.now()}`,
        }
        status = "requires_action"
        break

      case "qrcode":
        // Generování dat pro QR kód
        const qrToken = `qr_${body.session_id}_${Date.now()}`
        verificationDetails = {
          qr_token: qrToken,
          qr_data: `https://verify.passprove.cz/${qrToken}`,
        }
        status = "requires_action"
        break

      case "ocr":
      case "facescan":
      case "reverification":
        // Pro tyto metody není potřeba externí přesměrování
        status = "processing"
        break

      default:
        return NextResponse.json({ error: "Invalid verification method" }, { status: 400 })
    }

    // Aktualizace verifikační relace
    const { error: updateError } = await supabase
      .from("verification_sessions")
      .update({
        status: status,
        verification_method: body.method,
        verification_details: verificationDetails,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.session_id)

    if (updateError) {
      console.error("Error updating verification session:", updateError)
      return NextResponse.json({ error: "Failed to update verification session" }, { status: 500 })
    }

    // Příprava odpovědi
    const response: SelectVerificationMethodResponse = {
      status: status,
      details: verificationDetails,
    }

    // Přidání specifických polí podle metody
    if (body.method === "bankid" || body.method === "mojeid") {
      response.redirect_url = verificationDetails.redirect_url
    } else if (body.method === "qrcode") {
      response.qr_data = verificationDetails.qr_data
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
