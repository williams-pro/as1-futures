'use client'

import { useSupabaseAuth } from '@/hooks/use-supabase-auth'

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-as1-gold-50/10">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin mx-auto text-as1-gold border-2 border-as1-gold border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario, no renderizar nada (el middleware ya redirigió)
  if (!user) {
    return null
  }

  return <>{children}</>
}
