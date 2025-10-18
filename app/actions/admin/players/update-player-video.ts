'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { UpdatePlayerVideoSchema } from '@/lib/types/admin.types'

const UpdatePlayerVideoParamsSchema = z.object({
  video_id: z.string().uuid(),
})

export async function updatePlayerVideo(formData: FormData): Promise<ApiResponse> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'UPDATE_PLAYER_VIDEO')

    // 2. Validación de parámetros
    const paramsResult = UpdatePlayerVideoParamsSchema.safeParse({
      video_id: formData.get('video_id'),
    })
    
    if (!paramsResult.success) {
      logger.authError('UPDATE_PLAYER_VIDEO', 'Invalid video ID', user.id, paramsResult.error)
      return createErrorResponseFromSupabase(paramsResult.error, 'UPDATE_PLAYER_VIDEO')
    }

    // 3. Validación de datos del video
    const videoData: any = {}
    
    if (formData.get('video_url')) {
      videoData.video_url = formData.get('video_url')
    }
    if (formData.get('video_type')) {
      videoData.video_type = formData.get('video_type')
    }
    if (formData.get('display_order')) {
      videoData.display_order = Number(formData.get('display_order'))
    }

    const dataResult = UpdatePlayerVideoSchema.safeParse(videoData)
    
    if (!dataResult.success) {
      logger.authError('UPDATE_PLAYER_VIDEO', 'Validation failed', user.id, dataResult.error)
      return createErrorResponseFromSupabase(dataResult.error, 'UPDATE_PLAYER_VIDEO')
    }

    // 4. Verificar que el video existe
    const { data: existingVideo, error: videoError } = await supabase
      .from('player_videos')
      .select(`
        id,
        player_id,
        players!inner(id, first_name, last_name)
      `)
      .eq('id', paramsResult.data.video_id)
      .single()

    if (videoError || !existingVideo) {
      logger.databaseError('UPDATE_PLAYER_VIDEO', 'Video not found', user.id, videoError)
      return createErrorResponseFromSupabase(videoError || new Error('Video not found'), 'UPDATE_PLAYER_VIDEO')
    }

    // 5. Actualizar el video
    const { data, error } = await supabase
      .from('player_videos')
      .update({
        ...dataResult.data,
      })
      .eq('id', paramsResult.data.video_id)
      .select()
      .single()

    if (error) {
      logger.databaseError('UPDATE_PLAYER_VIDEO', 'Failed to update player video', user.id, error)
      return createErrorResponseFromSupabase(error, 'UPDATE_PLAYER_VIDEO')
    }

    // 6. Revalidar cache
    revalidatePath('/admin')
    revalidatePath('/admin/players')
    revalidatePath(`/players/${existingVideo.player_id}`)
    
    logger.database('UPDATE_PLAYER_VIDEO', 'Player video updated successfully', user.id, { 
      videoId: data.id, 
      playerId: existingVideo.player_id,
      playerName: `${existingVideo.players.first_name} ${existingVideo.players.last_name}`,
      videoUrl: data.video_url
    })
    
    return createSuccessResponse(data)
  } catch (error) {
    logger.error('UPDATE_PLAYER_VIDEO', 'Unexpected error', { operation: 'UPDATE_PLAYER_VIDEO' }, error)
    return createErrorResponseFromSupabase(error, 'CREATE_PLAYER_VIDEO')
  }
}
