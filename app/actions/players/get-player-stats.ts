'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function getPlayerStats(playerId: string) {
  const supabase = await getSupabaseServerClient()
  
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select(`
        id,
        category,
        metric,
        value_absolute,
        value_relative,
        updated_at
      `)
      .eq('player_id', playerId)
      .order('category', { ascending: true })
      .order('metric', { ascending: true })
    
    if (error) throw error
    
    return {
      success: true,
      data: data || []
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}