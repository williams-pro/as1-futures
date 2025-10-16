'use server'

import { createServerClient } from '@/lib/supabase/server'

export async function getActiveTournament() {
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('status', 'active')
      .single()

    if (error) {
      // No active tournament
      return { success: true, tournament: null }
    }

    return { success: true, tournament: data }
  } catch (error) {
    console.error('[v0] Error getting active tournament:', error)
    return { success: false, error: 'Failed to get active tournament' }
  }
}



