/**
 * Sistema de logging estándar para AS1 Futures
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

export interface LogContext {
  operation: string
  userId?: string
  resourceId?: string
  metadata?: Record<string, any>
}

export interface LogEntry {
  level: LogLevel
  message: string
  context: LogContext
  timestamp: string
  stack?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  private formatMessage(level: LogLevel, message: string, context: LogContext, error?: Error): string {
    const timestamp = new Date().toISOString()
    const contextStr = context.operation ? `[${context.operation}]` : ''
    const userStr = context.userId ? `[user:${context.userId}]` : ''
    const resourceStr = context.resourceId ? `[resource:${context.resourceId}]` : ''
    
    return `${timestamp} ${level.toUpperCase()} ${contextStr}${userStr}${resourceStr} ${message}`
  }

  private log(level: LogLevel, message: string, context: LogContext, error?: Error) {
    const formattedMessage = this.formatMessage(level, message, context, error)
    
    // En desarrollo, usar console con colores
    if (this.isDevelopment) {
      const colors = {
        info: '\x1b[36m',    // Cyan
        warn: '\x1b[33m',    // Yellow
        error: '\x1b[31m',   // Red
        debug: '\x1b[90m',   // Gray
      }
      
      const reset = '\x1b[0m'
      console.log(`${colors[level]}${formattedMessage}${reset}`)
      
      if (error?.stack) {
        console.log(`${colors[level]}${error.stack}${reset}`)
      }
    } else {
      // En producción, usar console estándar
      console.log(formattedMessage)
      
      if (error?.stack) {
        console.log(error.stack)
      }
    }

    // En producción, enviar a servicio de monitoreo
    if (this.isProduction) {
      this.sendToMonitoring(level, message, context, error)
    }
  }

  private sendToMonitoring(level: LogLevel, message: string, context: LogContext, error?: Error) {
    // TODO: Integrar con servicio de monitoreo (Sentry, LogRocket, etc.)
    // Por ahora, solo log en consola
  }

  info(message: string, context: LogContext) {
    this.log('info', message, context)
  }

  warn(message: string, context: LogContext, error?: Error) {
    this.log('warn', message, context, error)
  }

  error(message: string, context: LogContext, error?: Error) {
    this.log('error', message, context, error)
  }

  debug(message: string, context: LogContext) {
    if (this.isDevelopment) {
      this.log('debug', message, context)
    }
  }

  // Métodos específicos para Supabase
  supabase(operation: string, message: string, userId?: string, error?: Error) {
    this.log('info', message, { operation: `SUPABASE_${operation}`, userId }, error)
  }

  supabaseError(operation: string, message: string, userId?: string, error?: Error) {
    this.log('error', message, { operation: `SUPABASE_${operation}`, userId }, error)
  }

  // Métodos específicos para autenticación
  auth(operation: string, message: string, userId?: string, error?: Error) {
    this.log('info', message, { operation: `AUTH_${operation}`, userId }, error)
  }

  authError(operation: string, message: string, userId?: string, error?: Error) {
    this.log('error', message, { operation: `AUTH_${operation}`, userId }, error)
  }

  // Métodos específicos para operaciones de base de datos
  database(operation: string, message: string, resourceId?: string, error?: Error) {
    this.log('info', message, { operation: `DB_${operation}`, resourceId }, error)
  }

  databaseError(operation: string, message: string, resourceId?: string, error?: Error) {
    this.log('error', message, { operation: `DB_${operation}`, resourceId }, error)
  }
}

// Instancia singleton
export const logger = new Logger()

// Funciones de conveniencia
export function logError(context: string, error: unknown, userId?: string) {
  logger.error(
    error instanceof Error ? error.message : 'Unknown error',
    { operation: context, userId },
    error instanceof Error ? error : undefined
  )
}

export function logInfo(context: string, message: string, userId?: string) {
  logger.info(message, { operation: context, userId })
}

export function logWarning(context: string, message: string, userId?: string, error?: Error) {
  logger.warn(message, { operation: context, userId }, error)
}

export function logDebug(context: string, message: string, userId?: string) {
  logger.debug(message, { operation: context, userId })
}



