/**
 * Utilidades de seguridad para prevenir timing attacks
 */

/**
 * Aplica un delay aleatorio para prevenir timing attacks
 * @param minMs Tiempo mínimo en milisegundos
 * @param maxMs Tiempo máximo en milisegundos
 */
export function randomDelay(minMs: number = 100, maxMs: number = 300): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  return new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * Aplica un delay fijo para normalizar tiempos de respuesta
 * @param ms Tiempo en milisegundos
 */
export function fixedDelay(ms: number = 200): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Sanitiza mensajes de error para no revelar información sensible
 * @param error Error original
 * @param genericMessage Mensaje genérico a mostrar
 */
export function sanitizeErrorMessage(error: unknown, genericMessage: string): string {
  // En producción, siempre devolver mensaje genérico
  if (process.env.NODE_ENV === 'production') {
    return genericMessage
  }
  
  // En desarrollo, mostrar error real para debugging
  if (error instanceof Error) {
    return error.message
  }
  
  return genericMessage
}

/**
 * Valida que un email tenga formato válido sin revelar si existe
 * @param email Email a validar
 */
export function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida que un PIN tenga formato válido
 * @param pin PIN a validar
 */
export function isValidPinFormat(pin: string): boolean {
  const pinRegex = /^\d{4}$/
  return pinRegex.test(pin)
}



