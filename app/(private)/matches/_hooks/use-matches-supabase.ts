"use client"

import { useState, useEffect } from 'react'
import { getMatchesByGroup } from '@/app/actions/matches/get-matches-by-group'
import { logger } from '@/lib/logger'

interface MatchDetails {
  id: string
  match_code: string
  group: {
    id: string
    name: string
    code: string
  }
  home_team: {
    id: string
    team_code: string
    name: string
    logo_url?: string
    is_as1_team: boolean
  }
  away_team: {
    id: string
    team_code: string
    name: string
    logo_url?: string
    is_as1_team: boolean
  }
  match_date: string
  match_time: string
  video_url?: string
}

// Tipo para compatibilidad con componentes existentes
export interface MatchCardData {
  id: string
  homeTeamId: string
  awayTeamId: string
  homeTeam: {
    id: string
    name: string
    logoUrl?: string
    isAS1Team: boolean
  }
  awayTeam: {
    id: string
    name: string
    logoUrl?: string
    isAS1Team: boolean
  }
  date: string
  time: string
  videoUrl?: string
  group: string
  groupName: string
}

export function useMatchesSupabase(groupCode?: string) {
  const [matches, setMatches] = useState<MatchCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        setError(null)
        
        logger.database('USE_MATCHES_SUPABASE', 'Fetching matches', undefined)
        
        const result = await getMatchesByGroup(groupCode)
        
        if (result.success && result.data) {
          // Mapear datos de Supabase a formato compatible con componentes existentes
          const mappedMatches: MatchCardData[] = result.data.map(match => ({
            id: match.id,
            homeTeamId: match.home_team.id,
            awayTeamId: match.away_team.id,
            homeTeam: {
              id: match.home_team.id,
              name: match.home_team.name,
              logoUrl: match.home_team.logo_url,
              isAS1Team: match.home_team.is_as1_team
            },
            awayTeam: {
              id: match.away_team.id,
              name: match.away_team.name,
              logoUrl: match.away_team.logo_url,
              isAS1Team: match.away_team.is_as1_team
            },
            date: match.match_date,
            time: match.match_time,
            videoUrl: match.video_url,
            group: match.group.code,
            groupName: match.group.name
          }))
          
          setMatches(mappedMatches)
          logger.database('USE_MATCHES_SUPABASE', 'Matches fetched successfully', undefined)
        } else {
          throw new Error(result.error || 'Failed to fetch matches')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        logger.error('Failed to fetch matches', { operation: 'USE_MATCHES_SUPABASE', metadata: { groupCode } }, err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [groupCode])

  return { 
    matches, 
    loading, 
    error 
  }
}



