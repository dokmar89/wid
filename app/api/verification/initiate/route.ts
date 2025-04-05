import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseClient } from "@/lib/supabase"
import type { InitiateVerificationRequest, InitiateVerificationResponse } from "@/lib/types"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const body: InitiateVerificationRequest = await request.json()

    // Validace požadavku
    if (!body.api_key) {
      return NextResponse.json({ error: "Missing api_key" }, { status: 400 })
    }

    // Vyhledání obchodu podle API klíče
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("id, status")
      .eq("api_key", body.api_key)
      .eq("status", "active")
      .single()

    if (shopError || !shop) {
      return NextResponse.json({ error: "Shop not found or inactive" }, { status: 404 })
    }

    // Vytvoření nové verifikační relace
    const now = new Date()

    const { data: session, error } = await supabase
      .from("verification_sessions")
      .insert({
        shop_id: shop.id,
        status: "initiated",
        ip_address: body.ip_address || request.headers.get("x-forwarded-for") || "unknown",
        user_agent: body.user_agent || request.headers.get("user-agent") || "unknown",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error creating verification session:", error)
      return NextResponse.json({ error: "Failed to create verification session" }, { status: 500 })
    }

    const response: InitiateVerificationResponse = {
      session_id: session.id,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
