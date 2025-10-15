'use server'

import { createServerClient } from '@/lib/supabase/server'

export async function listTournaments(status?: 'draft' | 'active' | 'completed' | 'archived') {
  const supabase = await createServerClient()

  try {
    let query = supabase
      .from('tournaments')
      .select('*')
      .order('year', { ascending: false })
      .order('start_date', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, tournaments: data }
  } catch (error) {
    console.error('[v0] Error listing tournaments:', error)
    return { success: false, error: 'Failed to list tournaments' }
  }
}

