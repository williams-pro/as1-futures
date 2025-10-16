/**
 * Utilidades para manejar redirecciones en Server Actions
 */

/**
 * Verifica si un error es un NEXT_REDIRECT (comportamiento normal)
 */
export function isNextRedirect(error: unknown): boolean {
  return error instanceof Error && error.message === 'NEXT_REDIRECT'
}

/**
 * Maneja errores en Server Actions, ignorando NEXT_REDIRECT
 */
export function handleServerActionError(error: unknown, context: string): never {
  if (isNextRedirect(error)) {
    // Re-lanzar para que Next.js maneje la redirección
    throw error
  }
  
  // Loggear otros errores
  console.error(`[${context}] Unexpected error:`, error)
  throw new Error('An unexpected error occurred')
}



