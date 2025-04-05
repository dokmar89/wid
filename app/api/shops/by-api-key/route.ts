import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseClient } from "@/lib/supabase"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const apiKey = request.nextUrl.searchParams.get("key")

    // Validace požadavku
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 400 })
    }

    // Vyhledání obchodu podle API klíče
    const { data: shop, error } = await supabase
      .from("shops")
      .select("id, name, domain, verification_methods, status, logo_url")
      .eq("api_key", apiKey)
      .eq("status", "active")
      .single()

    if (error) {
      console.error("Error finding shop by API key:", error)
      return NextResponse.json({ error: "Shop not found or inactive" }, { status: 404 })
    }

    if (!shop) {
      return NextResponse.json({ error: "Shop not found or inactive" }, { status: 404 })
    }

    return NextResponse.json(shop)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
