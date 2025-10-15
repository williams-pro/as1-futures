'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ToggleExclusiveSchema = z.object({
  playerId: z.string().uuid(),
  tournamentId: z.string().uuid(),
  isExclusive: z.boolean()
})

export async function toggleExclusive(formData: FormData) {
  const validatedFields = ToggleExclusiveSchema.safeParse({
    playerId: formData.get('playerId'),
    tournamentId: formData.get('tournamentId'),
    isExclusive: formData.get('isExclusive') === 'true'
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  const { playerId, tournamentId, isExclusive } = validatedFields.data

  const supabase = await createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    if (isExclusive) {
      const { count } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('scout_id', user.id)
        .eq('tournament_id', tournamentId)
        .eq('is_exclusive', true)

      if (count && count >= 3) {
        return {
          success: false,
          error: 'Maximum 3 exclusive players per tournament'
        }
      }

      const { error } = await supabase
        .from('favorites')
        .upsert({
          scout_id: user.id,
          player_id: playerId,
          tournament_id: tournamentId,
          is_favorite: true,
          is_exclusive: true
        }, {
          onConflict: 'scout_id,player_id,tournament_id'
        })

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('favorites')
        .update({ is_exclusive: false })
        .match({
          scout_id: user.id,
          player_id: playerId,
          tournament_id: tournamentId
        })

      if (error) throw error
    }

    revalidatePath('/my-favorites')
    revalidatePath(`/players/${playerId}`)

    return { success: true }
  } catch (error) {
    console.error('[v0] Error toggling exclusive:', error)
    return { success: false, error: 'Failed to update exclusive status' }
  }
}
