"use client"

import { useState, useEffect } from 'react'
import { getTeamDetails } from '@/app/actions/teams/get-team-details'
import { logger } from '@/lib/logger'

interface TeamDetails {
  id: string
  team_code: string
  name: string
  logo_url?: string
  is_as1_team: boolean
  group_id: string
  group: {
    id: string
    name: string
    code: string
  }
  players: {
    id: string
    first_name: string
    last_name: string
    jersey_number: number
    position: string
    photo_url?: string
    dominant_foot: string
    height_cm: number
    date_of_birth: string
  }[]
  matches: {
    id: string
    match_code: string
    match_date: string
    match_time: string
    video_url?: string
    home_team: {
      id: string
      name: string
      team_code: string
    }
    away_team: {
      id: string
      name: string
      team_code: string
    }
    is_home: boolean
  }[]
}

// Tipo para compatibilidad con componentes existentes
export interface TeamDetailData {
  id: string
  team_code: string
  name: string
  logoUrl?: string
  isAS1Team: boolean
  group: string
  groupName: string
  players: {
    id: string
    firstName: string
    lastName: string
    jerseyNumber: number
    position: string
    photoUrl?: string
    dominantFoot: string
    height: number
    birthDate: string
  }[]
  matches: {
    id: string
    matchCode: string
    matchDate: string
    matchTime: string
    videoUrl?: string
    homeTeam: {
      id: string
      name: string
      teamCode: string
    }
    awayTeam: {
      id: string
      name: string
      teamCode: string
    }
    isHome: boolean
  }[]
}

export function useTeamDetailsSupabase(teamId: string) {
  const [teamDetails, setTeamDetails] = useState<TeamDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        logger.database('USE_TEAM_DETAILS_SUPABASE', 'Fetching team details', undefined, { teamId })
        
        const result = await getTeamDetails(teamId)
        
        if (result.success && result.data) {
          // Mapear datos de Supabase a formato compatible con componentes existentes
          const mappedTeamDetails: TeamDetailData = {
            id: result.data.id,
            team_code: result.data.team_code,
            name: result.data.name,
            logoUrl: result.data.logo_url,
            isAS1Team: result.data.is_as1_team,
            group: result.data.group.code,
            groupName: result.data.group.name,
            players: result.data.players.map(player => ({
              id: player.id,
              firstName: player.first_name,
              lastName: player.last_name,
              jerseyNumber: player.jersey_number,
              position: player.position,
              photoUrl: player.photo_url,
              dominantFoot: player.dominant_foot,
              height: player.height_cm,
              birthDate: player.date_of_birth
            })),
            matches: result.data.matches.map(match => ({
              id: match.id,
              matchCode: match.match_code,
              matchDate: match.match_date,
              matchTime: match.match_time,
              videoUrl: match.video_url,
              homeTeam: {
                id: match.home_team.id,
                name: match.home_team.name,
                teamCode: match.home_team.team_code
              },
              awayTeam: {
                id: match.away_team.id,
                name: match.away_team.name,
                teamCode: match.away_team.team_code
              },
              isHome: match.is_home
            }))
          }
          
          setTeamDetails(mappedTeamDetails)
          logger.database('USE_TEAM_DETAILS_SUPABASE', 'Team details fetched successfully', undefined, { 
            teamId,
            playersCount: mappedTeamDetails.players.length,
            matchesCount: mappedTeamDetails.matches.length
          })
        } else {
          throw new Error(result.error || 'Failed to fetch team details')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        logger.error('USE_TEAM_DETAILS_SUPABASE', 'Failed to fetch team details', { teamId }, err)
      } finally {
        setLoading(false)
      }
    }

    if (teamId) {
      fetchTeamDetails()
    }
  }, [teamId])

  return { 
    teamDetails, 
    loading, 
    error 
  }
}
