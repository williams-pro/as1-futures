'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
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

export async function getMatchesByGroup(group?: string): Promise<ApiResponse<MatchDetails[]>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'GET_MATCHES_BY_GROUP')

    // 2. Construir query base
    let query = supabase
      .from('matches')
      .select(`
        id,
        match_code,
        group:tournament_groups!group_id(
          id,
          name,
          code
        ),
        home_team:teams!home_team_id(
          id,
          team_code,
          name,
          logo_url,
          is_as1_team
        ),
        away_team:teams!away_team_id(
          id,
          team_code,
          name,
          logo_url,
          is_as1_team
        ),
        match_date,
        match_time,
        video_url
      `)
      .order('match_date', { ascending: true })
      .order('match_time', { ascending: true })

    // 3. Filtrar por grupo si se especifica
    if (group && group !== 'all') {
      // Primero necesitamos obtener el group_id del grupo
      const { data: groupData } = await supabase
        .from('tournament_groups')
        .select('id')
        .eq('code', group)
        .single()
      
      if (groupData?.id) {
        query = query.eq('group_id', groupData.id)
        logger.database('GET_MATCHES_BY_GROUP', `Filtering by group_id: ${groupData.id} for group: ${group}`, user.id)
      }
    }

    // 4. Ejecutar query
    const { data: matches, error: matchesError } = await query

    if (matchesError) {
      logger.databaseError('GET_MATCHES_BY_GROUP', 'Failed to fetch matches', user.id, matchesError)
      return createErrorResponseFromSupabase(matchesError, 'GET_MATCHES_BY_GROUP') as ApiResponse<MatchDetails[]>
    }

    if (!matches) {
      return {
        success: false,
        error: 'No matches found',
        data: undefined
      }
    }

    // 5. Mapear datos para compatibilidad
    const matchDetails: MatchDetails[] = matches.map(match => ({
      id: match.id,
      match_code: match.match_code,
      group: {
        id: (match.group as any)?.id || '',
        name: (match.group as any)?.name || '',
        code: (match.group as any)?.code || ''
      },
      home_team: {
        id: (match.home_team as any)?.id || '',
        team_code: (match.home_team as any)?.team_code || '',
        name: (match.home_team as any)?.name || '',
        logo_url: (match.home_team as any)?.logo_url,
        is_as1_team: (match.home_team as any)?.is_as1_team || false
      },
      away_team: {
        id: (match.away_team as any)?.id || '',
        team_code: (match.away_team as any)?.team_code || '',
        name: (match.away_team as any)?.name || '',
        logo_url: (match.away_team as any)?.logo_url,
        is_as1_team: (match.away_team as any)?.is_as1_team || false
      },
      match_date: match.match_date,
      match_time: match.match_time,
      video_url: match.video_url
    }))

    logger.database('GET_MATCHES_BY_GROUP', `Matches fetched successfully for group: ${group || 'all'}, count: ${matchDetails.length}`, user.id)

    // Debug: Log de matches por grupo
    if (group && group !== 'all') {
      const groupMatches = matchDetails.filter(match => match.group.code === group)
      logger.database('GET_MATCHES_BY_GROUP', `Matches for group ${group}: ${groupMatches.map(m => m.match_code).join(', ')}`, user.id)
    }

    return createSuccessResponse(matchDetails)
  } catch (error) {
    logger.error('Unexpected error', { operation: 'GET_MATCHES_BY_GROUP' }, error as Error)
    return createErrorResponseFromSupabase(error, 'GET_MATCHES_BY_GROUP') as ApiResponse<MatchDetails[]>
  }
}
