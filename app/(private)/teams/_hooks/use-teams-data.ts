"use client"

import { useState, useEffect } from 'react'
import { getTeamsByGroup } from '@/app/actions/teams/get-teams-by-group'
import type { GroupType } from '@/lib/types'
import { logger } from '@/lib/logger'

interface TeamWithPlayerCount {
  id: string
  team_code: string
  name: string
  logo_url?: string
  is_as1_team: boolean
  group_id: string
  group?: {
    id: string
    name: string
    code: string
  }
  playerCount: number
}

// Tipo para compatibilidad con el componente TeamCard
export interface TeamCardData {
  id: string
  team_code: string
  name: string
  logo_url?: string
  is_as1_team: boolean
  group_id: string
  groupInfo?: {
    id: string
    name: string
    code: string
  }
  playerCount: number
  // Mapeo de propiedades para compatibilidad
  group: GroupType
  isAS1Team: boolean
  logoUrl?: string
}

export function useTeamsData(group: GroupType | 'all') {
  const [teams, setTeams] = useState<TeamCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true)
        setError(null)
        
        logger.database('USE_TEAMS_DATA', `Fetching teams for group: ${group}`, undefined)
        
        const result = await getTeamsByGroup(group === 'all' ? 'all' : group)
        
        if (result.success && result.data && Array.isArray(result.data)) {
          // Mapear datos de Supabase a formato compatible con TeamCard
          const mappedTeams: TeamCardData[] = result.data.map((team: any) => ({
            ...team,
            groupInfo: team.group,
            group: team.group?.code as GroupType || 'A',
            isAS1Team: team.is_as1_team,
            logoUrl: team.logo_url,
          }))
          
          setTeams(mappedTeams)
          logger.database('USE_TEAMS_DATA', `Teams fetched successfully for group: ${group}, count: ${mappedTeams.length}`, undefined)
        } else {
          throw new Error(result.error || 'Failed to fetch teams')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        logger.error('Failed to fetch teams', { operation: 'USE_TEAMS_DATA', metadata: { group } })
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [group])

  return { 
    teams, 
    loading, 
    error 
  }
}
