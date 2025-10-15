"use client"

import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { useFavorites } from "@/contexts/favorites-context"
import { useState } from "react"

// =====================================================
// TYPES
// =====================================================

interface UsePlayerFavoritesProps {
  playerId: string
  showConfirmationDialogs?: boolean
}

interface UsePlayerFavoritesReturn {
  // User info
  user: any
  
  // Player state
  playerIsFavorite: boolean
  playerIsExclusive: boolean
  canMarkExclusive: boolean
  
  // Loading state
  isLoading: boolean
  
  // Actions
  handleFavoriteClick: (e?: React.MouseEvent) => Promise<void>
  handleExclusiveClick: (e?: React.MouseEvent) => Promise<void>
  
  // Confirmation dialogs
  showRemoveFavoriteDialog: boolean
  setShowRemoveFavoriteDialog: (show: boolean) => void
  showRemoveExclusiveDialog: boolean
  setShowRemoveExclusiveDialog: (show: boolean) => void
  
  // Confirmation actions
  confirmRemoveFavorite: () => Promise<void>
  confirmRemoveExclusive: () => Promise<void>
  cancelRemoveFavorite: () => void
  cancelRemoveExclusive: () => void
}

// =====================================================
// HOOK
// =====================================================

export function usePlayerFavorites({ 
  playerId, 
  showConfirmationDialogs = false 
}: UsePlayerFavoritesProps): UsePlayerFavoritesReturn {
  const { user } = useSupabaseAuth()
  const { isFavorite, isExclusive, toggleFavorite, toggleExclusive, canAddExclusive, isLoading } = useFavorites()

  // State for confirmation dialogs
  const [showRemoveFavoriteDialog, setShowRemoveFavoriteDialog] = useState(false)
  const [showRemoveExclusiveDialog, setShowRemoveExclusiveDialog] = useState(false)

  // =====================================================
  // COMPUTED VALUES
  // =====================================================

  const playerIsFavorite = isFavorite(playerId)
  const playerIsExclusive = isExclusive(playerId)
  const canMarkExclusive = canAddExclusive() || playerIsExclusive

  // =====================================================
  // ACTIONS
  // =====================================================

  const handleFavoriteClick = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // Business Rule: Cannot remove favorite while player is exclusive
    if (playerIsExclusive && playerIsFavorite) {
      return
    }

    if (user) {
      if (showConfirmationDialogs && playerIsFavorite) {
        setShowRemoveFavoriteDialog(true)
      } else {
        await toggleFavorite(playerId)
      }
    }
  }

  const handleExclusiveClick = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (user && canMarkExclusive) {
      if (showConfirmationDialogs && playerIsExclusive) {
        setShowRemoveExclusiveDialog(true)
      } else {
        await toggleExclusive(playerId)
      }
    }
  }

  const confirmRemoveFavorite = async () => {
    if (user) {
      await toggleFavorite(playerId)
      setShowRemoveFavoriteDialog(false)
    }
  }

  const confirmRemoveExclusive = async () => {
    if (user) {
      await toggleExclusive(playerId)
      setShowRemoveExclusiveDialog(false)
    }
  }

  const cancelRemoveFavorite = () => {
    setShowRemoveFavoriteDialog(false)
  }

  const cancelRemoveExclusive = () => {
    setShowRemoveExclusiveDialog(false)
  }

  // =====================================================
  // RETURN
  // =====================================================

  return {
    user,
    playerIsFavorite,
    playerIsExclusive,
    canMarkExclusive,
    isLoading,
    handleFavoriteClick,
    handleExclusiveClick,
    showRemoveFavoriteDialog,
    setShowRemoveFavoriteDialog,
    showRemoveExclusiveDialog,
    setShowRemoveExclusiveDialog,
    confirmRemoveFavorite,
    confirmRemoveExclusive,
    cancelRemoveFavorite,
    cancelRemoveExclusive,
  }
}
