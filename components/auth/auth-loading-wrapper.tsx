'use client'

import { useSupabaseAuth } from '@/hooks/use-supabase-auth'
import { AppLoading } from '@/components/shared/app-loading'

interface AuthLoadingWrapperProps {
  children: React.ReactNode
}

/**
 * AuthLoadingWrapper maneja el loading state inicial de autenticación.
 * La verificación de autenticación y autorización se hace en el middleware.
 * Este componente solo proporciona una mejor UX durante la carga inicial.
 */
export function AuthLoadingWrapper({ children }: AuthLoadingWrapperProps) {
  const { user, isLoading } = useSupabaseAuth()

  // Mostrar loading mientras se carga la autenticación inicial
  if (isLoading) {
    return <AppLoading message="Validating session..." />
  }

  // Si no hay usuario, no renderizar nada (el middleware ya redirigió)
  if (!user) {
    return null
  }

  return <>{children}</>
}
