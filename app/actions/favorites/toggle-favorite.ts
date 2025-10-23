'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getNextDisplayOrder } from '@/app/(private)/favorites/_utils'

const ToggleFavoriteSchema = z.object({
  playerId: z.string().uuid(),
  tournamentId: z.string().uuid(),
  isFavorite: z.boolean()
})

export async function toggleFavorite(formData: FormData) {
  const validatedFields = ToggleFavoriteSchema.safeParse({
    playerId: formData.get('playerId'),
    tournamentId: formData.get('tournamentId'),
    isFavorite: formData.get('isFavorite') === 'true'
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  const { playerId, tournamentId, isFavorite } = validatedFields.data

  const supabase = await createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    if (isFavorite) {
      // Get the next available favorite display order
      const nextFavoriteOrder = await getNextDisplayOrder(user.id, tournamentId, 'favorite')
      
      // Use upsert to handle both new records and existing records that were marked as not favorite
      const { error } = await supabase
        .from('favorites')
        .upsert({
          scout_id: user.id,
          player_id: playerId,
          tournament_id: tournamentId,
          is_favorite: true,
          is_exclusive: false,
          favorite_display_order: nextFavoriteOrder}, {
          onConflict: 'scout_id,player_id,tournament_id'
        })

      if (error) throw error
    } else {
      // Update to mark as not favorite but preserve the record
      // Don't modify favorite_display_order as it's only relevant when is_favorite=true
      const { error } = await supabase
        .from('favorites')
        .update({ 
          is_favorite: false})
        .match({
          scout_id: user.id,
          player_id: playerId,
          tournament_id: tournamentId,
          is_exclusive: false
        })

      if (error) throw error
    }

    revalidatePath('/my-favorites')
    revalidatePath(`/players/${playerId}`)

    return { success: true }
  } catch (error) {
    console.error('[v0] Error toggling favorite:', error)
    return { success: false, error: 'Failed to update favorite' }
  }
}
