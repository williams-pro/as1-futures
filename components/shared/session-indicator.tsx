"use client"

import { useState, useEffect } from 'react'
import { Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface SessionIndicatorProps {
  className?: string
  showText?: boolean
}

export function SessionIndicator({ className, showText = true }: SessionIndicatorProps) {
  const [sessionStatus, setSessionStatus] = useState<'loading' | 'valid' | 'expired' | 'error'>('loading')
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setSessionStatus('error')
          return
        }

        if (!session) {
          setSessionStatus('expired')
          return
        }

        // Check if session is expired
        const now = Math.floor(Date.now() / 1000)
        if (session.expires_at && session.expires_at < now) {
          setSessionStatus('expired')
          return
        }

        setSessionStatus('valid')
        
        // Calculate time left
        if (session.expires_at) {
          const timeLeftSeconds = session.expires_at - now
          setTimeLeft(timeLeftSeconds)
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setSessionStatus('error')
      }
    }

    checkSession()

    // Check every minute
    const interval = setInterval(checkSession, 60000)
    
    // Update time left every second
    const timeInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) return null
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(timeInterval)
    }
  }, [supabase.auth])

  const getStatusIcon = () => {
    switch (sessionStatus) {
      case 'loading':
        return <Clock className="w-4 h-4 animate-spin" />
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-orange-500" />
    }
  }

  const getStatusText = () => {
    switch (sessionStatus) {
      case 'loading':
        return 'Verificando sesión...'
      case 'valid':
        if (timeLeft && timeLeft < 300) { // Less than 5 minutes
          const minutes = Math.floor(timeLeft / 60)
          const seconds = timeLeft % 60
          return `Sesión expira en ${minutes}:${seconds.toString().padStart(2, '0')}`
        }
        return 'Sesión activa'
      case 'expired':
        return 'Sesión expirada'
      case 'error':
        return 'Error de sesión'
    }
  }

  const getStatusColor = () => {
    switch (sessionStatus) {
      case 'loading':
        return 'text-gray-500'
      case 'valid':
        return timeLeft && timeLeft < 300 ? 'text-orange-500' : 'text-green-500'
      case 'expired':
        return 'text-red-500'
      case 'error':
        return 'text-orange-500'
    }
  }

  if (sessionStatus === 'loading') {
    return null
  }

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm",
      getStatusColor(),
      className
    )}>
      {getStatusIcon()}
      {showText && (
        <span className="font-medium">
          {getStatusText()}
        </span>
      )}
    </div>
  )
}

