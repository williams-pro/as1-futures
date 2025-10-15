'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const DeleteScoutSchema = z.object({
  id: z.string().uuid('Invalid scout ID')
})

export async function deleteScout(formData: FormData): Promise<ApiResponse<{ id: string }>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'DELETE_SCOUT')

    // 2. Validación
    const data = DeleteScoutSchema.parse({
      id: formData.get('id')
    })

    // 3. Verificar que no sea el usuario actual
    if (data.id === user.id) {
      return {
        success: false,
        error: 'Cannot delete your own account',
        data: undefined
      }
    }

    // 4. Obtener información del scout antes de eliminar
    const { data: scout, error: fetchError } = await supabase
      .from('scouts')
      .select('id, email, first_name, last_name')
      .eq('id', data.id)
      .single()

    if (fetchError || !scout) {
      logger.databaseError('DELETE_SCOUT', 'Scout not found', user.id, fetchError)
      return {
        success: false,
        error: 'Scout not found',
        data: undefined
      }
    }

    // 5. Eliminar scout de la tabla scouts (esto también eliminará el usuario de auth.users por CASCADE)
    const { error: deleteError } = await supabase
      .from('scouts')
      .delete()
      .eq('id', data.id)

    if (deleteError) {
      logger.databaseError('DELETE_SCOUT', 'Failed to delete scout', user.id, deleteError)
      return createErrorResponseFromSupabase(deleteError, 'DELETE_SCOUT')
    }

    logger.database('DELETE_SCOUT', 'Scout deleted successfully', user.id, {
      scoutId: scout.id,
      email: scout.email,
      name: `${scout.first_name} ${scout.last_name}`
    })

    // 6. Revalidar cache
    revalidatePath('/admin')

    return createSuccessResponse({
      id: scout.id
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
        data: undefined,
        errors: error.flatten().fieldErrors
      }
    }
    
    logger.error('DELETE_SCOUT', 'Unexpected error', { operation: 'DELETE_SCOUT' }, error)
    return createErrorResponseFromSupabase(error, 'DELETE_SCOUT')
  }
}
