"use client"

import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/contexts/favorites-context"
import { useState } from "react"

interface UsePlayerActionsProps {
  playerId: string
  showConfirmationDialogs?: boolean
}

export function usePlayerActions({ 
  playerId, 
  showConfirmationDialogs = false 
}: UsePlayerActionsProps) {
  const { user } = useAuth()
  const { isFavorite, isExclusive, toggleFavorite, toggleExclusive, canAddExclusive } = useFavorites()

  const [showRemoveFavoriteDialog, setShowRemoveFavoriteDialog] = useState(false)
  const [showRemoveExclusiveDialog, setShowRemoveExclusiveDialog] = useState(false)

  const playerIsFavorite = isFavorite(playerId)
  const playerIsExclusive = isExclusive(playerId)
  const canMarkExclusive = canAddExclusive() || playerIsExclusive

  const handleFavoriteClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // Si es exclusivo y favorito, no permitir remover favorito
    if (playerIsExclusive && playerIsFavorite) {
      return
    }

    if (user) {
      if (showConfirmationDialogs && playerIsFavorite) {
        // Show confirmation dialog when removing
        setShowRemoveFavoriteDialog(true)
      } else {
        // Add/remove directly
        toggleFavorite(playerId, user.id)
      }
    }
  }

  const handleExclusiveClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (user && canMarkExclusive) {
      if (showConfirmationDialogs && playerIsExclusive) {
        // Show confirmation dialog when removing
        setShowRemoveExclusiveDialog(true)
      } else {
        // Add/remove directly
        toggleExclusive(playerId, user.id)
      }
    }
  }

  const confirmRemoveFavorite = () => {
    if (user) {
      toggleFavorite(playerId, user.id)
      setShowRemoveFavoriteDialog(false)
    }
  }

  const confirmRemoveExclusive = () => {
    if (user) {
      toggleExclusive(playerId, user.id)
      setShowRemoveExclusiveDialog(false)
    }
  }

  const cancelRemoveFavorite = () => {
    setShowRemoveFavoriteDialog(false)
  }

  const cancelRemoveExclusive = () => {
    setShowRemoveExclusiveDialog(false)
  }

  return {
    user,
    playerIsFavorite,
    playerIsExclusive,
    canMarkExclusive,
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
