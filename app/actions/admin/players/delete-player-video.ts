'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'

const DeletePlayerVideoParamsSchema = z.object({
  video_id: z.string().uuid(),
})

export async function deletePlayerVideo(formData: FormData): Promise<ApiResponse> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'DELETE_PLAYER_VIDEO')

    // 2. Validación de parámetros
    const paramsResult = DeletePlayerVideoParamsSchema.safeParse({
      video_id: formData.get('video_id'),
    })
    
    if (!paramsResult.success) {
      logger.authError('DELETE_PLAYER_VIDEO', 'Invalid video ID', user.id, paramsResult.error)
      return createErrorResponseFromSupabase(paramsResult.error, 'DELETE_PLAYER_VIDEO')
    }

    // 3. Verificar que el video existe y obtener información del jugador
    const { data: existingVideo, error: videoError } = await supabase
      .from('player_videos')
      .select(`
        id,
        player_id,
        video_url,
        players!inner(id, first_name, last_name)
      `)
      .eq('id', paramsResult.data.video_id)
      .single()

    if (videoError || !existingVideo) {
      logger.databaseError('DELETE_PLAYER_VIDEO', 'Video not found', user.id, videoError)
      return createErrorResponseFromSupabase(videoError || new Error('Video not found'), 'DELETE_PLAYER_VIDEO')
    }

    // 4. Eliminar el video
    const { error } = await supabase
      .from('player_videos')
      .delete()
      .eq('id', paramsResult.data.video_id)

    if (error) {
      logger.databaseError('DELETE_PLAYER_VIDEO', 'Failed to delete player video', user.id, error)
      return createErrorResponseFromSupabase(error, 'DELETE_PLAYER_VIDEO')
    }

    // 5. Revalidar cache
    revalidatePath('/admin')
    revalidatePath('/admin/players')
    revalidatePath(`/players/${existingVideo.player_id}`)
    
    logger.database('DELETE_PLAYER_VIDEO', 'Player video deleted successfully', user.id, { 
      videoId: paramsResult.data.video_id, 
      playerId: existingVideo.player_id,
      playerName: `${existingVideo.players.first_name} ${existingVideo.players.last_name}`,
      videoUrl: existingVideo.video_url
    })
    
    return createSuccessResponse({ deleted: true })
  } catch (error) {
    logger.error('DELETE_PLAYER_VIDEO', 'Unexpected error', { operation: 'DELETE_PLAYER_VIDEO' }, error)
    return createErrorResponseFromSupabase(error, 'DELETE_PLAYER_VIDEO')
  }
}
