export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data
  }
}

export function createErrorResponse(error: string): ApiResponse {
  return {
    success: false,
    error
  }
}

export function createErrorResponseFromSupabase(error: any): ApiResponse {
  return {
    success: false,
    error: error?.message || 'An unexpected error occurred'
  }
}

export function createValidationErrorResponse(errors: Record<string, string[]>): ApiResponse {
  return {
    success: false,
    errors
  }
}

