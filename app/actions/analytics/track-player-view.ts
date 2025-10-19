'use server'

import { createServerClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const TrackPlayerViewSchema = z.object({
  playerId: z.string().uuid(),
  tournamentId: z.string().uuid(),
  sessionId: z.string(),
  durationSeconds: z.number().int().min(0).optional(),
  hasScrolled: z.boolean().default(false),
  videoPlayed: z.boolean().default(false),
  statsExpanded: z.boolean().default(false),
  deviceType: z.enum(['mobile', 'tablet', 'desktop']).default('desktop')
})

export async function trackPlayerView(data: unknown) {
  try {
    const validatedFields = TrackPlayerViewSchema.safeParse(data)

    if (!validatedFields.success) {
      logger.warn('Invalid tracking data received', {
        operation: 'TRACK_PLAYER_VIEW',
        metadata: { 
          validationErrors: validatedFields.error.errors,
          receivedData: data
        }
      })
      return { success: false, error: 'Invalid input' }
    }

    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.authError('TRACK_PLAYER_VIEW', 'Unauthorized access attempt', undefined, authError || undefined)
      return { success: false, error: 'Unauthorized' }
    }

        const {
          playerId,
          tournamentId,
          sessionId,
          durationSeconds,
          hasScrolled,
          videoPlayed,
          statsExpanded,
          deviceType
        } = validatedFields.data


        const { error } = await supabase
          .from('player_views')
          .insert({
            scout_id: user.id,
            player_id: playerId,
            tournament_id: tournamentId,
            session_id: sessionId,
            duration_seconds: durationSeconds,
            scroll_depth_percentage: hasScrolled ? 100 : 0,
            video_played: videoPlayed,
            stats_expanded: statsExpanded,
            device_type: deviceType
          })

        if (error) {
          logger.databaseError('TRACK_PLAYER_VIEW', 'Failed to insert player view', user.id, error)
          logger.error('Database error details', {
            operation: 'TRACK_PLAYER_VIEW',
            userId: user.id,
            metadata: {
              errorCode: error.code,
              errorMessage: error.message,
              errorDetails: error.details,
              errorHint: error.hint,
              insertData: {
                scout_id: user.id,
                player_id: playerId,
                tournament_id: tournamentId,
                session_id: sessionId,
                duration_seconds: durationSeconds,
                scroll_depth_percentage: hasScrolled ? 100 : 0,
                video_played: videoPlayed,
                stats_expanded: statsExpanded,
                device_type: deviceType
              }
            }
          })
          throw error
        }

        return { success: true }
  } catch (error) {
    logger.error('Error tracking player view', {
      operation: 'TRACK_PLAYER_VIEW',
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    }, error instanceof Error ? error : undefined)
    
    return { success: false, error: 'Failed to track view' }
  }
}



