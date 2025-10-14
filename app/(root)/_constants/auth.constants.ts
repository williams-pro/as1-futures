export const AUTH_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  PIN_REQUIRED: "4-digit PIN is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PIN: "PIN must be exactly 4 digits",
  INVALID_CREDENTIALS: "Invalid email or PIN",
  ACCOUNT_NOT_FOUND: "Invalid email or PIN", // Cambiado para no revelar existencia
  ACCOUNT_INACTIVE: "Invalid email or PIN", // Cambiado para no revelar estado
  RATE_LIMIT: "Too many requests. Please try again later.",
  GENERIC_ERROR: "An unexpected error occurred. Please try again.",
} as const

export const AUTH_CONFIG = {
  REDIRECT_URL: process.env.NEXT_PUBLIC_APP_URL ? 
    `${process.env.NEXT_PUBLIC_APP_URL}/teams` : 
    undefined,
  PRODUCTION_REDIRECT_PATH: "/teams",
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
} as const

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PIN_REGEX = /^\d{4}$/

export const LOGIN_CONSTANTS = {
  PIN_LENGTH: 4,
  MAX_ATTEMPTS: 5,
  PIN_PADDING: 'AS', // 2 caracteres fijos para cumplir requisito Supabase (6 chars min)
  INTERNAL_PIN_LENGTH: 6, // 4 dígitos + 2 caracteres padding
} as const

export const CONTACT_INFO = {
  ADMIN_EMAIL: 'o.rodriguez@youngafricanpromises.com',
  SUPPORT_MESSAGE: 'Need help? Contact your administrator:',
} as const

export const LOGIN_TEXTS = {
  FORM: {
    TITLE: 'Welcome Back',
    DESCRIPTION: 'Enter your email and 4-digit PIN to sign in',
  },
  PIN_INPUT: {
    LABEL: '4-Digit PIN',
    PLACEHOLDER: '0000',
    DESCRIPTION: 'Enter the 4-digit PIN provided by your administrator',
    ARIA_LABEL: '4-digit PIN',
  },
} as const
