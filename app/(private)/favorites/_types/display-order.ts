/**
 * Types for display order functionality in favorites
 */

export type DisplayOrderType = 'exclusive' | 'favorite'

export interface NextDisplayOrderResult {
  nextExclusiveOrder: number
  nextFavoriteOrder: number
}

export interface DisplayOrderQueryResult {
  display_order: number | null
}

export interface FavoriteDisplayOrderQueryResult {
  favorite_display_order: number | null
}
