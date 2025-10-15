/**
 * Utilidades para manejo de PIN con padding interno
 * El usuario ve un PIN de 4 dígitos, pero internamente se almacena con 2 caracteres adicionales
 * para cumplir con el requisito mínimo de 6 caracteres de Supabase Auth
 */

import { LOGIN_CONSTANTS } from '@/app/(root)/_constants/auth.constants'

/**
 * Convierte un PIN de 4 dígitos del usuario a la versión interna de 6 caracteres
 * @param userPin PIN de 4 dígitos ingresado por el usuario
 * @returns PIN interno de 6 caracteres para Supabase Auth
 */
export function encodePin(userPin: string): string {
  if (!userPin || userPin.length !== LOGIN_CONSTANTS.PIN_LENGTH) {
    throw new Error('PIN debe ser exactamente 4 dígitos')
  }
  
  // Agregar padding al final: 1234 -> 1234AS
  return userPin + LOGIN_CONSTANTS.PIN_PADDING
}

/**
 * Convierte un PIN interno de 6 caracteres a la versión de 4 dígitos del usuario
 * @param internalPin PIN interno de 6 caracteres de Supabase Auth
 * @returns PIN de 4 dígitos para mostrar al usuario
 */
export function decodePin(internalPin: string): string {
  if (!internalPin || internalPin.length !== LOGIN_CONSTANTS.INTERNAL_PIN_LENGTH) {
    throw new Error('PIN interno debe ser exactamente 6 caracteres')
  }
  
  // Remover padding del final: 1234AS -> 1234
  const userPin = internalPin.slice(0, LOGIN_CONSTANTS.PIN_LENGTH)
  
  // Verificar que el padding sea correcto
  const padding = internalPin.slice(LOGIN_CONSTANTS.PIN_LENGTH)
  if (padding !== LOGIN_CONSTANTS.PIN_PADDING) {
    throw new Error('PIN interno tiene formato inválido')
  }
  
  return userPin
}

/**
 * Valida que un PIN interno tenga el formato correcto
 * @param internalPin PIN interno a validar
 * @returns true si el formato es correcto
 */
export function validateInternalPin(internalPin: string): boolean {
  if (!internalPin || internalPin.length !== LOGIN_CONSTANTS.INTERNAL_PIN_LENGTH) {
    return false
  }
  
  const userPin = internalPin.slice(0, LOGIN_CONSTANTS.PIN_LENGTH)
  const padding = internalPin.slice(LOGIN_CONSTANTS.PIN_LENGTH)
  
  // Verificar que los primeros 4 caracteres sean dígitos
  if (!/^\d{4}$/.test(userPin)) {
    return false
  }
  
  // Verificar que el padding sea correcto
  if (padding !== LOGIN_CONSTANTS.PIN_PADDING) {
    return false
  }
  
  return true
}

/**
 * Genera un PIN aleatorio de 4 dígitos para nuevos usuarios
 * @returns PIN de 4 dígitos
 */
export function generateRandomPin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

/**
 * Genera un PIN interno aleatorio de 6 caracteres
 * @returns PIN interno de 6 caracteres
 */
export function generateRandomInternalPin(): string {
  const userPin = generateRandomPin()
  return encodePin(userPin)
}

