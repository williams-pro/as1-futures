"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"

export async function deleteSpecialMatch(matchId: string) {
  try {
    const supabase = await getSupabaseServerClient()
    
    const { error } = await supabase
      .from('special_matches')
      .delete()
      .eq('id', matchId)

    if (error) {
      logger.error('Failed to delete special match', { 
        operation: 'DELETE_SPECIAL_MATCH',
        metadata: { matchId }
      }, error)
      return { success: false, error: 'Failed to delete special match' }
    }

    logger.info('Special match deleted successfully', { 
      operation: 'DELETE_SPECIAL_MATCH',
      metadata: { matchId }
    })

    return { success: true }
  } catch (error) {
    logger.error('Error deleting special match', { 
      operation: 'DELETE_SPECIAL_MATCH' 
    }, error as Error)
    return { success: false, error: 'Internal server error' }
  }
}
