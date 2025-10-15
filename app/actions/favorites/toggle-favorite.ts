'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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
      const { error } = await supabase
        .from('favorites')
        .insert({
          scout_id: user.id,
          player_id: playerId,
          tournament_id: tournamentId,
          is_favorite: true,
          is_exclusive: false
        })

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('favorites')
        .delete()
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
