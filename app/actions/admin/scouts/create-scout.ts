'use server'

import { getSupabaseServerClient, createAdminClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { encodePin } from '@/lib/pin-utils'

const CreateScoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.enum(['scout', 'admin']).default('scout'),
  pin: z.string().min(4, 'PIN must be at least 4 digits').max(4, 'PIN must be exactly 4 digits').regex(/^\d{4}$/, 'PIN must contain only numbers')
})

export async function createScout(formData: FormData): Promise<ApiResponse<{ id: string; email: string }>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'CREATE_SCOUT')

    // 2. Validación
    const data = CreateScoutSchema.parse({
      email: formData.get('email'),
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      role: formData.get('role') || 'scout',
      pin: formData.get('pin')
    })

    // 3. Crear usuario en auth.users con PIN codificado usando cliente admin
    const adminClient = createAdminClient()
    const encodedPin = encodePin(data.pin) // Usar función consistente con login
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: data.email,
      password: encodedPin,
      email_confirm: true,
      user_metadata: {
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role
      }
    })

    if (authError) {
      logger.databaseError('CREATE_SCOUT', 'Failed to create auth user', user.id, authError)
      return createErrorResponseFromSupabase(authError, 'CREATE_SCOUT')
    }

    if (!authUser.user) {
      return {
        success: false,
        error: 'Failed to create user',
        data: undefined
      }
    }

    // 4. Crear scout en tabla scouts
    const { data: scout, error: scoutError } = await supabase
      .from('scouts')
      .insert({
        id: authUser.user.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        is_active: true
      })
      .select()
      .single()

    if (scoutError) {
      // Si falla la creación del scout, eliminar el usuario de auth
      await adminClient.auth.admin.deleteUser(authUser.user.id)
      logger.databaseError('CREATE_SCOUT', 'Failed to create scout record', user.id, scoutError)
      return createErrorResponseFromSupabase(scoutError, 'CREATE_SCOUT')
    }

    logger.database('CREATE_SCOUT', 'Scout created successfully', user.id, {
      scoutId: scout.id,
      email: scout.email,
      role: scout.role
    })

    // 5. Revalidar cache
    revalidatePath('/admin')

    return createSuccessResponse({
      id: scout.id,
      email: scout.email
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
    
    logger.error('CREATE_SCOUT', 'Unexpected error', { operation: 'CREATE_SCOUT' }, error)
    return createErrorResponseFromSupabase(error, 'CREATE_SCOUT')
  }
}
