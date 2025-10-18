'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { CreatePlayerVideoSchema } from '@/lib/types/admin.types'

const CreatePlayerVideoParamsSchema = z.object({
  player_id: z.string().uuid(),
})

export async function createPlayerVideo(formData: FormData): Promise<ApiResponse> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'CREATE_PLAYER_VIDEO')

    // 2. Validación de parámetros
    const paramsResult = CreatePlayerVideoParamsSchema.safeParse({
      player_id: formData.get('player_id'),
    })
    
    if (!paramsResult.success) {
      logger.authError('CREATE_PLAYER_VIDEO', 'Invalid player ID', user.id, paramsResult.error)
      return createErrorResponseFromSupabase(paramsResult.error, 'CREATE_PLAYER_VIDEO')
    }

    // 3. Validación de datos del video
    const videoData = {
      video_url: formData.get('video_url'),
      video_type: formData.get('video_type') || 'highlight',
    }

    const dataResult = CreatePlayerVideoSchema.safeParse(videoData)
    
    if (!dataResult.success) {
      logger.authError('CREATE_PLAYER_VIDEO', 'Validation failed', user.id, dataResult.error)
      return createErrorResponseFromSupabase(dataResult.error, 'CREATE_PLAYER_VIDEO')
    }

    // 4. Verificar que el jugador existe
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('id, first_name, last_name')
      .eq('id', paramsResult.data.player_id)
      .single()

    if (playerError || !player) {
      logger.databaseError('CREATE_PLAYER_VIDEO', 'Player not found', user.id, playerError)
      return createErrorResponseFromSupabase(playerError || new Error('Player not found'), 'CREATE_PLAYER_VIDEO')
    }

    // 5. Obtener el siguiente display_order
    const { data: existingVideos, error: videosError } = await supabase
      .from('player_videos')
      .select('display_order')
      .eq('player_id', paramsResult.data.player_id)
      .order('display_order', { ascending: false })
      .limit(1)

    if (videosError) {
      logger.databaseError('CREATE_PLAYER_VIDEO', 'Failed to get existing videos', user.id, videosError)
      return createErrorResponseFromSupabase(videosError, 'CREATE_PLAYER_VIDEO')
    }

    const nextDisplayOrder = existingVideos && existingVideos.length > 0 
      ? (existingVideos[0].display_order + 1) 
      : 0

    // 6. Crear el video
    const { data, error } = await supabase
      .from('player_videos')
      .insert({
        player_id: paramsResult.data.player_id,
        video_url: dataResult.data.video_url,
        video_type: dataResult.data.video_type,
        display_order: nextDisplayOrder,
      })
      .select()
      .single()

    if (error) {
      logger.databaseError('CREATE_PLAYER_VIDEO', 'Failed to create player video', user.id, error)
      return createErrorResponseFromSupabase(error, 'CREATE_PLAYER_VIDEO')
    }

    // 7. Revalidar cache
    revalidatePath('/admin')
    revalidatePath('/admin/players')
    revalidatePath(`/players/${paramsResult.data.player_id}`)
    
    logger.database('CREATE_PLAYER_VIDEO', 'Player video created successfully', data.id)
    
    return createSuccessResponse(data)
  } catch (error) {
    logger.error('Unexpected error', { operation: 'CREATE_PLAYER_VIDEO' }, error as Error)
    return createErrorResponseFromSupabase(error, 'CREATE_PLAYER_VIDEO')
  }
}
