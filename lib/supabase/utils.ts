/**
 * Utilidades comunes para Supabase
 */

import { ApiResponse, ApiError } from './types'
import { logger } from '../logger'

/**
 * Maneja errores de Supabase de forma consistente
 */
export function handleSupabaseError(error: any, context: string): ApiError {
  if (!error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'Unknown error occurred'
    }
  }

  // Errores de autenticación
  if (error.message?.includes('JWT') || error.message?.includes('token')) {
    logger.authError('TOKEN_ERROR', 'JWT token error', undefined, error)
    return {
      code: 'AUTH_TOKEN_ERROR',
      message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
      details: { originalError: error.message }
    }
  }

  // Errores de permisos RLS
  if (error.code === 'PGRST301' || error.message?.includes('permission denied')) {
    logger.databaseError('RLS_ERROR', 'Row Level Security permission denied', undefined, error)
    return {
      code: 'PERMISSION_DENIED',
      message: 'No tienes permisos para realizar esta acción.',
      details: { originalError: error.message }
    }
  }

  // Errores de validación de datos
  if (error.code === 'PGRST116' || error.message?.includes('invalid input')) {
    logger.databaseError('VALIDATION_ERROR', 'Invalid input data', undefined, error)
    return {
      code: 'VALIDATION_ERROR',
      message: 'Datos no válidos. Verifica la información ingresada.',
      details: { originalError: error.message }
    }
  }

  // Errores de conexión
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    logger.error('Network connection error', { operation: 'NETWORK_ERROR', metadata: { context } }, error)
    return {
      code: 'NETWORK_ERROR',
      message: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
      details: { originalError: error.message }
    }
  }

  // Errores de rate limiting
  if (error.message?.includes('rate limit') || error.message?.includes('too many requests')) {
    logger.warn('Rate limit exceeded', { operation: 'RATE_LIMIT', metadata: { context } }, error)
    return {
      code: 'RATE_LIMIT',
      message: 'Demasiadas solicitudes. Espera un momento e intenta nuevamente.',
      details: { originalError: error.message }
    }
  }

  // Error genérico
  logger.error('Unknown Supabase error', { operation: 'UNKNOWN_ERROR', metadata: { context } }, error)
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'Ocurrió un error inesperado',
    details: { originalError: error.message }
  }
}

/**
 * Crea una respuesta de API consistente
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  errors?: Record<string, string[]>
): ApiResponse<T> {
  return {
    success,
    data,
    error,
    errors
  }
}

/**
 * Crea una respuesta de éxito
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return createApiResponse(true, data)
}

/**
 * Crea una respuesta de error
 */
export function createErrorResponse(
  error: string,
  errors?: Record<string, string[]>
): ApiResponse {
  return createApiResponse(false, undefined, error, errors)
}

/**
 * Crea una respuesta de error desde excepción de Supabase
 */
export function createErrorResponseFromSupabase(
  error: any,
  context: string
): ApiResponse {
  const apiError = handleSupabaseError(error, context)
  return createErrorResponse(apiError.message, {
    [apiError.code]: [apiError.message]
  })
}

/**
 * Valida que el usuario esté autenticado
 */
export async function validateAuth(supabase: any, context: string) {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    logger.authError('VALIDATE_AUTH', 'Error validating user', undefined, error)
    throw new Error('Error validating authentication')
  }

  if (!user) {
    logger.authError('VALIDATE_AUTH', 'No authenticated user found', undefined)
    throw new Error('User not authenticated')
  }

  logger.auth('VALIDATE_AUTH', 'User authenticated successfully', user.id)
  return user
}

/**
 * Valida que el usuario tenga un rol específico
 */
export async function validateUserRole(
  supabase: any,
  userId: string,
  requiredRole: string,
  context: string
) {
  const { data: userData, error } = await supabase
    .from('scouts')
    .select('role, is_active')
    .eq('id', userId)
    .single()

  if (error) {
    logger.databaseError('VALIDATE_ROLE', 'Error fetching user role', userId, error)
    throw new Error('Error validating user role')
  }

  if (!userData) {
    logger.authError('VALIDATE_ROLE', 'User not found in database', userId)
    throw new Error('User not found')
  }

  if (!userData.is_active) {
    logger.authError('VALIDATE_ROLE', 'User account is inactive', userId)
    throw new Error('User account is inactive')
  }

  if (userData.role !== requiredRole) {
    logger.authError('VALIDATE_ROLE', `User role ${userData.role} does not match required role ${requiredRole}`, userId)
    throw new Error('Insufficient permissions')
  }

  logger.auth('VALIDATE_ROLE', `User role validated: ${userData.role}`, userId)
  return userData
}

/**
 * Construye filtros de consulta de forma segura
 */
export function buildQueryFilters(filters: Record<string, any>) {
  const validFilters: Record<string, any> = {}
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      validFilters[key] = value
    }
  })
  
  return validFilters
}

/**
 * Construye opciones de consulta para paginación
 */
export function buildPaginationOptions(page: number = 1, limit: number = 10) {
  const from = (page - 1) * limit
  const to = from + limit - 1
  
  return {
    from,
    to,
    count: 'exact' as const
  }
}

/**
 * Procesa resultado de consulta paginada
 */
export function processPaginatedResult<T>(
  data: T[],
  count: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(count / limit)
  
  return {
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}
