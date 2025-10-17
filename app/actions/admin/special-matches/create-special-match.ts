"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import type { CreateSpecialMatchData } from "@/lib/types/special-matches.types"

export async function createSpecialMatch(data: CreateSpecialMatchData) {
  try {
    const supabase = await getSupabaseServerClient()
    
    const { data: result, error } = await supabase
      .from('special_matches')
      .insert([data])
      .select()
      .single()

    if (error) {
      logger.error('Failed to create special match', { 
        operation: 'CREATE_SPECIAL_MATCH',
        metadata: { matchCode: data.match_code }
      }, error)
      return { success: false, error: 'Failed to create special match' }
    }

    logger.info('Special match created successfully', { 
      operation: 'CREATE_SPECIAL_MATCH',
      metadata: { matchId: result.id }
    })

    return { success: true, match: result }
  } catch (error) {
    logger.error('Error creating special match', { 
      operation: 'CREATE_SPECIAL_MATCH' 
    }, error as Error)
    return { success: false, error: 'Internal server error' }
  }
}
