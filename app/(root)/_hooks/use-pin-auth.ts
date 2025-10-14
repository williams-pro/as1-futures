"use client"

import { useState, useCallback } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { AUTH_MESSAGES, EMAIL_REGEX, PIN_REGEX } from "../_constants/auth.constants"
import type { PinFormData, UpdatePinData, UsePinAuthReturn } from "../_types/auth.types"
import { logger } from "@/lib/logger"
import { encodePin, decodePin } from "@/lib/pin-utils"
import { isRateLimited, recordLoginAttempt, getBlockTimeRemaining } from "@/lib/rate-limiter"
import { randomDelay, sanitizeErrorMessage } from "@/lib/security-utils"

export function usePinAuth(): UsePinAuthReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  const validateCredentials = (email: string, pin: string): string | null => {
    if (!email) {
      return AUTH_MESSAGES.EMAIL_REQUIRED
    }
    
    if (!EMAIL_REGEX.test(email)) {
      return AUTH_MESSAGES.INVALID_EMAIL
    }
    
    if (!pin) {
      return AUTH_MESSAGES.PIN_REQUIRED
    }
    
    if (!PIN_REGEX.test(pin)) {
      return AUTH_MESSAGES.INVALID_PIN
    }
    
    return null
  }

  const signInWithPin = useCallback(async (credentials: PinFormData) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      logger.auth('SIGN_IN_PIN_CLIENT', 'Starting PIN sign in process', undefined)
      
      const clientId = credentials.email
      if (isRateLimited(clientId)) {
        const blockTime = getBlockTimeRemaining(clientId)
        const minutes = Math.ceil(blockTime / (1000 * 60))
        setError(`Demasiados intentos fallidos. Intenta nuevamente en ${minutes} minutos.`)
        logger.authError('SIGN_IN_PIN_CLIENT', 'Rate limited', undefined, new Error('Rate limited'))
        return
      }
      
      const validationError = validateCredentials(credentials.email, credentials.pin)
      if (validationError) {
        setError(validationError)
        logger.authError('SIGN_IN_PIN_CLIENT', 'Validation failed', undefined, new Error(validationError))
        recordLoginAttempt(clientId, false)
        return
      }

      const internalPin = encodePin(credentials.pin)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: internalPin,
      })

      if (authError) {
        logger.authError('SIGN_IN_PIN_CLIENT', 'Authentication failed', undefined, authError)
        recordLoginAttempt(clientId, false)
        await randomDelay(100, 300)
        setError(AUTH_MESSAGES.INVALID_CREDENTIALS)
        return
      }

      if (!authData.session) {
        logger.authError('SIGN_IN_PIN_CLIENT', 'No session created', undefined)
        recordLoginAttempt(clientId, false)
        await randomDelay(100, 300)
        setError(AUTH_MESSAGES.INVALID_CREDENTIALS)
        return
      }

      const { data: scout, error: scoutError } = await supabase
        .from('scouts')
        .select('id, email, role, is_active')
        .eq('email', credentials.email)
        .single()

      if (scoutError || !scout) {
        logger.authError('SIGN_IN_PIN_CLIENT', 'User not found in scouts table after auth', authData.user?.id, scoutError)
        await supabase.auth.signOut()
        await randomDelay(100, 300)
        setError(AUTH_MESSAGES.INVALID_CREDENTIALS)
        return
      }

      if (!scout.is_active) {
        logger.authError('SIGN_IN_PIN_CLIENT', 'User account is inactive', scout.id)
        await supabase.auth.signOut()
        await randomDelay(100, 300)
        setError(AUTH_MESSAGES.INVALID_CREDENTIALS)
        return
      }

      logger.auth('SIGN_IN_PIN_CLIENT', 'User verified in scouts table', scout.id)

      recordLoginAttempt(clientId, true)
      logger.auth('SIGN_IN_PIN_CLIENT', 'Sign in successful', scout.id)
      setIsSuccess(true)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : AUTH_MESSAGES.GENERIC_ERROR
      setError(errorMessage)
      logger.authError('SIGN_IN_PIN_CLIENT', 'Unexpected error during sign in', undefined, err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  const updatePin = useCallback(async (pinData: UpdatePinData) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      logger.auth('UPDATE_PIN_CLIENT', 'Starting PIN update process', undefined)
      
      if (!PIN_REGEX.test(pinData.currentPin)) {
        setError('PIN actual debe ser 4 dígitos')
        return
      }
      
      if (!PIN_REGEX.test(pinData.newPin)) {
        setError('Nuevo PIN debe ser 4 dígitos')
        return
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        logger.authError('UPDATE_PIN_CLIENT', 'User not authenticated', undefined, userError)
        setError('Usuario no autenticado')
        return
      }

      const encodedCurrentPin = encodePin(pinData.currentPin)
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: encodedCurrentPin,
      })

      if (verifyError) {
        logger.authError('UPDATE_PIN_CLIENT', 'Current PIN verification failed', user.id, verifyError)
        setError('PIN actual incorrecto')
        return
      }

      const encodedNewPin = encodePin(pinData.newPin)
      const { error: updateError } = await supabase.auth.updateUser({
        password: encodedNewPin,
      })

      if (updateError) {
        logger.authError('UPDATE_PIN_CLIENT', 'Failed to update PIN', user.id, updateError)
        setError('Error al actualizar PIN')
        return
      }

      logger.auth('UPDATE_PIN_CLIENT', 'PIN updated successfully', user.id)
      setIsSuccess(true)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : AUTH_MESSAGES.GENERIC_ERROR
      setError(errorMessage)
      logger.authError('UPDATE_PIN_CLIENT', 'Unexpected error during PIN update', undefined, err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  const resetPin = useCallback(async (email: string) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      logger.auth('RESET_PIN_CLIENT', 'Starting PIN reset process', undefined)
      
      if (!EMAIL_REGEX.test(email)) {
        setError(AUTH_MESSAGES.INVALID_EMAIL)
        return
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-pin`,
      })

      if (resetError) {
        logger.authError('RESET_PIN_CLIENT', 'Failed to send reset email', undefined, resetError)
        setError('Error al enviar email de reset')
        return
      }

      logger.auth('RESET_PIN_CLIENT', 'Reset email sent successfully', undefined)
      setIsSuccess(true)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : AUTH_MESSAGES.GENERIC_ERROR
      setError(errorMessage)
      logger.authError('RESET_PIN_CLIENT', 'Unexpected error during PIN reset', undefined, err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  const reset = useCallback(() => {
    setIsSuccess(false)
    setError(null)
  }, [])

  return {
    isLoading,
    isSuccess,
    error,
    signInWithPin,
    updatePin,
    resetPin,
    reset,
  }
}
