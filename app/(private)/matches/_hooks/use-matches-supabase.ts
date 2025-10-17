"use client"

import { useState, useEffect } from 'react'
import { getMatchesByGroup } from '@/app/actions/matches/get-matches-by-group'
import { getSpecialMatches } from '@/app/actions/admin/special-matches'
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
  isSpecialMatch?: boolean
  matchType?: string
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
        
        // Fetch regular matches and special matches in parallel
        const [regularMatchesResult, specialMatchesResult] = await Promise.all([
          getMatchesByGroup(groupCode),
          getSpecialMatches()
        ])
        
        const allMatches: MatchCardData[] = []
        
        // Process regular matches
        if (regularMatchesResult.success && regularMatchesResult.data) {
          const mappedRegularMatches: MatchCardData[] = regularMatchesResult.data.map(match => ({
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
            groupName: match.group.name,
            isSpecialMatch: false
          }))
          
          allMatches.push(...mappedRegularMatches)
        }
        
        // Process special matches
        if (specialMatchesResult.success && specialMatchesResult.matches) {
          const mappedSpecialMatches: MatchCardData[] = specialMatchesResult.matches.map(match => ({
            id: match.id,
            homeTeamId: match.home_team?.id || '',
            awayTeamId: match.away_team?.id || '',
            homeTeam: {
              id: match.home_team?.id || '',
              name: match.home_team?.name || match.home_team_display || 'TBD',
              logoUrl: match.home_team?.logo_url,
              isAS1Team: false // Special matches don't have AS1 team concept
            },
            awayTeam: {
              id: match.away_team?.id || '',
              name: match.away_team?.name || match.away_team_display || 'TBD',
              logoUrl: match.away_team?.logo_url,
              isAS1Team: false // Special matches don't have AS1 team concept
            },
            date: match.match_date,
            time: match.match_time,
            videoUrl: match.video_url,
            group: match.match_type, // Use match type as group for special matches
            groupName: match.match_type,
            isSpecialMatch: true,
            matchType: match.match_type
          }))
          
          allMatches.push(...mappedSpecialMatches)
        }
        
        // Sort all matches by date and time
        allMatches.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`)
          const dateB = new Date(`${b.date}T${b.time}`)
          return dateA.getTime() - dateB.getTime()
        })
        
        setMatches(allMatches)
        logger.database('USE_MATCHES_SUPABASE', 'Matches fetched successfully', undefined)
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



