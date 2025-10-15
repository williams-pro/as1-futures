"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signInWithPin } from "@/app/actions/auth/sign-in-with-pin"
import { AUTH_MESSAGES, EMAIL_REGEX, PIN_REGEX } from "@/app/(root)/_constants/auth.constants"

// Schema de validación con Zod
const LoginSchema = z.object({
  email: z
    .string()
    .min(1, AUTH_MESSAGES.EMAIL_REQUIRED)
    .regex(EMAIL_REGEX, AUTH_MESSAGES.INVALID_EMAIL),
  pin: z
    .string()
    .min(1, AUTH_MESSAGES.PIN_REQUIRED)
    .regex(PIN_REGEX, AUTH_MESSAGES.INVALID_PIN),
})

type LoginFormData = z.infer<typeof LoginSchema>

interface UseLoginReturn {
  // Form state
  register: ReturnType<typeof useForm<LoginFormData>>['register']
  handleSubmit: ReturnType<typeof useForm<LoginFormData>>['handleSubmit']
  formState: ReturnType<typeof useForm<LoginFormData>>['formState']
  reset: ReturnType<typeof useForm<LoginFormData>>['reset']
  
  // Custom state
  isSubmitting: boolean
  error: string | null
  isSuccess: boolean
  
  // Actions
  onSubmit: (data: LoginFormData) => Promise<void>
  clearError: () => void
}

export function useLogin(): UseLoginReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      pin: "",
    },
  })

  const { register, handleSubmit, formState, reset } = form

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    setError(null)
    setIsSuccess(false)

    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('pin', data.pin)
      
      // El Server Action maneja la redirección con redirect()
      const result = await signInWithPin(formData)
      
      // Si llegamos aquí, significa que hubo un error de validación
      // porque si fue exitoso, redirect() habría terminado la ejecución
      if (result && result.success === false) {
        setError(result.error || 'Error al iniciar sesión')
      } else {
        setError('Error al iniciar sesión')
      }
    } catch (err) {
      // Solo capturar errores reales, NO el NEXT_REDIRECT
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        // Este es el comportamiento esperado - no es un error
        return
      }
      
      console.error('Login error:', err)
      setError('Error al iniciar sesión')
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    register,
    handleSubmit,
    formState,
    reset,
    isSubmitting,
    error,
    isSuccess,
    onSubmit,
    clearError,
  }
}
