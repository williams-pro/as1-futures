'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse, FileUploadResult } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'

export async function uploadTeamLogo(formData: FormData): Promise<ApiResponse<FileUploadResult>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'UPLOAD_TEAM_LOGO')

    // 2. Obtener archivo
    const file = formData.get('file') as File
    const teamId = formData.get('team_id') as string

    if (!file) {
      logger.authError('UPLOAD_TEAM_LOGO', 'No file provided', user.id)
      return createErrorResponseFromSupabase(new Error('No file provided'), 'UPLOAD_TEAM_LOGO')
    }

    if (!teamId) {
      logger.authError('UPLOAD_TEAM_LOGO', 'No team ID provided', user.id)
      return createErrorResponseFromSupabase(new Error('No team ID provided'), 'UPLOAD_TEAM_LOGO')
    }

    // 3. Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      logger.authError('UPLOAD_TEAM_LOGO', 'Invalid file type', user.id, new Error(`Invalid file type: ${file.type}`))
      return createErrorResponseFromSupabase(new Error('Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.'), 'UPLOAD_TEAM_LOGO')
    }

    // 4. Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      logger.authError('UPLOAD_TEAM_LOGO', 'File too large', user.id, new Error(`File size: ${file.size} bytes`))
      return createErrorResponseFromSupabase(new Error('File too large. Maximum size is 5MB.'), 'UPLOAD_TEAM_LOGO')
    }

    // 5. Generar nombre único
    const fileExt = file.name.split('.').pop()
    const fileName = `${teamId}_${Date.now()}.${fileExt}`
    const filePath = `team-logos/${fileName}`

    // 6. Subir archivo
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('team-logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      logger.databaseError('UPLOAD_TEAM_LOGO', 'Failed to upload file', user.id, uploadError)
      return createErrorResponseFromSupabase(uploadError, 'UPLOAD_TEAM_LOGO')
    }

    // 7. Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('team-logos')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    // 8. Actualizar URL en la base de datos
    const { error: updateError } = await supabase
      .from('teams')
      .update({ logo_url: publicUrl })
      .eq('id', teamId)

    if (updateError) {
      logger.databaseError('UPLOAD_TEAM_LOGO', 'Failed to update team logo URL', user.id, updateError)
      // No fallar aquí, el archivo ya se subió
    }

    logger.database('UPLOAD_TEAM_LOGO', 'Team logo uploaded successfully', user.id, { 
      teamId, 
      fileName, 
      fileSize: file.size,
      url: publicUrl 
    })

    return createSuccessResponse({
      success: true,
      url: publicUrl
    })
  } catch (error) {
    logger.error('UPLOAD_TEAM_LOGO', 'Unexpected error', { operation: 'UPLOAD_TEAM_LOGO' }, error)
    return createErrorResponseFromSupabase(error, 'UPLOAD_TEAM_LOGO')
  }
}



