/**
 * Rate Limiter para autenticación
 * Previene ataques de fuerza bruta
 */

interface RateLimitEntry {
  attempts: number
  lastAttempt: number
  blockedUntil?: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

const RATE_LIMIT_CONFIG = {
  MAX_ATTEMPTS: 5,
  WINDOW_MS: 15 * 60 * 1000, // 15 minutos
  BLOCK_DURATION_MS: 30 * 60 * 1000, // 30 minutos
  CLEANUP_INTERVAL_MS: 60 * 60 * 1000, // 1 hora
} as const

/**
 * Verifica si una IP está bloqueada por rate limiting
 */
export function isRateLimited(identifier: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry) {
    return false
  }

  // Si está bloqueado, verificar si ya expiró
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return true
  }

  // Si el bloqueo expiró, limpiar la entrada
  if (entry.blockedUntil && now >= entry.blockedUntil) {
    rateLimitMap.delete(identifier)
    return false
  }

  // Verificar si está en la ventana de tiempo
  if (now - entry.lastAttempt > RATE_LIMIT_CONFIG.WINDOW_MS) {
    // Resetear contador si la ventana expiró
    rateLimitMap.delete(identifier)
    return false
  }

  return false
}

/**
 * Registra un intento de login
 */
export function recordLoginAttempt(identifier: string, success: boolean): void {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (success) {
    // Si el login fue exitoso, limpiar la entrada
    rateLimitMap.delete(identifier)
    return
  }

  if (!entry) {
    // Primera tentativa fallida
    rateLimitMap.set(identifier, {
      attempts: 1,
      lastAttempt: now,
    })
    return
  }

  // Incrementar contador
  entry.attempts += 1
  entry.lastAttempt = now

  // Si excede el límite, bloquear
  if (entry.attempts >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
    entry.blockedUntil = now + RATE_LIMIT_CONFIG.BLOCK_DURATION_MS
  }

  rateLimitMap.set(identifier, entry)
}

/**
 * Obtiene el tiempo restante de bloqueo
 */
export function getBlockTimeRemaining(identifier: string): number {
  const entry = rateLimitMap.get(identifier)
  if (!entry?.blockedUntil) return 0

  const now = Date.now()
  return Math.max(0, entry.blockedUntil - now)
}

/**
 * Limpia entradas expiradas
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.blockedUntil && now >= entry.blockedUntil) {
      rateLimitMap.delete(key)
    } else if (now - entry.lastAttempt > RATE_LIMIT_CONFIG.WINDOW_MS) {
      rateLimitMap.delete(key)
    }
  }
}

// Limpiar entradas expiradas cada hora
setInterval(cleanupExpiredEntries, RATE_LIMIT_CONFIG.CLEANUP_INTERVAL_MS)

