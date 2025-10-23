'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const RemoveFromFavoritesSchema = z.object({
  playerId: z.string().uuid(),
  tournamentId: z.string().uuid()
})

export async function removeFromFavorites(formData: FormData) {
  const validatedFields = RemoveFromFavoritesSchema.safeParse({
    playerId: formData.get('playerId'),
    tournamentId: formData.get('tournamentId')
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  const { playerId, tournamentId } = validatedFields.data

  const supabase = await createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // Update the favorite to mark as not favorite but preserve the record
    // Don't modify favorite_display_order as it's only relevant when is_favorite=true
    const { error } = await supabase
      .from('favorites')
      .update({ 
        is_favorite: false
      })
      .match({
        scout_id: user.id,
        player_id: playerId,
        tournament_id: tournamentId
      })

    if (error) throw error

    revalidatePath('/my-favorites')
    revalidatePath(`/players/${playerId}`)

    return { success: true }
  } catch (error) {
    console.error('[v0] Error removing from favorites:', error)
    return { success: false, error: 'Failed to remove from favorites' }
  }
}
