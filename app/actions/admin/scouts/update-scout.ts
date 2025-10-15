'use server'

import { getSupabaseServerClient, createAdminClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { encodePin } from '@/lib/pin-utils'

const UpdateScoutSchema = z.object({
  id: z.string().uuid('Invalid scout ID'),
  first_name: z.string().min(2, 'First name must be at least 2 characters').optional(),
  last_name: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  role: z.enum(['scout', 'admin']).optional(),
  is_active: z.boolean().optional(),
  pin: z.string().min(4, 'PIN must be at least 4 digits').max(4, 'PIN must be exactly 4 digits').regex(/^\d{4}$/, 'PIN must contain only numbers').optional()
})

export async function updateScout(formData: FormData): Promise<ApiResponse<{ id: string; email: string }>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'UPDATE_SCOUT')

    // 2. Validación
    const data = UpdateScoutSchema.parse({
      id: formData.get('id'),
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      role: formData.get('role'),
      is_active: formData.get('is_active') === 'true',
      pin: formData.get('pin')
    })

    // 3. Obtener scout actual
    const { data: currentScout, error: fetchError } = await supabase
      .from('scouts')
      .select('id, email, first_name, last_name, role, is_active')
      .eq('id', data.id)
      .single()

    if (fetchError || !currentScout) {
      logger.databaseError('UPDATE_SCOUT', 'Scout not found', user.id, fetchError)
      return {
        success: false,
        error: 'Scout not found',
        data: undefined
      }
    }

    // 4. Actualizar PIN si se proporciona
    if (data.pin) {
      const adminClient = createAdminClient()
      const encodedPin = encodePin(data.pin) // Usar función consistente con login
      const { error: passwordError } = await adminClient.auth.admin.updateUserById(data.id, {
        password: encodedPin
      })

      if (passwordError) {
        logger.databaseError('UPDATE_SCOUT', 'Failed to update password', user.id, passwordError)
        return createErrorResponseFromSupabase(passwordError, 'UPDATE_SCOUT')
      }
    }

    // 5. Actualizar datos del scout
    const updateData: any = {}
    if (data.first_name !== undefined) updateData.first_name = data.first_name
    if (data.last_name !== undefined) updateData.last_name = data.last_name
    if (data.role !== undefined) updateData.role = data.role
    if (data.is_active !== undefined) updateData.is_active = data.is_active

    if (Object.keys(updateData).length > 0) {
      const { data: updatedScout, error: updateError } = await supabase
        .from('scouts')
        .update(updateData)
        .eq('id', data.id)
        .select()
        .single()

      if (updateError) {
        logger.databaseError('UPDATE_SCOUT', 'Failed to update scout', user.id, updateError)
        return createErrorResponseFromSupabase(updateError, 'UPDATE_SCOUT')
      }

      logger.database('UPDATE_SCOUT', 'Scout updated successfully', user.id, {
        scoutId: updatedScout.id,
        email: updatedScout.email,
        changes: Object.keys(updateData)
      })
    }

    // 6. Revalidar cache
    revalidatePath('/admin')

    return createSuccessResponse({
      id: currentScout.id,
      email: currentScout.email
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
    
    logger.error('UPDATE_SCOUT', 'Unexpected error', { operation: 'UPDATE_SCOUT' }, error)
    return createErrorResponseFromSupabase(error, 'UPDATE_SCOUT')
  }
}
