"use client"

import { useFavorites } from "@/contexts/favorites-context"

// =====================================================
// TYPES
// =====================================================

interface UseFavoritesStatsReturn {
  // Counts
  totalFavorites: number
  totalExclusives: number
  regularFavorites: number
  
  // State
  isLoading: boolean
  error: string | null
  
  // Actions
  refreshStats: () => Promise<void>
}

// =====================================================
// HOOK
// =====================================================

export function useFavoritesStats(): UseFavoritesStatsReturn {
  const { favorites, exclusives, isLoading, error, refreshFavorites } = useFavorites()

  // =====================================================
  // COMPUTED VALUES
  // =====================================================

  const totalFavorites = favorites.length
  const totalExclusives = exclusives.length
  const regularFavorites = totalFavorites - totalExclusives

  // =====================================================
  // ACTIONS
  // =====================================================

  const refreshStats = async () => {
    await refreshFavorites()
  }

  // =====================================================
  // RETURN
  // =====================================================

  return {
    totalFavorites,
    totalExclusives,
    regularFavorites,
    isLoading,
    error,
    refreshStats,
  }
}
