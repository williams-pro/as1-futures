export interface LoginFormData {
  email: string
  pin: string
}

export interface PinFormData {
  email: string
  pin: string
}

export interface UpdatePinData {
  currentPin: string
  newPin: string
}

export interface AuthResponse {
  success: boolean
  error?: {
    message: string
    code?: string
  }
  user?: {
    id: string
    email: string
    role: string
    isActive: boolean
  }
}

export type AuthState = "idle" | "loading" | "success" | "error"

export interface UseLoginReturn {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
  login: (credentials: LoginFormData) => Promise<void>
  reset: () => void
}

export interface UsePinAuthReturn {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
  signInWithPin: (credentials: PinFormData) => Promise<void>
  updatePin: (pinData: UpdatePinData) => Promise<void>
  resetPin: (email: string) => Promise<void>
  reset: () => void
}
