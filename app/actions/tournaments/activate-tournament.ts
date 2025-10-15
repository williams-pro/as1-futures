'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function activateTournament(tournamentId: string) {
  const supabase = await createServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data: scout } = await supabase
    .from('scouts')
    .select('role')
    .eq('id', user.id)
    .single()

  if (scout?.role !== 'admin') {
    return { success: false, error: 'Forbidden - Admin access required' }
  }

  try {
    // Trigger will automatically deactivate other tournaments
    const { error } = await supabase
      .from('tournaments')
      .update({ status: 'active' })
      .eq('id', tournamentId)

    if (error) throw error

    revalidatePath('/admin/tournaments')
    revalidatePath('/home')
    return { success: true }
  } catch (error) {
    console.error('[v0] Error activating tournament:', error)
    return { success: false, error: 'Failed to activate tournament' }
  }
}

