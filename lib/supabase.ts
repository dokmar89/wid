import { createClient } from "@supabase/supabase-js"

// Vytvoření Supabase klienta pro Edge Functions
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// Pomocná funkce pro kontrolu, zda je metoda povolena pro daný obchod
export const isMethodAllowedForShop = async (
  supabase: ReturnType<typeof createSupabaseClient>,
  method: string,
  shopId: string,
): Promise<boolean> => {
  const { data: shop, error } = await supabase.from("shops").select("verification_methods").eq("id", shopId).single()

  if (error || !shop) {
    return false
  }

  // Kontrola, zda je metoda povolena v nastavení obchodu
  // QR a reverification jsou vždy povoleny
  if (method === "qrcode" || method === "reverification") {
    return true
  }

  // Kontrola, zda je metoda v poli povolených metod
  return shop.verification_methods && shop.verification_methods.includes(method)
}

// Pomocná funkce pro vytvoření hash pro uložení ověření
export const createVerificationHash = (sessionId: string, method: string): string => {
  return `${sessionId}_${method}_${Date.now()}`
}
