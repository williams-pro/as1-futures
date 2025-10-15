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

export async function getMatches(groupCode?: string): Promise<ApiResponse<MatchDetails[]>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'GET_MATCHES')

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
      .order('match_date', { ascending: false })
      .order('match_time', { ascending: false })

    // 3. Aplicar filtro de grupo si se especifica
    if (groupCode && groupCode !== 'all') {
      query = query.eq('group.code', groupCode)
    }

    const { data: matches, error: matchesError } = await query

    if (matchesError) {
      logger.databaseError('GET_MATCHES', 'Failed to fetch matches', user.id, matchesError)
      return createErrorResponseFromSupabase(matchesError, 'GET_MATCHES')
    }

    if (!matches) {
      return {
        success: false,
        error: 'No matches found',
        data: undefined
      }
    }

    // 4. Mapear datos para compatibilidad
    const matchDetails: MatchDetails[] = matches.map(match => ({
      id: match.id,
      match_code: match.match_code,
      group: {
        id: match.group?.id || '',
        name: match.group?.name || '',
        code: match.group?.code || ''
      },
      home_team: {
        id: match.home_team?.id || '',
        team_code: match.home_team?.team_code || '',
        name: match.home_team?.name || '',
        logo_url: match.home_team?.logo_url,
        is_as1_team: match.home_team?.is_as1_team || false
      },
      away_team: {
        id: match.away_team?.id || '',
        team_code: match.away_team?.team_code || '',
        name: match.away_team?.name || '',
        logo_url: match.away_team?.logo_url,
        is_as1_team: match.away_team?.is_as1_team || false
      },
      match_date: match.match_date,
      match_time: match.match_time,
      video_url: match.video_url
    }))

    logger.database('GET_MATCHES', 'Matches fetched successfully', user.id, {
      totalMatches: matchDetails.length,
      groupFilter: groupCode || 'all'
    })

    return createSuccessResponse(matchDetails)
  } catch (error) {
    logger.error('GET_MATCHES', 'Unexpected error', { operation: 'GET_MATCHES' }, error)
    return createErrorResponseFromSupabase(error, 'GET_MATCHES')
  }
}

