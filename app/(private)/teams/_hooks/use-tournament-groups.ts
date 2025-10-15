'use client'

import { useState, useEffect } from 'react'
import { getTournamentGroups } from '@/app/actions/tournaments/get-tournament-groups'
import { logger } from '@/lib/logger'

export interface TournamentGroup {
  id: string
  name: string
  code: string
  tournament_id: string
  tournament?: {
    id: string
    name: string
    status: string
  }
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
        
        logger.database('USE_TOURNAMENT_GROUPS', 'Fetching tournament groups')
        
        const result = await getTournamentGroups()
        
        if (result.success && result.groups) {
          // Mapear los datos de Supabase al formato esperado
          const mappedGroups: TournamentGroup[] = result.groups.map((group: any) => ({
            id: group.id,
            name: group.name,
            code: group.code,
            tournament_id: group.tournament_id,
            tournament: Array.isArray(group.tournament) && group.tournament.length > 0 
              ? group.tournament[0] 
              : undefined
          }))
          
          setGroups(mappedGroups)
          logger.database('USE_TOURNAMENT_GROUPS', `Tournament groups fetched successfully: ${mappedGroups.length} groups`)
        } else {
          throw new Error(result.error || 'Failed to fetch tournament groups')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        logger.error('Failed to fetch tournament groups', { operation: 'USE_TOURNAMENT_GROUPS' })
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
