'use server'

import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const TrackPlayerInteractionSchema = z.object({
  playerId: z.string().uuid(),
  tournamentId: z.string().uuid(),
  actionType: z.enum(['favorite', 'exclusive', 'remove', 'video_play', 'stats_expand']),
  sessionId: z.string(),
  metadata: z.record(z.any()).optional()
})

export async function trackPlayerInteraction(data: unknown) {
  const validatedFields = TrackPlayerInteractionSchema.safeParse(data)

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid input' }
  }

  const supabase = await createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const {
    playerId,
    tournamentId,
    actionType,
    sessionId,
    metadata
  } = validatedFields.data

  try {
    const { error } = await supabase
      .from('player_interactions')
      .insert({
        scout_id: user.id,
        player_id: playerId,
        tournament_id: tournamentId,
        action_type: actionType,
        session_id: sessionId,
        metadata: metadata || {}
      })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('[v0] Error tracking player interaction:', error)
    return { success: false, error: 'Failed to track interaction' }
  }
}



