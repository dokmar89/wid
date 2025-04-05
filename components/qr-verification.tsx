"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, RefreshCw, CheckCircle, AlertCircle, Smartphone, QrCode } from "lucide-react"
import SaveVerificationResult from "./save-verification-result"
import { checkVerificationStatus } from "@/lib/api-client"

interface QRVerificationProps {
  onComplete: (success: boolean) => void
  onBack: () => void
  primaryColor: string
  buttonClass?: string
  qrData?: string
  sessionId?: string
}

export default function QRVerification({
  onComplete,
  onBack,
  primaryColor = "#173B3F",
  buttonClass = "rounded-md",
  qrData,
  sessionId,
}: QRVerificationProps) {
  const [step, setStep] = useState<"instructions" | "qrcode" | "waiting" | "verifying" | "result" | "save">(
    "instructions",
  )
  const [result, setResult] = useState<"success" | "failure" | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null)

  // Přechod na QR kód, pokud máme data
  useEffect(() => {
    if (qrData && step === "instructions") {
      setStep("qrcode")
    }
  }, [qrData, step])

  // Simulace progress updates when in waiting state
  useEffect(() => {
    if (step === "waiting" && sessionId) {
      // Nastavení intervalu pro kontrolu stavu
      const interval = setInterval(async () => {
        try {
          // Kontrola stavu verifikace
          const status = await checkVerificationStatus(sessionId)

          // Aktualizace progress baru
          setProgress((prev) => {
            // Randomly increase progress
            const increment = Math.random() * 15
            const newProgress = Math.min(prev + increment, 100)
            return newProgress
          })

          // Kontrola stavu verifikace
          if (status.status === "completed") {
            setStep("verifying")
            clearInterval(interval)
            setStatusCheckInterval(null)

            // Simulace dokončení verifikace
            setTimeout(() => {
              setResult("success")
              setStep("save")
            }, 1500)
          } else if (status.status === "failed") {
            setStep("verifying")
            clearInterval(interval)
            setStatusCheckInterval(null)

            // Simulace selhání verifikace
            setTimeout(() => {
              setResult("failure")
              setStep("result")
            }, 1500)
          }
        } catch (err) {
          console.error("Error checking verification status:", err)
          setError("Nepodařilo se zkontrolovat stav verifikace")
        }
      }, 3000)

      setStatusCheckInterval(interval)

      return () => {
        clearInterval(interval)
        setStatusCheckInterval(null)
      }
    } else if (step === "verifying") {
      // Simulace verification process
      const timeout = setTimeout(() => {
        // 90% success rate for demonstration
        const success = Math.random() > 0.1
        setResult(success ? "success" : "failure")
        setStep(success ? "save" : "result")
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [step, sessionId])

  const startVerification = () => {
    setStep("qrcode")
  }

  const simulateScan = () => {
    setStep("waiting")
    setProgress(10) // Start with some initial progress
  }

  const completeVerification = () => {
    onComplete(result === "success")
  }

  const handleSaveComplete = () => {
    onComplete(true)
  }

  const handleSaveSkip = () => {
    setStep("result")
  }

  return (
    <div className="w-full max-w-md mx-auto flex items-center justify-center">
      <div className="w-full">
        {error && (
          <div className="text-center py-6">
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-full bg-red-100">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-red-600">Došlo k chybě</h3>
            <p className="text-gray-600 mb-6">{error}</p>

            <Button onClick={() => setError(null)} style={{ backgroundColor: primaryColor }} className={buttonClass}>
              Zkusit znovu
            </Button>
          </div>
        )}

        {!error && step === "instructions" && (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-full" style={{ backgroundColor: `${primaryColor}15` }}>
                <QrCode className="h-8 w-8" style={{ color: primaryColor }} />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
              Ověření na jiném zařízení
            </h3>

            <p className="mb-6 text-gray-600">
              Naskenujte QR kód pomocí mobilního zařízení a dokončete ověření věku na něm. Průběh ověření uvidíte v
              reálném čase i na tomto zařízení.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 text-center">
                <div className="text-sm font-medium mb-1">Krok 1</div>
                <p className="text-xs text-gray-500">Naskenujte QR kód mobilem</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-sm font-medium mb-1">Krok 2</div>
                <p className="text-xs text-gray-500">Dokončete ověření na mobilu</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-sm font-medium mb-1">Krok 3</div>
                <p className="text-xs text-gray-500">Výsledek se zobrazí zde</p>
              </Card>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={onBack} className={buttonClass}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zpět
              </Button>
              <Button onClick={startVerification} style={{ backgroundColor: primaryColor }} className={buttonClass}>
                Pokračovat
              </Button>
            </div>
          </div>
        )}

        {!error && step === "qrcode" && (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
              Naskenujte QR kód
            </h3>

            <p className="mb-6 text-gray-600">
              Pomocí fotoaparátu vašeho mobilního zařízení naskenujte tento QR kód a dokončete ověření věku na vašem
              mobilním zařízení.
            </p>

            <div className="mb-6 flex justify-center">
              <div className="border-4 border-white p-4 rounded-lg shadow-lg bg-white">
                <img
                  src={
                    qrData
                      ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`
                      : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://passprove.cz/verify/${sessionId || "demo"}`
                  }
                  alt="QR kód pro ověření"
                  className="w-48 h-48"
                />
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-gray-500" />
                <p className="text-sm text-gray-600">
                  ID relace: <span className="font-mono">{sessionId || "demo-session"}</span>
                </p>
              </div>
            </div>

            {/* For demo purposes only - button to simulate scanning */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-2">Pro účely demonstrace:</p>
              <Button onClick={simulateScan} variant="outline" size="sm">
                Simulovat naskenování
              </Button>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={onBack} className={buttonClass}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zpět
              </Button>
            </div>
          </div>
        )}

        {!error && step === "waiting" && (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
              Probíhá ověření na mobilním zařízení
            </h3>

            <div className="mb-6">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                {progress < 30
                  ? "Čekání na dokončení ověření..."
                  : progress < 60
                    ? "Zpracování údajů..."
                    : "Dokončování ověření..."}
              </p>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Smartphone className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Ověření probíhá na vašem mobilním zařízení</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Dokončete proces ověření na vašem mobilním zařízení. Průběh se automaticky zobrazí na této
                    obrazovce.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setStep("qrcode")} className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                Zobrazit QR kód znovu
              </Button>
            </div>
          </div>
        )}

        {!error && step === "verifying" && (
          <div className="text-center py-12">
            <div className="animate-spin mb-6 mx-auto">
              <RefreshCw className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
              Dokončování ověření
            </h3>
            <p className="text-gray-500">Čekejte prosím, dokončujeme ověření vašeho věku...</p>
          </div>
        )}

        {!error && step === "save" && (
          <SaveVerificationResult onComplete={handleSaveComplete} onSkip={handleSaveSkip} primaryColor={primaryColor} />
        )}

        {!error && step === "result" && (
          <div className="text-center py-6">
            {result === "success" ? (
              <>
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-green-100">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-green-600">Ověření úspěšné</h3>
                <p className="text-gray-600 mb-6">
                  Vaše ověření věku bylo úspěšně dokončeno na mobilním zařízení. Nyní můžete pokračovat.
                </p>
              </>
            ) : (
              <>
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-red-100">
                    <AlertCircle className="h-12 w-12 text-red-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-red-600">Ověření selhalo</h3>
                <p className="text-gray-600 mb-6">
                  Nepodařilo se ověřit váš věk na mobilním zařízení. Zkuste to znovu nebo použijte jinou metodu ověření.
                </p>
              </>
            )}

            <div className="flex gap-4 justify-center">
              {result === "failure" && (
                <Button variant="outline" onClick={() => setStep("qrcode")}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Zkusit znovu
                </Button>
              )}
              <Button
                onClick={completeVerification}
                style={{ backgroundColor: result === "success" ? "green" : primaryColor }}
              >
                {result === "success" ? "Dokončit" : "Zpět na výběr metody"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

