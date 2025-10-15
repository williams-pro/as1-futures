'use server'

import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const TrackPlayerViewSchema = z.object({
  playerId: z.string().uuid(),
  tournamentId: z.string().uuid(),
  sessionId: z.string(),
  durationSeconds: z.number().int().min(0).optional(),
  scrollDepth: z.number().int().min(0).max(100).default(0),
  videoPlayed: z.boolean().default(false),
  statsExpanded: z.boolean().default(false),
  deviceType: z.enum(['mobile', 'tablet', 'desktop']).optional()
})

export async function trackPlayerView(data: unknown) {
  const validatedFields = TrackPlayerViewSchema.safeParse(data)

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
    sessionId,
    durationSeconds,
    scrollDepth,
    videoPlayed,
    statsExpanded,
    deviceType
  } = validatedFields.data

  try {
    const { error } = await supabase
      .from('player_views')
      .insert({
        scout_id: user.id,
        player_id: playerId,
        tournament_id: tournamentId,
        session_id: sessionId,
        duration_seconds: durationSeconds,
        scroll_depth_percentage: scrollDepth,
        video_played: videoPlayed,
        stats_expanded: statsExpanded,
        device_type: deviceType || 'desktop'
      })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('[v0] Error tracking player view:', error)
    return { success: false, error: 'Failed to track view' }
  }
}

