'use server'

import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const GetPlayersSchema = z.object({
  tournamentId: z.string().uuid(),
  teamId: z.string().uuid().optional(),
  position: z.enum(['Forward', 'Midfielder', 'Defender', 'Goalkeeper']).optional(),
  search: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0)
})

export async function getPlayers(params: unknown) {
  const validatedParams = GetPlayersSchema.safeParse(params)

  if (!validatedParams.success) {
    return {
      success: false,
      error: 'Invalid parameters',
      errors: validatedParams.error.flatten().fieldErrors
    }
  }

  const { tournamentId, teamId, position, search, limit, offset } = validatedParams.data

  const supabase = await createServerClient()

  try {
    let query = supabase
      .from('players')
      .select(`
        *,
        team:teams(id, name, team_code, group:tournament_groups(code, name)),
        player_videos(id, video_url, video_type, display_order)
      `)
      .eq('tournament_id', tournamentId)
      .order('last_name', { ascending: true })
      .range(offset, offset + limit - 1)

    if (teamId) {
      query = query.eq('team_id', teamId)
    }

    if (position) {
      query = query.eq('position', position)
    }

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) throw error

    return { success: true, players: data, total: count }
  } catch (error) {
    console.error('[v0] Error getting players:', error)
    return { success: false, error: 'Failed to get players' }
  }
}
