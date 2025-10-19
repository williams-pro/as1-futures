'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSupabaseAuth } from '@/hooks/use-supabase-auth'
import { getActiveTournament } from '@/app/actions/tournaments/get-active-tournament'
import { logger } from '@/lib/logger'

interface AppContextType {
  // Información del usuario
  userId: string | null
  userRole: 'admin' | 'scout' | null
  
  // Información del torneo activo
  tournamentId: string | null
  tournamentName: string | null
  
  // Información de la sesión
  sessionId: string | null
  
  // Estados de carga
  isLoading: boolean
  error: string | null
  
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const { user, isLoading: authLoading } = useSupabaseAuth()
  const [tournamentId, setTournamentId] = useState<string | null>(null)
  const [tournamentName, setTournamentName] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar información del torneo activo
  useEffect(() => {
    const loadTournamentData = async () => {
      if (!user) {
        setTournamentId(null)
        setTournamentName(null)
        setSessionId(null)
        setIsLoading(false)
        return
      }

      // Evitar cargar si ya tenemos los datos
      if (tournamentId && sessionId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Obtener torneo activo solo si no lo tenemos
        if (!tournamentId) {
          const tournamentResult = await getActiveTournament()
          
          if (tournamentResult.success && tournamentResult.tournament) {
            setTournamentId(tournamentResult.tournament.id)
            setTournamentName(tournamentResult.tournament.name)
          } else {
            setError('No active tournament found')
          }
        }

        // Obtener session ID solo si no lo tenemos
        if (!sessionId) {
          const { getSupabaseBrowserClient } = await import('@/lib/supabase/client')
          const supabase = getSupabaseBrowserClient()
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.access_token) {
            setSessionId(session.access_token)
          }
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadTournamentData()
  }, [user, tournamentId, sessionId])

  const contextValue: AppContextType = {
    userId: user?.id || null,
    userRole: user?.role || null,
    tournamentId,
    tournamentName,
    sessionId,
    isLoading: authLoading || isLoading,
    error
  }


  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  
  return context
}
