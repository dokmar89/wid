import type {
  SelectVerificationMethodRequest,
  SelectVerificationMethodResponse,
  CompleteVerificationRequest,
  CompleteVerificationResponse,
  CheckVerificationStatusResponse,
  VerificationMethod,
} from "./types"

const API_BASE_URL = "/api/verification"

// Funkce pro výběr verifikační metody
export async function selectVerificationMethod(
  sessionId: string,
  method: VerificationMethod,
): Promise<SelectVerificationMethodResponse> {
  const request: SelectVerificationMethodRequest = {
    session_id: sessionId,
    method,
  }

  const response = await fetch(`${API_BASE_URL}/select-method`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to select verification method")
  }

  return response.json()
}

// Funkce pro dokončení verifikace
export async function completeVerification(
  sessionId: string,
  success: boolean,
  saveMethod?: "phone" | "email" | "cookie" | "apple" | "google",
  identifier?: string,
  validDays?: number,
  metadata?: Record<string, any>,
): Promise<CompleteVerificationResponse> {
  const request: CompleteVerificationRequest = {
    session_id: sessionId,
    success,
    save_method: saveMethod,
    identifier,
    valid_days: validDays,
    metadata,
  }

  const response = await fetch(`${API_BASE_URL}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to complete verification")
  }

  return response.json()
}

// Funkce pro kontrolu stavu verifikace
export async function checkVerificationStatus(sessionId: string): Promise<CheckVerificationStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/status?session_id=${sessionId}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to check verification status")
  }

  return response.json()
}

