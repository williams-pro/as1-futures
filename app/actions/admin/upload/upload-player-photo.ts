'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabaseForFileUpload, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse, FileUploadResult } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'

export async function uploadPlayerPhoto(formData: FormData): Promise<ApiResponse<FileUploadResult>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'UPLOAD_PLAYER_PHOTO')

    // 2. Obtener archivo
    const file = formData.get('file') as File
    const playerId = formData.get('player_id') as string

    if (!file) {
      logger.authError('UPLOAD_PLAYER_PHOTO', 'No file provided', user.id)
      return createErrorResponseFromSupabaseForFileUpload(new Error('No file provided'), 'UPLOAD_PLAYER_PHOTO')
    }

    if (!playerId) {
      logger.authError('UPLOAD_PLAYER_PHOTO', 'No player ID provided', user.id)
      return createErrorResponseFromSupabaseForFileUpload(new Error('No player ID provided'), 'UPLOAD_PLAYER_PHOTO')
    }

    // 3. Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      logger.authError('UPLOAD_PLAYER_PHOTO', 'Invalid file type', user.id, new Error(`Invalid file type: ${file.type}`))
      return createErrorResponseFromSupabaseForFileUpload(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), 'UPLOAD_PLAYER_PHOTO')
    }

    // 4. Validar tamaño (10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      logger.authError('UPLOAD_PLAYER_PHOTO', 'File too large', user.id, new Error(`File size: ${file.size} bytes`))
      return createErrorResponseFromSupabaseForFileUpload(new Error('File too large. Maximum size is 10MB.'), 'UPLOAD_PLAYER_PHOTO')
    }

    // 5. Generar nombre único
    const fileExt = file.name.split('.').pop()
    const fileName = `${playerId}_${Date.now()}.${fileExt}`
    const filePath = `photos/${fileName}` //player-photos in dev

    // 6. Subir archivo
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('players') // player-photos in dev
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      logger.databaseError('UPLOAD_PLAYER_PHOTO', 'Failed to upload file', user.id, uploadError)
      return createErrorResponseFromSupabaseForFileUpload(uploadError, 'UPLOAD_PLAYER_PHOTO')
    }

    // 7. Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('players')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    // 8. Actualizar URL en la base de datos
    const { error: updateError } = await supabase
      .from('players')
      .update({ photo_url: publicUrl })
      .eq('id', playerId)

    if (updateError) {
      logger.databaseError('UPLOAD_PLAYER_PHOTO', 'Failed to update player photo URL', user.id, updateError)
      // No fallar aquí, el archivo ya se subió
    }

    logger.database('UPLOAD_PLAYER_PHOTO', 'Player photo uploaded successfully', playerId)

    return createSuccessResponse({
      success: true,
      url: publicUrl
    })
  } catch (error) {
    logger.error('Unexpected error', { operation: 'UPLOAD_PLAYER_PHOTO' }, error as Error)
    return createErrorResponseFromSupabaseForFileUpload(error, 'UPLOAD_PLAYER_PHOTO')
  }
}



