'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const CreateMatchSchema = z.object({
  match_code: z.string().min(3, 'Match code must be at least 3 characters'),
  tournament_id: z.string().uuid('Invalid tournament ID'),
  group_id: z.string().uuid('Invalid group ID'),
  home_team_id: z.string().uuid('Invalid home team ID'),
  away_team_id: z.string().uuid('Invalid away team ID'),
  match_date: z.string().min(1, 'Match date is required'),
  match_time: z.string().min(1, 'Match time is required'),
  video_url: z.string().url('Invalid video URL').optional().or(z.literal(''))
})

export async function createMatch(formData: FormData): Promise<ApiResponse<{ id: string; match_code: string }>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'CREATE_MATCH')

    // 2. Validación
    const videoUrl = formData.get('video_url')
    const rawData = {
      match_code: formData.get('match_code'),
      tournament_id: formData.get('tournament_id'),
      group_id: formData.get('group_id'),
      home_team_id: formData.get('home_team_id'),
      away_team_id: formData.get('away_team_id'),
      match_date: formData.get('match_date'),
      match_time: formData.get('match_time'),
      video_url: videoUrl ? videoUrl.toString() : ''
    }
    
    console.log('Raw form data:', rawData)
    
    const data = CreateMatchSchema.parse(rawData)

    // 3. Validar que los equipos sean diferentes
    if (data.home_team_id === data.away_team_id) {
      return {
        success: false,
        error: 'Home team and away team must be different',
        data: undefined
      }
    }

    // 4. Validar que los equipos pertenezcan al grupo seleccionado
    const { data: homeTeam, error: homeTeamError } = await supabase
      .from('teams')
      .select('id, group_id')
      .eq('id', data.home_team_id)
      .single()

    const { data: awayTeam, error: awayTeamError } = await supabase
      .from('teams')
      .select('id, group_id')
      .eq('id', data.away_team_id)
      .single()

    if (homeTeamError || !homeTeam) {
      return {
        success: false,
        error: 'Home team not found',
        data: undefined
      }
    }

    if (awayTeamError || !awayTeam) {
      return {
        success: false,
        error: 'Away team not found',
        data: undefined
      }
    }

    if (homeTeam.group_id !== data.group_id || awayTeam.group_id !== data.group_id) {
      return {
        success: false,
        error: 'Both teams must belong to the selected group',
        data: undefined
      }
    }

    // 5. Crear el match
    const matchData: any = {
      match_code: data.match_code,
      tournament_id: data.tournament_id,
      group_id: data.group_id,
      home_team_id: data.home_team_id,
      away_team_id: data.away_team_id,
      match_date: data.match_date,
      match_time: data.match_time
    }

    if (data.video_url && data.video_url.trim() !== '') {
      matchData.video_url = data.video_url
    }

    const { data: match, error: matchError } = await supabase
      .from('matches')
      .insert(matchData)
      .select()
      .single()

    if (matchError) {
      logger.databaseError('CREATE_MATCH', 'Failed to create match', user.id, matchError)
      return createErrorResponseFromSupabase(matchError, 'CREATE_MATCH')
    }

    logger.database('CREATE_MATCH', 'Match created successfully', user.id, {
      matchId: match.id,
      matchCode: match.match_code,
      tournamentId: match.tournament_id,
      groupId: match.group_id
    })

    // 6. Revalidar cache
    revalidatePath('/admin')

    return createSuccessResponse({
      id: match.id,
      match_code: match.match_code
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
        data: undefined,
        errors: error.flatten().fieldErrors
      }
    }
    
    logger.error('CREATE_MATCH', 'Unexpected error', { operation: 'CREATE_MATCH' }, error)
    return createErrorResponseFromSupabase(error, 'CREATE_MATCH')
  }
}
