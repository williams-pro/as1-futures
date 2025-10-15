'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { signOut } from '@/app/actions/auth/sign-out'
import type { User } from '@supabase/supabase-js'

interface ScoutUser extends User {
  role?: 'admin' | 'scout'
}

export function useSupabaseAuth() {
  const [user, setUser] = useState<ScoutUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        try {
          if (session?.user) {
            setUser(session.user)
          } else {
            setUser(null)
            // Solo redirigir en SIGNED_OUT, no en otros eventos
            if (event === 'SIGNED_OUT') {
              /* router.push('/') */
            }
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          setUser(null)
        } finally {
          setIsLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const logout = async () => {
    try {
      // Limpiar estado local inmediatamente
      setUser(null)
      setIsLoading(true)
      
      // Usar Server Action para logout con revalidación
      await signOut()
      
      // El Server Action maneja la redirección con redirect()
    } catch (error) {
      console.error('Logout error:', error)
      // Asegurar que el estado se limpie incluso si hay error
      setUser(null)
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    logout
  }
}