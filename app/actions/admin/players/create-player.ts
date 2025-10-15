'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { CreatePlayerSchema } from '@/lib/types/admin.types'

export async function createPlayer(formData: FormData): Promise<ApiResponse> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'CREATE_PLAYER')

    // 2. Validación
    const photoUrl = formData.get('photo_url') as string
    const result = CreatePlayerSchema.safeParse({
      tournament_id: formData.get('tournament_id'),
      team_id: formData.get('team_id'),
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      jersey_number: Number(formData.get('jersey_number')),
      position: formData.get('position'),
      dominant_foot: formData.get('dominant_foot'),
      height_cm: Number(formData.get('height_cm')),
      date_of_birth: formData.get('date_of_birth'),
      photo_url: photoUrl === '' ? null : photoUrl,
    })
    
    if (!result.success) {
      logger.authError('CREATE_PLAYER', 'Validation failed', user.id, result.error)
      return createErrorResponseFromSupabase(result.error, 'CREATE_PLAYER')
    }

    // 3. Verificar que el torneo y equipo existen
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('id, name')
      .eq('id', result.data.tournament_id)
      .single()

    if (tournamentError || !tournament) {
      logger.databaseError('CREATE_PLAYER', 'Tournament not found', user.id, tournamentError)
      return createErrorResponseFromSupabase(tournamentError || new Error('Tournament not found'), 'CREATE_PLAYER')
    }

    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name, tournament_id')
      .eq('id', result.data.team_id)
      .eq('tournament_id', result.data.tournament_id)
      .single()

    if (teamError || !team) {
      logger.databaseError('CREATE_PLAYER', 'Team not found or does not belong to tournament', user.id, teamError)
      return createErrorResponseFromSupabase(teamError || new Error('Team not found'), 'CREATE_PLAYER')
    }

    // 4. Verificar que el número de camiseta no esté en uso en el equipo
    const { data: existingPlayer, error: jerseyError } = await supabase
      .from('players')
      .select('id, first_name, last_name')
      .eq('team_id', result.data.team_id)
      .eq('jersey_number', result.data.jersey_number)
      .single()

    if (existingPlayer) {
      logger.databaseError('CREATE_PLAYER', 'Jersey number already in use', user.id, new Error('Jersey number conflict'))
      return createErrorResponseFromSupabase(
        new Error(`Jersey number ${result.data.jersey_number} is already used by ${existingPlayer.first_name} ${existingPlayer.last_name}`),
        'CREATE_PLAYER'
      )
    }

    // 5. Operación en DB
    const { data, error } = await supabase
      .from('players')
      .insert({
        ...result.data,
        // No incluir full_name ya que es una columna generada
      })
      .select(`
        *,
        team:teams(id, name, team_code)
      `)
      .single()

    if (error) {
      logger.databaseError('CREATE_PLAYER', 'Failed to create player', user.id, error)
      return createErrorResponseFromSupabase(error, 'CREATE_PLAYER')
    }

    // 6. Revalidar cache
    revalidatePath('/admin')
    revalidatePath('/admin/players')
    revalidatePath(`/admin/tournaments/${result.data.tournament_id}`)
    revalidatePath(`/admin/teams/${result.data.team_id}`)
    
    logger.database('CREATE_PLAYER', 'Player created successfully', user.id, { 
      playerId: data.id, 
      playerName: data.full_name,
      teamId: result.data.team_id 
    })
    return createSuccessResponse(data)
  } catch (error) {
    logger.error('CREATE_PLAYER', 'Unexpected error', { operation: 'CREATE_PLAYER' }, error)
    return createErrorResponseFromSupabase(error, 'CREATE_PLAYER')
  }
}
