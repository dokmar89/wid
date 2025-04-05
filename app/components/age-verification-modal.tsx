"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, CreditCard, Scan, Camera, RefreshCw, QrCode, X, Shield, Lock, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { selectVerificationMethod } from "@/lib/api-client"
import Image from 'next/image'

interface AgeVerificationProps {
  // Základní parametry
  shopId: string // ID relace
  onVerificationSelected: (method: string) => void
  onClose: () => void
  isOpen: boolean
}

type VerificationMethod = "bankid" | "mojeid" | "ocr" | "facescan" | "reverification" | "qrcode"

// Konstanty pro jednotný design
const PRIMARY_COLOR = "#173B3F"
const SECONDARY_COLOR = "#96C4C8"
const BUTTON_SHAPE: "none" | "pill" | "default" = "default"
const FONT_FAMILY = "inter"
const DEFAULT_LOGO = "/placeholder.svg?height=60&width=120"
const DEFAULT_WELCOME_TEXT = "Vítejte! Pro pokračování je nutné ověřit váš věk."

export default function AgeVerificationModal({
  shopId,
  onVerificationSelected,
  onClose,
  isOpen,
}: AgeVerificationProps) {
  const [hoveredMethod, setHoveredMethod] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableMethods] = useState<string[]>([])
  const [shopLogo] = useState<string>(DEFAULT_LOGO)

  const getButtonClass = () => {
    switch (BUTTON_SHAPE) {
      case "none":
        return "rounded-none"
      case "pill":
        return "rounded-full"
      default:
        return "rounded-md"
    }
  }

  const getCardClass = () => {
    const baseClass = "group h-full cursor-pointer transition-all border-2 shadow-sm hover:shadow-md"

    switch (BUTTON_SHAPE) {
      case "none":
        return `${baseClass} rounded-none`
      case "pill":
        return `${baseClass} rounded-xl`
      default:
        return `${baseClass} rounded-md`
    }
  }

  const cardClass = getCardClass()
  const buttonClass = getButtonClass()

  const verificationMethods = [
    {
      id: "bankid",
      name: "BankID",
      description: "Ověření pomocí bankovní identity",
      detailedInfo:
        "Rychlé a bezpečné ověření věku prostřednictvím vaší bankovní identity. Podporuje většinu českých bank.",
      icon: <CreditCard className="h-6 w-6" />,
      show: availableMethods.includes("bankid"),
      securityLevel: "Vysoká",
    },
    {
      id: "mojeid",
      name: "mojeID",
      description: "Ověření pomocí mojeID",
      detailedInfo: "Ověření věku pomocí služby mojeID, kterou poskytuje CZ.NIC.",
      icon: <Scan className="h-6 w-6" />,
      show: availableMethods.includes("mojeid"),
      securityLevel: "Vysoká",
    },
    {
      id: "ocr",
      name: "OCR",
      description: "Ověření pomocí dokladu totožnosti",
      detailedInfo: "Naskenujte svůj doklad totožnosti pro ověření věku. Podporujeme občanský průkaz a cestovní pas.",
      icon: <Scan className="h-6 w-6" />,
      show: availableMethods.includes("ocr"),
      securityLevel: "Střední",
    },
    {
      id: "facescan",
      name: "Face Scan",
      description: "Ověření pomocí rozpoznání obličeje",
      detailedInfo: "Rychlé ověření věku pomocí technologie rozpoznávání obličeje.",
      icon: <Camera className="h-6 w-6" />,
      show: availableMethods.includes("facescan"),
      securityLevel: "Střední",
    },
    {
      id: "reverification",
      name: "Opakované ověření",
      description: "Použít předchozí ověření",
      detailedInfo: "Pokud jste již dříve prošli ověřením, můžete použít tuto možnost pro rychlejší proces.",
      icon: <RefreshCw className="h-6 w-6" />,
      show: true, // Vždy povoleno
      securityLevel: "Střední",
    },
    {
      id: "qrcode",
      name: "QR kód",
      description: "Ověření pomocí QR kódu",
      detailedInfo: "Naskenujte QR kód pomocí mobilního zařízení pro ověření věku.",
      icon: <QrCode className="h-6 w-6" />,
      show: true, // Vždy povoleno
      securityLevel: "Střední",
    },
  ]

  const filteredMethods = verificationMethods.filter((method) => method.show)

  const handleMethodClick = async (methodId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Volání API pro výběr metody
      const response = await selectVerificationMethod(shopId, methodId as VerificationMethod)

      // Zpracování odpovědi podle typu metody
      if (methodId === "bankid" || methodId === "mojeid") {
        if (response.redirect_url) {
          window.location.href = response.redirect_url
          return
        }
      } else if (methodId === "qrcode") {
        if (response.qr_data) {
          // Pro QR kód zpracujeme odpověď
          // ...
        }
      }

      setIsLoading(false)

      // Pro účely demonstrace simulujeme úspěšné ověření
      setTimeout(() => {
        onVerificationSelected(methodId)
      }, 1000)
    } catch (err) {
      console.error("Failed to select verification method:", err)
      setError("Nepodařilo se vybrat metodu ověření. Zkuste to prosím znovu.")
      setIsLoading(false)
    }
  }

  const renderSidebarContent = () => {
    return (
      <>
        <h2 className="text-xl font-bold mb-4">PassProve</h2>

        <h3 className="text-lg font-medium mb-3">Ověření věku</h3>

        <p className="text-white/80 text-sm">
          {DEFAULT_WELCOME_TEXT.length > 150 ? `${DEFAULT_WELCOME_TEXT.substring(0, 150)}...` : DEFAULT_WELCOME_TEXT}
        </p>

        <div className="mt-6 pt-4 border-t border-white/20 w-full">
          <div className="flex items-center gap-2 text-xs text-white/70 mb-3">
            <Lock className="h-4 w-4" />
            <span>Šifrovaný přenos dat</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/70 mb-3">
            <Shield className="h-4 w-4" />
            <span>Zabezpečené ověření</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-xs text-white/70 mt-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WjkAe8ZTI3kS5AbMKIqw66tQ99eoFP.png"
              alt="PassProve Logo"
              width={24}
              height={24}
              className="h-6 w-auto"
            />
            <span className="text-xs">Zabezpečeno technologií PassProve</span>
          </div>
        </div>
      </>
    )
  }

  const renderContent = () => {
    // Zobrazení chyby
    if (error) {
      return (
        <div className="flex flex-col md:flex-row h-full w-full">
          <div
            className="md:w-1/4 p-6 flex flex-col items-center justify-center text-center"
            style={{
              background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
            }}
          >
            <div className="flex flex-col items-center text-white">
              {shopLogo && (
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl mb-4 inline-block">
                  <Image
                    src={shopLogo || DEFAULT_LOGO}
                    alt="E-shop logo"
                    width={48}
                    height={48}
                    className="h-12 max-w-[120px] object-contain"
                  />
                </div>
              )}

              {renderSidebarContent()}
            </div>
          </div>

          <div className="md:w-3/4 bg-white p-6 relative flex items-center justify-center">
            <Button
              variant="ghost"
              className="absolute top-4 right-4 h-8 w-8 p-0 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="text-center py-6">
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-full bg-red-100">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-red-600">Došlo k chybě</h3>
              <p className="text-gray-600 mb-6">{error}</p>

              <Button onClick={() => setError(null)} style={{ backgroundColor: PRIMARY_COLOR }} className={buttonClass}>
                Zkusit znovu
              </Button>
            </div>
          </div>
        </div>
      )
    }

    // Zobrazení načítání
    if (isLoading) {
      return (
        <div className="flex flex-col md:flex-row h-full w-full">
          <div
            className="md:w-1/4 p-6 flex flex-col items-center justify-center text-center"
            style={{
              background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
            }}
          >
            <div className="flex flex-col items-center text-white">
              {shopLogo && (
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl mb-4 inline-block">
                  <Image
                    src={shopLogo || DEFAULT_LOGO}
                    alt="E-shop logo"
                    width={48}
                    height={48}
                    className="h-12 max-w-[120px] object-contain"
                  />
                </div>
              )}

              {renderSidebarContent()}
            </div>
          </div>

          <div className="md:w-3/4 bg-white p-6 relative flex items-center justify-center">
            <Button
              variant="ghost"
              className="absolute top-4 right-4 h-8 w-8 p-0 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="text-center py-12">
              <div className="animate-spin mb-6 mx-auto">
                <RefreshCw className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
                Načítání
              </h3>
              <p className="text-gray-500">Čekejte prosím...</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col md:flex-row h-full w-full">
        {/* Left column - Logo and description (1/4) */}
        <div
          className="md:w-1/4 p-6 flex flex-col items-center justify-center text-center"
          style={{
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
          }}
        >
          <div className="flex flex-col items-center text-white">
            {shopLogo && (
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl mb-4 inline-block">
                <Image
                  src={shopLogo || DEFAULT_LOGO}
                  alt="E-shop logo"
                  width={48}
                  height={48}
                  className="h-12 max-w-[120px] object-contain"
                />
              </div>
            )}

            {renderSidebarContent()}
          </div>
        </div>

        {/* Right column - Verification methods (3/4) */}
        <div className="md:w-3/4 bg-white p-6 relative">
          <Button
            variant="ghost"
            className="absolute top-4 right-4 h-8 w-8 p-0 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2" style={{ color: PRIMARY_COLOR }}>
              Vyberte způsob ověření
            </h3>
            <p className="text-gray-500 text-sm">Zvolte jednu z následujících metod pro ověření vašeho věku</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <TooltipProvider>
              {filteredMethods.map((method) => (
                <Card
                  key={method.id}
                  className={cardClass}
                  style={{
                    borderColor: hoveredMethod === method.id ? PRIMARY_COLOR : "transparent",
                    backgroundColor: hoveredMethod === method.id ? `${SECONDARY_COLOR}10` : undefined,
                    transform: hoveredMethod === method.id ? "translateY(-2px)" : "none",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => handleMethodClick(method.id)}
                  onMouseEnter={() => setHoveredMethod(method.id)}
                  onMouseLeave={() => setHoveredMethod(null)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center h-full">
                    <div className="p-3 rounded-full mb-3 mt-2" style={{ backgroundColor: `${PRIMARY_COLOR}15` }}>
                      {method.icon}
                    </div>
                    <div className="font-medium mb-1">{method.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{method.description}</div>

                    <div className="flex items-center gap-1 mt-auto mb-1">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: method.securityLevel === "Vysoká" ? "#10b981" : "#f59e0b",
                        }}
                      />
                      <span className="text-xs text-gray-500">Úroveň zabezpečení: {method.securityLevel}</span>
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{method.detailedInfo}</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardContent>
                </Card>
              ))}
            </TooltipProvider>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-2">
              <div className="flex gap-4">
                <a href="#" className="hover:underline hover:text-gray-600">
                  Obchodní podmínky
                </a>
                <a href="#" className="hover:underline hover:text-gray-600">
                  O službě
                </a>
                <a href="#" className="hover:underline hover:text-gray-600">
                  Ochrana soukromí
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-3 w-3" />
                <span>© {new Date().getFullYear()} PassProve</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[800px] p-0 gap-0 border-0 shadow-2xl flex items-center justify-center"
        style={{
          fontFamily:
            FONT_FAMILY === "inter"
              ? "Inter, sans-serif"
              : FONT_FAMILY === "roboto"
                ? "Roboto, sans-serif"
                : FONT_FAMILY === "poppins"
                  ? "Poppins, sans-serif"
                  : FONT_FAMILY === "open-sans"
                    ? "Open Sans, sans-serif"
                    : "Montserrat, sans-serif",
          height: "600px", // Fixed height for consistency
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}

