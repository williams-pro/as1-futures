"use client"

import { useState, useEffect } from 'react'
import { getPlayerDetails } from '@/app/actions/players/get-player-details'
import { logger } from '@/lib/logger'

interface PlayerDetails {
  id: string
  first_name: string
  last_name: string
  jersey_number: number
  position: string
  photo_url?: string
  dominant_foot: string
  height_cm: number
  date_of_birth: string
  team: {
    id: string
    team_code: string
    name: string
    logo_url?: string
    is_as1_team: boolean
    group: {
      id: string
      name: string
      code: string
    }
  }
  tournament: {
    id: string
    name: string
    year: number
  }
}

// Tipo para compatibilidad con componentes existentes
export interface PlayerDetailData {
  id: string
  firstName: string
  lastName: string
  jerseyNumber: number
  position: string
  photoUrl?: string
  dominantFoot: string
  height: number
  birthDate: string
  teamId: string
  team: {
    id: string
    team_code: string
    name: string
    logoUrl?: string
    isAS1Team: boolean
    group: string
    groupName: string
  }
  tournament: {
    id: string
    name: string
    year: number
  }
}

export function usePlayerDetailsSupabase(playerId: string) {
  const [playerDetails, setPlayerDetails] = useState<PlayerDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        logger.database('USE_PLAYER_DETAILS_SUPABASE', 'Fetching player details', undefined, { playerId })
        
        const result = await getPlayerDetails(playerId)
        
        if (result.success && result.data) {
          // Mapear datos de Supabase a formato compatible con componentes existentes
          const mappedPlayerDetails: PlayerDetailData = {
            id: result.data.id,
            firstName: result.data.first_name,
            lastName: result.data.last_name,
            jerseyNumber: result.data.jersey_number,
            position: result.data.position,
            photoUrl: result.data.photo_url,
            dominantFoot: result.data.dominant_foot,
            height: result.data.height_cm,
            birthDate: result.data.date_of_birth,
            teamId: result.data.team.id,
            team: {
              id: result.data.team.id,
              team_code: result.data.team.team_code,
              name: result.data.team.name,
              logoUrl: result.data.team.logo_url,
              isAS1Team: result.data.team.is_as1_team,
              group: result.data.team.group.code,
              groupName: result.data.team.group.name
            },
            tournament: {
              id: result.data.tournament.id,
              name: result.data.tournament.name,
              year: result.data.tournament.year
            }
          }
          
          setPlayerDetails(mappedPlayerDetails)
          logger.database('USE_PLAYER_DETAILS_SUPABASE', 'Player details fetched successfully', undefined, { 
            playerId,
            playerName: `${mappedPlayerDetails.firstName} ${mappedPlayerDetails.lastName}`,
            teamName: mappedPlayerDetails.team.name
          })
        } else {
          throw new Error(result.error || 'Failed to fetch player details')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        logger.error('USE_PLAYER_DETAILS_SUPABASE', 'Failed to fetch player details', { playerId }, err)
      } finally {
        setLoading(false)
      }
    }

    if (playerId) {
      fetchPlayerDetails()
    }
  }, [playerId])

  return { 
    playerDetails, 
    loading, 
    error 
  }
}



