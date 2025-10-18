'use server'

import { createServerClient } from '@/lib/supabase/server'
import { createSuccessResponse, createErrorResponseFromSupabase } from '@/lib/supabase/utils'
import { logger } from '@/lib/logger'

interface ReorderFavoritesRequest {
  tournamentId: string
  reorderedFavorites: Array<{
    id: string
    display_order?: number        // Para exclusivos
    favorite_display_order?: number // Para favoritos
  }>
}

/**
 * Reorder favorites by updating their display_order and/or favorite_display_order in the database
 * @param tournamentId - Tournament ID
 * @param reorderedFavorites - Array of favorite IDs with their new order
 * @returns Success response or error
 */
export async function reorderFavorites(tournamentId: string, reorderedFavorites: Array<{ id: string; display_order?: number; favorite_display_order?: number }>) {
  try {
    const supabase = await createServerClient()
    
    // Check if we have a valid session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      return createErrorResponseFromSupabase(sessionError, 'REORDER_FAVORITES')
    }
    
    if (!session) {
      return createErrorResponseFromSupabase({ message: 'No session found' }, 'REORDER_FAVORITES')
    }

    if (reorderedFavorites.length === 0) {
      return createSuccessResponse({ message: 'No favorites to reorder' })
    }

    logger.database('REORDER_FAVORITES', `Reordering ${reorderedFavorites.length} favorites with optimized approach`, tournamentId)

    // Update each favorite with appropriate order values
    const updatePromises = reorderedFavorites.map(favorite => {
      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      // Solo actualizar las columnas que se proporcionan
      if (favorite.display_order !== undefined) {
        updateData.display_order = favorite.display_order
      }
      if (favorite.favorite_display_order !== undefined) {
        updateData.favorite_display_order = favorite.favorite_display_order
      }

      return supabase
        .from('favorites')
        .update(updateData)
        .eq('id', favorite.id)
        .eq('scout_id', session.user.id)
        .eq('tournament_id', tournamentId)
    })

    const results = await Promise.all(updatePromises)
    
    // Check for any errors
    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      logger.databaseError('REORDER_FAVORITES', 'Error updating favorite order', tournamentId, errors[0].error as Error)
      return createErrorResponseFromSupabase(errors[0].error, 'REORDER_FAVORITES')
    }

    logger.database('REORDER_FAVORITES', `Successfully reordered ${reorderedFavorites.length} favorites`, tournamentId)

    return createSuccessResponse({ 
      message: 'Favorites reordered successfully',
      updatedCount: reorderedFavorites.length
    })
  } catch (error) {
    logger.databaseError('REORDER_FAVORITES', 'Unexpected error reordering favorites', tournamentId, error instanceof Error ? error : new Error(String(error)))
    return createErrorResponseFromSupabase(error, 'REORDER_FAVORITES')
  }
}



