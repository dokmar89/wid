import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, FileCode, Key } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-[#173B3F] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="https://webovka-five.vercel.app/files/Logo_PassProve_bila.svg"
              alt="PassProve Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="font-bold text-lg">PassProve</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm hover:underline">
              Dokumentace
            </a>
            <a href="#" className="text-sm hover:underline">
              Ceník
            </a>
            <a href="#" className="text-sm hover:underline">
              Kontakt
            </a>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#173B3F]">
              Přihlášení
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">PassProve API Dokumentace</h1>
            <p className="text-xl text-gray-600">
              Jednoduché a bezpečné ověření věku pro váš e-shop
            </p>
          </div>

          <Tabs defaultValue="quickstart" className="mb-12">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="quickstart">Rychlý start</TabsTrigger>
              <TabsTrigger value="api">API Reference</TabsTrigger>
              <TabsTrigger value="examples">Příklady</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quickstart">
              <Card>
                <CardHeader>
                  <CardTitle>Začínáme s PassProve</CardTitle>
                  <CardDescription>
                    Naučte se, jak implementovat ověření věku do vašeho e-shopu v několika jednoduchých krocích.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">1. Přidejte JavaScript widget</h3>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          <code>{`<script src="https://passprove.vercel.app/api/verification-widget.js"></script>`}</code>
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">2. Inicializujte PassProve</h3>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          <code>{`document.addEventListener('DOMContentLoaded', function() {
  window.PassProve.init({
    apiKey: 'YOUR_API_KEY',
    containerId: 'age-verification-widget',
    onVerificationReady: function() {
      console.log('Ověření věku je připraveno!');
      isAgeVerified = true;
      updateCartDisplay();
    },
    onVerificationCancelled: function() {
      console.log('Ověření věku bylo zrušeno.');
      isAgeVerified = false;
      updateCartDisplay();
    }
  });
});`}</code>
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">3. Spusťte ověření věku</h3>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          <code>{`// Při kliknutí na tlačítko "Zaplatit" nebo při přidání produktu 18+ do košíku
document.getElementById('checkout-button').addEventListener('click', function(e) {
  if (hasAgeRestrictedItems && !isAgeVerified) {
    e.preventDefault();
    window.PassProve.verify();
  }
});`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Reference</CardTitle>
                  <CardDescription>
                    Kompletní dokumentace PassProve API pro vývojáře.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <Key className="mr-2 h-5 w-5" />
                        Autentizace
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Všechny API požadavky vyžadují API klíč, který získáte po registraci vašeho e-shopu.
                      </p>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          <code>{`// Příklad API požadavku
fetch('/api/verification/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    api_key: 'YOUR_API_KEY',
  }),
})`}</code>
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Endpointy API</h3>
                      
                      <div className="space-y-4">
                        <div className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Badge className="bg-green-600 mr-2">POST</Badge>
                              <span className="font-mono text-sm">/api/verification/initiate</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            Inicializuje novou relaci ověření věku.
                          </p>
                          <details className="text-sm">
                            <summary className="cursor-pointer text-blue-600 hover:underline">Zobrazit detaily</summary>
                            <div className="mt-2 space-y-2">
                              <div>
                                <h4 className="font-medium">Request Body:</h4>
                                <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
                                  <code>{`{
  "api_key": "YOUR_API_KEY",
  "ip_address": "192.168.1.1", // volitelné
  "user_agent": "Mozilla/5.0..." // volitelné
}`}</code>
                                </pre>
                              </div>
                              <div>
                                <h4 className="font-medium">Response:</h4>
                                <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
                                  <code>{`{
  "session_id": "ver_1234567890abcdef"
}`}</code>
                                </pre>
                              </div>
                            </div>
                          </details>
                        </div>

                        <div className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Badge className="bg-green-600 mr-2">POST</Badge>
                              <span className="font-mono text-sm">/api/verification/select-method</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            Vybere metodu ověření věku.
                          </p>
                          <details className="text-sm">
                            <summary className="cursor-pointer text-blue-600 hover:underline">Zobrazit detaily</summary>
                            <div className="mt-2 space-y-2">
                              <div>
                                <h4 className="font-medium">Request Body:</h4>
                                <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
                                  <code>{`{
  "session_id": "ver_1234567890abcdef",
  "method": "bankid" // bankid, mojeid, ocr, facescan, reverification, qrcode
}`}</code>
                                </pre>
                              </div>
                              <div>
                                <h4 className="font-medium">Response:</h4>
                                <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
                                  <code>{`{
  "status": "requires_action",
  "redirect_url": "https://api.passprove.cz/bankid/auth?session=ver_1234567890abcdef",
  "details": { ... }
}`}</code>
                                </pre>
                              </div>
                            </div>
                          </details>
                        </div>

                        <div className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Badge className="bg-green-600 mr-2">POST</Badge>
                              <span className="font-mono text-sm">/api/verification/complete</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            Dokončí proces ověření věku.
                          </p>
                          <details className="text-sm">
                            <summary className="cursor-pointer text-blue-600 hover:underline">Zobrazit detaily</summary>
                            <div className="mt-2 space-y-2">
                              <div>
                                <h4 className="font-medium">Request Body:</h4>
                                <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
                                  <code>{`{
  "session_id": "ver_1234567890abcdef",
  "success": true,
  "save_method": "cookie", // volitelné: phone, email, cookie, apple, google
  "valid_days": 180 // volitelné
}`}</code>
                                </pre>
                              </div>
                              <div>
                                <h4 className="font-medium">Response:</h4>
                                <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
                                  <code>{`{
  "status": "success",
  "verification_id": "ver_1234567890abcdef",
  "verification_hash": "ver_1234567890abcdef_bankid_1234567890",
  "valid_until": "2023-12-31T23:59:59Z"
}`}</code>
                                </pre>
                              </div>
                            </div>
                          </details>
                        </div>

                        <div className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Badge className="bg-blue-600 mr-2">GET</Badge>
                              <span className="font-mono text-sm">/api/verification/status</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            Zkontroluje stav ověření věku.
                          </p>
                          <details className="text-sm">
                            <summary className="cursor-pointer text-blue-600 hover:underline">Zobrazit detaily</summary>
                            <div className="mt-2 space-y-2">
                              <div>
                                <h4 className="font-medium">Query Parameters:</h4>
                                <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
                                  <code>{`session_id=ver_1234567890abcdef`}</code>
                                </pre>
                              </div>
                              <div>
                                <h4 className="font-medium">Response:</h4>
                                <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
                                  <code>{`{
  "status": "success",
  "method": "bankid",
  "completed_at": "2023-06-15T14:30:00Z",
  "details": { ... }
}`}</code>
                                </pre>
                              </div>
                            </div>
                          </details>
                        </div>

                        <div className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Badge className="bg-green-600 mr-2">POST</Badge>
                              <span className="font-mono text-sm">/api/verification/validate</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            Ověří platnost uloženého výsledku ověření.
                          </p>
                          <details className="text-sm">
                            <summary className="cursor-pointer text-blue-600 hover:underline">Zobrazit detaily</summary>
                            <div className="mt-2 space-y-2">
                              <div>
                                <h4 className="font-medium">Request Body:</h4>
                                <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
                                  <code>{`{
  "verification_hash": "ver_1234567890abcdef_bankid_1234567890"
}`}</code>
                                </pre>
                              </div>
                              <div>
                                <h4 className="font-medium">Response:</h4>
                                <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
                                  <code>{`{
  "is_valid": true,
  "method": "bankid",
  "valid_until": "2023-12-31T23:59:59Z",
  "metadata": { ... }
}`}</code>
                                </pre>
                              </div>
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="examples">
              <Card>
                <CardHeader>
                  <CardTitle>Příklady implementace</CardTitle>
                  <CardDescription>
                    Ukázky implementace PassProve v různých e-shopových platformách.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Implementace v čistém JavaScriptu</h3>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          <code>{`// 1. Přidejte script tag do hlavičky
<script src="https://passprove.vercel.app/api/verification-widget.js"></script>

// 2. Inicializujte PassProve
document.addEventListener('DOMContentLoaded', function() {
  window.PassProve.init({
    apiKey: 'YOUR_API_KEY',
    containerId: 'age-verification-widget',
    onVerificationReady: function() {
      console.log('Ověření věku je připraveno!');
      isAgeVerified = true;
      updateCartDisplay();
    },
    onVerificationCancelled: function() {
      console.log('Ověření věku bylo zrušeno.');
      isAgeVerified = false;
      updateCartDisplay();
    }
  });
});

// 3. Spusťte ověření věku při potřebě
function checkoutProcess() {
  if (hasAgeRestrictedItems && !isAgeVerified) {
    window.PassProve.verify();
    return false;
  }
  return true;
}

// 4. Přidejte kontrolu před dokončením objednávky
document.getElementById('checkout-form').addEventListener('submit', function(e) {
  if (!checkoutProcess()) {
    e.preventDefault();
  }
});`}</code>
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Implementace ve WooCommerce (WordPress)</h3>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          <code>{`<?php
/**
 * Plugin Name: PassProve Age Verification
 * Description: Ověření věku pro produkty s věkovým omezením
 * Version: 1.0.0
 */

// Přidání JavaScript widgetu do hlavičky
function passprove_enqueue_scripts() {
  wp_enqueue_script('passprove-widget', 'https://passprove.vercel.app/api/verification-widget.js', array(), '1.0.0', false);
  
  wp_add_inline_script('passprove-widget', '
    document.addEventListener("DOMContentLoaded", function() {
      if (typeof window.PassProve !== "undefined") {
        window.PassProve.init({
          apiKey: "YOUR_API_KEY",
          containerId: "age-verification-widget",
          onVerificationReady: function() {
            console.log("Ověření věku je připraveno!");
            document.cookie = "age_verified=true; path=/; max-age=86400";
            window.location.reload();
          },
          onVerificationCancelled: function() {
            console.log("Ověření věku bylo zrušeno.");
          }
        });
      }
    });
  ');
}
add_action('wp_enqueue_scripts', 'passprove_enqueue_scripts');

// Kontrola věku před dokončením objednávky
function passprove_check_age_verification() {
  if (is_checkout() && WC()->cart->needs_age_verification() && !isset($_COOKIE['age_verified'])) {
    wc_add_notice('Pro dokončení objednávky je nutné ověřit váš věk.', 'error');
    ?>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        if (typeof window.PassProve !== "undefined") {
          window.PassProve.verify();
        }
      });
    </script>
    <?php
  }
}
add_action('woocommerce_before_checkout_form', 'passprove_check_age_verification');
`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Potřebujete pomoc s implementací?</h2>
            <p className="mb-4">
              Náš tým je připraven vám pomoci s implementací PassProve do vašeho e-shopu. Kontaktujte nás a my vám rádi pomůžeme.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-[#173B3F] hover:bg-[#0e2325]">
                Kontaktujte nás
              </Button>
              <Button variant="outline">
                Dokumentace <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">PassProve</h3>
              <p className="text-sm text-gray-600">
                Jednoduché a bezpečné ověření věku pro váš e-shop.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Produkty</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Ověření věku</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">API</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Integrace</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Podpora</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Dokumentace</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">FAQ</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Kontakt</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Právní informace</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Obchodní podmínky</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Ochrana soukromí</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} PassProve. Všechna práva vyhrazena.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <FileCode className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
