'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase, validateAuth } from '@/lib/supabase/utils'
import { ApiResponse } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'

interface AdminScout {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  role: 'scout' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
  last_login?: string
}

export async function getScouts(): Promise<ApiResponse<AdminScout[]>> {
  try {
    // 1. Autenticación
    const supabase = await getSupabaseServerClient()
    const user = await validateAuth(supabase, 'GET_SCOUTS')

    // 2. Obtener scouts con información de último login
    const { data: scouts, error: scoutsError } = await supabase
      .from('scouts')
      .select(`
        id,
        email,
        first_name,
        last_name,
        full_name,
        role,
        is_active,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })

    if (scoutsError) {
      logger.databaseError('GET_SCOUTS', 'Failed to fetch scouts', user.id, scoutsError)
      return createErrorResponseFromSupabase(scoutsError, 'GET_SCOUTS')
    }

    if (!scouts) {
      return {
        success: false,
        error: 'No scouts found',
        data: undefined
      }
    }

    // 3. Obtener información de último login desde auth.users
    const scoutIds = scouts.map(scout => scout.id)
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('id, last_sign_in_at')
      .in('id', scoutIds)

    // 4. Mapear datos combinando scouts con auth info
    const adminScouts: AdminScout[] = scouts.map(scout => {
      const authUser = authUsers?.find(auth => auth.id === scout.id)
      return {
        id: scout.id,
        email: scout.email,
        first_name: scout.first_name,
        last_name: scout.last_name,
        full_name: scout.full_name,
        role: scout.role as 'scout' | 'admin',
        is_active: scout.is_active,
        created_at: scout.created_at,
        updated_at: scout.updated_at,
        last_login: authUser?.last_sign_in_at || undefined
      }
    })

    logger.database('GET_SCOUTS', 'Scouts fetched successfully', user.id, {
      totalScouts: adminScouts.length,
      activeScouts: adminScouts.filter(s => s.is_active).length
    })

    return createSuccessResponse(adminScouts)
  } catch (error) {
    logger.error('GET_SCOUTS', 'Unexpected error', { operation: 'GET_SCOUTS' }, error)
    return createErrorResponseFromSupabase(error, 'GET_SCOUTS')
  }
}

