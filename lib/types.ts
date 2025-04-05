// Typy pro API

export type VerificationStatus = 
  | "initiated" 
  | "processing" 
  | "requires_action" 
  | "success" 
  | "failed_age" 
  | "failed_technical" 
  | "expired" 
  | "insufficient_credit" 
  | "pending"

export type VerificationMethod = "bankid" | "mojeid" | "ocr" | "facescan" | "reverification" | "qrcode"

// API Request/Response typy
export interface InitiateVerificationRequest {
  api_key: string
  ip_address?: string
  user_agent?: string
}

export interface InitiateVerificationResponse {
  session_id: string
}

export interface SelectVerificationMethodRequest {
  session_id: string
  method: VerificationMethod
}

export interface SelectVerificationMethodResponse {
  status: VerificationStatus
  redirect_url?: string
  qr_data?: string
  details?: Record<string, any>
}

export interface CompleteVerificationRequest {
  session_id: string
  success: boolean
  save_method?: "phone" | "email" | "cookie" | "apple" | "google"
  identifier?: string
  valid_days?: number
  metadata?: Record<string, any>
}

export interface CompleteVerificationResponse {
  status: VerificationStatus
  verification_id?: string
  verification_hash?: string
  valid_until?: string
}

export interface CheckVerificationStatusRequest {
  session_id: string
}

export interface CheckVerificationStatusResponse {
  status: VerificationStatus
  method?: VerificationMethod
  completed_at?: string
  details?: Record<string, any>
}
