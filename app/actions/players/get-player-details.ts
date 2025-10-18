'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
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
  player_videos: {
    id: string
    video_url: string
    video_type: string
    display_order: number
  }[]
}

export async function getPlayerDetails(playerId: string): Promise<ApiResponse<PlayerDetails>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'GET_PLAYER_DETAILS')

    // 2. Obtener detalles del jugador con información del equipo, torneo y videos
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select(`
        id,
        first_name,
        last_name,
        jersey_number,
        position,
        photo_url,
        dominant_foot,
        height_cm,
        date_of_birth,
        team:teams!team_id(
          id,
          team_code,
          name,
          logo_url,
          is_as1_team,
          group:tournament_groups!group_id(
            id,
            name,
            code
          )
        ),
        tournament:tournaments!tournament_id(
          id,
          name,
          year
        ),
        player_videos(
          id,
          video_url,
          video_type,
          display_order
        )
      `)
      .eq('id', playerId)
      .single()

    if (playerError) {
      logger.databaseError('GET_PLAYER_DETAILS', 'Failed to fetch player', user.id, playerError)
      return createErrorResponseFromSupabase(playerError, 'GET_PLAYER_DETAILS')
    }

    if (!player) {
      return {
        success: false,
        error: 'Player not found',
        data: undefined
      }
    }

    // 3. Log datos para debugging
    logger.database('GET_PLAYER_DETAILS', 'Building player details response', user.id, {
      playerId,
      player: {
        id: player.id,
        name: `${player.first_name} ${player.last_name}`,
        team: player.team
      }
    })

    // 4. Construir respuesta
    const playerDetails: PlayerDetails = {
      id: player.id,
      first_name: player.first_name,
      last_name: player.last_name,
      jersey_number: player.jersey_number,
      position: player.position,
      photo_url: player.photo_url,
      dominant_foot: player.dominant_foot,
      height_cm: player.height_cm,
      date_of_birth: player.date_of_birth,
      team: {
        id: player.team?.id || '',
        team_code: player.team?.team_code || '',
        name: player.team?.name || '',
        logo_url: player.team?.logo_url,
        is_as1_team: player.team?.is_as1_team || false,
        group: {
          id: player.team?.group?.id || '',
          name: player.team?.group?.name || '',
          code: player.team?.group?.code || ''
        }
      },
      tournament: {
        id: player.tournament?.id || '',
        name: player.tournament?.name || '',
        year: player.tournament?.year || 0
      },
      player_videos: player.player_videos || []
    }

    logger.database('GET_PLAYER_DETAILS', 'Player details fetched successfully', user.id, {
      playerId,
      playerName: `${playerDetails.first_name} ${playerDetails.last_name}`,
      teamName: playerDetails.team.name
    })

    return createSuccessResponse(playerDetails)
  } catch (error) {
    logger.error('GET_PLAYER_DETAILS', 'Unexpected error', { operation: 'GET_PLAYER_DETAILS' }, error)
    return createErrorResponseFromSupabase(error, 'GET_PLAYER_DETAILS')
  }
}