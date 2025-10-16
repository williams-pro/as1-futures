/**
 * Tipos estándar para respuestas de API y Supabase
 */

// Respuesta base de API
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

// Respuesta específica para operaciones CRUD
export interface CrudResponse<T = unknown> extends ApiResponse<T> {
  count?: number
  affected?: number
}

// Respuesta para paginación
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Respuesta para autenticación
export interface AuthResponse extends ApiResponse {
  user?: {
    id: string
    email: string
    role: string
    isActive: boolean
  }
  session?: {
    accessToken: string
    refreshToken: string
    expiresAt: number
  }
}

// Tipos de error estándar
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  hint?: string
}

// Estados de operación
export type OperationStatus = 'idle' | 'loading' | 'success' | 'error'

// Configuración de paginación
export interface PaginationConfig {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Filtros comunes
export interface BaseFilters {
  search?: string
  isActive?: boolean
  createdAt?: {
    from?: string
    to?: string
  }
}

// Tipos para operaciones de base de datos
export interface DatabaseOperation<T = unknown> {
  operation: 'select' | 'insert' | 'update' | 'delete' | 'upsert'
  table: string
  data?: T
  filters?: Record<string, any>
  options?: {
    returning?: string
    count?: 'exact' | 'planned' | 'estimated'
  }
}

// Respuesta de validación
export interface ValidationResponse {
  isValid: boolean
  errors: Record<string, string[]>
  data?: any
}

// Configuración de cache
export interface CacheConfig {
  ttl?: number // Time to live in seconds
  tags?: string[]
  revalidate?: boolean
}

// Tipos para logging
export interface LogContext {
  operation: string
  userId?: string
  resourceId?: string
  metadata?: Record<string, any>
}

export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  context: LogContext
  timestamp: string
  stack?: string
}

// Tipos para upload de archivos
export interface FileUploadResult {
  success: boolean
  url: string
  fileName?: string
  fileSize?: number
}



