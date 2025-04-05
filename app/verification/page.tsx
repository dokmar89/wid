"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import AgeVerificationModal from "@/components/age-verification-modal"

export default function VerificationPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session")
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (!sessionId) {
      window.parent.postMessage(
        {
          type: "verification_complete",
          success: false,
          error: "Missing session ID",
        },
        "*",
      )
      return
    }
  }, [sessionId])

  const handleVerificationSelected = (method: string) => {
    // Odeslání zprávy do rodičovského okna
    window.parent.postMessage(
      {
        type: "verification_complete",
        success: true,
        method: method,
        verificationId: sessionId,
      },
      "*",
    )

    setIsOpen(false)
  }

  const handleClose = () => {
    // Odeslání zprávy do rodičovského okna
    window.parent.postMessage(
      {
        type: "verification_complete",
        success: false,
        error: "User closed verification",
      },
      "*",
    )

    setIsOpen(false)
  }

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Chyba</h1>
          <p className="text-gray-700">Chybí ID relace. Ověření věku nelze provést.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AgeVerificationModal
        shopId={sessionId}
        isOpen={isOpen}
        onClose={handleClose}
        onVerificationSelected={handleVerificationSelected}
      />
    </div>
  )
}

