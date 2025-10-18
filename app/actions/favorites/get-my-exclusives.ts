'use server'

import { createServerClient } from '@/lib/supabase/server'

export async function getMyExclusives(tournamentId: string) {
  const supabase = await createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        scout_id,
        player_id,
        tournament_id,
        is_favorite,
        is_exclusive,
        display_order,
        favorite_display_order,
        created_at,
        updated_at,
        player:players!player_id(
          id,
          first_name,
          last_name,
          jersey_number,
          position,
          photo_url,
          team:teams!team_id(
            id,
            name,
            team_code,
            group:tournament_groups!group_id(
              id,
              name,
              code
            )
          )
        )
      `)
      .eq('scout_id', user.id)
      .eq('tournament_id', tournamentId)
      .eq('is_exclusive', true)
      .order('display_order', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('[v0] Supabase error getting exclusives:', error)
      throw error
    }

    return { success: true, players: data || [] }
  } catch (error) {
    console.error('[v0] Error getting exclusives:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { success: false, error: `Failed to get exclusives: ${errorMessage}` }
  }
}
