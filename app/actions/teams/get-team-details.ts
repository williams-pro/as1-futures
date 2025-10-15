'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
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

export async function getTeamDetails(teamId: string): Promise<ApiResponse<TeamDetails>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'GET_TEAM_DETAILS')

    // 2. Obtener detalles del equipo
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select(`
        id,
        team_code,
        name,
        logo_url,
        is_as1_team,
        group_id,
        group:tournament_groups(
          id,
          name,
          code
        )
      `)
      .eq('id', teamId)
      .single()

    if (teamError) {
      logger.databaseError('GET_TEAM_DETAILS', 'Failed to fetch team', user.id, teamError)
      return createErrorResponseFromSupabase(teamError, 'GET_TEAM_DETAILS')
    }

    if (!team) {
      return {
        success: false,
        error: 'Team not found',
        data: undefined
      }
    }

    // 3. Obtener jugadores del equipo
    const { data: players, error: playersError } = await supabase
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
        date_of_birth
      `)
      .eq('team_id', teamId)
      .order('jersey_number', { ascending: true })

    if (playersError) {
      logger.databaseError('GET_TEAM_DETAILS', 'Failed to fetch players', user.id, playersError)
      return createErrorResponseFromSupabase(playersError, 'GET_TEAM_DETAILS')
    }

    // 4. Obtener partidos del equipo (como local y visitante)
    const { data: homeMatches, error: homeMatchesError } = await supabase
      .from('matches')
      .select(`
        id,
        match_code,
        match_date,
        match_time,
        video_url,
        home_team:teams!matches_home_team_id_fkey(
          id,
          name,
          team_code
        ),
        away_team:teams!matches_away_team_id_fkey(
          id,
          name,
          team_code
        )
      `)
      .eq('home_team_id', teamId)
      .order('match_date', { ascending: true })

    const { data: awayMatches, error: awayMatchesError } = await supabase
      .from('matches')
      .select(`
        id,
        match_code,
        match_date,
        match_time,
        video_url,
        home_team:teams!matches_home_team_id_fkey(
          id,
          name,
          team_code
        ),
        away_team:teams!matches_away_team_id_fkey(
          id,
          name,
          team_code
        )
      `)
      .eq('away_team_id', teamId)
      .order('match_date', { ascending: true })

    if (homeMatchesError || awayMatchesError) {
      logger.databaseError('GET_TEAM_DETAILS', 'Failed to fetch matches', user.id, homeMatchesError || awayMatchesError)
      return createErrorResponseFromSupabase(homeMatchesError || awayMatchesError, 'GET_TEAM_DETAILS')
    }

    // 5. Procesar partidos
    const allMatches = [
      ...(homeMatches || []).map(match => ({
        ...match,
        is_home: true,
        home_team: match.home_team?.[0] || { id: '', name: '', team_code: '' },
        away_team: match.away_team?.[0] || { id: '', name: '', team_code: '' }
      })),
      ...(awayMatches || []).map(match => ({
        ...match,
        is_home: false,
        home_team: match.home_team?.[0] || { id: '', name: '', team_code: '' },
        away_team: match.away_team?.[0] || { id: '', name: '', team_code: '' }
      }))
    ].sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())

    // 6. Log datos para debugging
    logger.database('GET_TEAM_DETAILS', 'Building team details response', user.id, {
      teamId,
      team: {
        id: team.id,
        name: team.name,
        group: team.group
      },
      playersCount: players?.length || 0,
      homeMatchesCount: homeMatches?.length || 0,
      awayMatchesCount: awayMatches?.length || 0
    })

    // 7. Construir respuesta
    const teamDetails: TeamDetails = {
      id: team.id,
      team_code: team.team_code,
      name: team.name,
      logo_url: team.logo_url,
      is_as1_team: team.is_as1_team,
      group_id: team.group_id,
      group: {
        id: team.group?.id || '',
        code: team.group?.code || '',
        name: team.group?.name || ''
      },
      players: players || [],
      matches: allMatches
    }

    logger.database('GET_TEAM_DETAILS', 'Team details fetched successfully', user.id, {
      teamId,
      playersCount: teamDetails.players.length,
      matchesCount: teamDetails.matches.length
    })

    return createSuccessResponse(teamDetails)
  } catch (error) {
    logger.error('GET_TEAM_DETAILS', 'Unexpected error', { operation: 'GET_TEAM_DETAILS' }, error)
    return createErrorResponseFromSupabase(error, 'GET_TEAM_DETAILS')
  }
}