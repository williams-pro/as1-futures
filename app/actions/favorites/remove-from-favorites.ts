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
    // Remove the favorite completely from the database
    const { error } = await supabase
      .from('favorites')
      .delete()
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
