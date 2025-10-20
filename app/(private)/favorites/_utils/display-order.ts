import { createServerClient } from '@/lib/supabase/server'
import { DisplayOrderType, NextDisplayOrderResult, DisplayOrderQueryResult, FavoriteDisplayOrderQueryResult } from '../_types/display-order'
import { DISPLAY_ORDER_CONSTANTS } from '../_constants/display-order'

/**
 * Get the next available display order for a specific type (exclusive or favorite)
 * @param scoutId - The scout's user ID
 * @param tournamentId - The tournament ID
 * @param type - Either 'exclusive' for display_order or 'favorite' for favorite_display_order
 * @returns The next available order number (0-based)
 */
export async function getNextDisplayOrder(
  scoutId: string,
  tournamentId: string,
  type: DisplayOrderType
): Promise<number> {
  const supabase = await createServerClient()
  
  const column = DISPLAY_ORDER_CONSTANTS.COLUMN_MAPPING[type]
  
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(column)
      .eq('scout_id', scoutId)
      .eq('tournament_id', tournamentId)
      .not(column, 'is', null)
      .order(column, { ascending: false })
      .limit(1)
    
    if (error) {
      console.error(`Error getting next ${type} order:`, error)
      return DISPLAY_ORDER_CONSTANTS.DEFAULT_ORDER
    }
    
    // If no records found or all have null values, start from 0
    if (!data || data.length === 0) {
      return DISPLAY_ORDER_CONSTANTS.DEFAULT_ORDER
    }
    
    const record = data[0]
    const currentOrder = type === 'exclusive' 
      ? (record as DisplayOrderQueryResult).display_order
      : (record as FavoriteDisplayOrderQueryResult).favorite_display_order
    
    if (currentOrder === null) {
      return DISPLAY_ORDER_CONSTANTS.DEFAULT_ORDER
    }
    
    // Return the next available number
    return currentOrder + 1
  } catch (error) {
    console.error(`Unexpected error getting next ${type} order:`, error)
    return DISPLAY_ORDER_CONSTANTS.DEFAULT_ORDER
  }
}

/**
 * Get both next available display orders for exclusive and favorite
 * This is more efficient when we need both values
 * @param scoutId - The scout's user ID
 * @param tournamentId - The tournament ID
 * @returns Object with nextExclusiveOrder and nextFavoriteOrder
 */
export async function getNextDisplayOrders(
  scoutId: string,
  tournamentId: string
): Promise<NextDisplayOrderResult> {
  const supabase = await createServerClient()
  
  try {
    // Get both orders in parallel for better performance
    const [exclusiveResult, favoriteResult] = await Promise.all([
      supabase
        .from('favorites')
        .select('display_order')
        .eq('scout_id', scoutId)
        .eq('tournament_id', tournamentId)
        .eq('is_exclusive', true)
        .not('display_order', 'is', null)
        .order('display_order', { ascending: false })
        .limit(1),
      
      supabase
        .from('favorites')
        .select('favorite_display_order')
        .eq('scout_id', scoutId)
        .eq('tournament_id', tournamentId)
        .eq('is_favorite', true)
        .not('favorite_display_order', 'is', null)
        .order('favorite_display_order', { ascending: false })
        .limit(1)
    ])
    
    const nextExclusiveOrder = exclusiveResult.data && exclusiveResult.data.length > 0 && exclusiveResult.data[0].display_order !== null
      ? (exclusiveResult.data[0].display_order as number) + 1
      : DISPLAY_ORDER_CONSTANTS.DEFAULT_ORDER
    
    const nextFavoriteOrder = favoriteResult.data && favoriteResult.data.length > 0 && favoriteResult.data[0].favorite_display_order !== null
      ? (favoriteResult.data[0].favorite_display_order as number) + 1
      : DISPLAY_ORDER_CONSTANTS.DEFAULT_ORDER
    
    return { nextExclusiveOrder, nextFavoriteOrder }
  } catch (error) {
    console.error('Unexpected error getting next display orders:', error)
    return { 
      nextExclusiveOrder: DISPLAY_ORDER_CONSTANTS.DEFAULT_ORDER, 
      nextFavoriteOrder: DISPLAY_ORDER_CONSTANTS.DEFAULT_ORDER 
    }
  }
}
