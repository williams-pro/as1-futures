"use client"

import { useState, useEffect } from 'react'
import { getTournamentGroups } from '@/app/actions/tournaments/get-tournament-groups'
import { logger } from '@/lib/logger'

interface TournamentGroup {
  id: string
  name: string
  code: string
}

export function useTournamentGroups() {
  const [groups, setGroups] = useState<TournamentGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true)
        setError(null)
        
        logger.database('USE_TOURNAMENT_GROUPS', 'Fetching tournament groups', undefined)
        
        const result = await getTournamentGroups()
        
        console.log('Tournament groups result:', result)
        
        if (result.success && result.groups) {
          setGroups(result.groups)
          logger.database('USE_TOURNAMENT_GROUPS', `Tournament groups fetched successfully, count: ${result.groups.length}`, undefined)
        } else {
          console.error('Failed to fetch tournament groups:', result.error)
          throw new Error(result.error || 'Failed to fetch tournament groups')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        logger.error('Failed to fetch tournament groups', { operation: 'USE_TOURNAMENT_GROUPS' }, err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  return { 
    groups, 
    loading, 
    error 
  }
}
