/** @type {import('next').NextConfig} */
const nextConfig = {
  // Zde mohou být další tvé konfigurace

  // Přeskakování ESLint (z předchozího dotazu)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Přeskakování kontroly typů TypeScript
  typescript: {
    // !! POZOR !!
    // Toto umožní úspěšné dokončení produkčních buildů,
    // i když má váš projekt chyby typů TypeScript.
    // Důrazně se doporučuje spouštět kontrolu typů samostatně (např. `tsc --noEmit` nebo v CI).
    ignoreBuildErrors: true,
  },

  // Zde mohou být další tvé konfigurace
};

export default nextConfig;