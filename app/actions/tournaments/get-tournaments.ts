'use server'

import { createServerClient } from '@/lib/supabase/server'

export async function getTournaments() {
  const supabase = await createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('id, name, start_date, end_date, status')
      .eq('status', 'active')
      .order('start_date', { ascending: false })

    if (error) {
      console.error('[v0] Supabase error getting tournaments:', error)
      throw error
    }

    console.log('[v0] Active tournaments found:', data?.length || 0)
    return { success: true, tournaments: data || [] }
  } catch (error) {
    console.error('[v0] Error getting tournaments:', error)
    return { success: false, error: `Failed to get tournaments: ${error.message || error}` }
  }
}
