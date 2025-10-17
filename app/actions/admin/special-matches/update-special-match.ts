"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import type { UpdateSpecialMatchData } from "@/lib/types/special-matches.types"

export async function updateSpecialMatch(data: UpdateSpecialMatchData) {
  try {
    const supabase = await getSupabaseServerClient()
    
    const { id, ...updateData } = data
    
    const { data: result, error } = await supabase
      .from('special_matches')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logger.error('Failed to update special match', { 
        operation: 'UPDATE_SPECIAL_MATCH',
        metadata: { matchId: id }
      }, error)
      return { success: false, error: 'Failed to update special match' }
    }

    logger.info('Special match updated successfully', { 
      operation: 'UPDATE_SPECIAL_MATCH',
      metadata: { matchId: id }
    })

    return { success: true, match: result }
  } catch (error) {
    logger.error('Error updating special match', { 
      operation: 'UPDATE_SPECIAL_MATCH' 
    }, error as Error)
    return { success: false, error: 'Internal server error' }
  }
}
