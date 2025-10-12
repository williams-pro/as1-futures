"use client"

import { getPlayerById, getTeamById } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/contexts/favorites-context"
import { useMemo, useState } from "react"

export function usePlayerDetail(playerId: string) {
  const player = useMemo(() => getPlayerById(playerId), [playerId])
  const team = useMemo(() => (player ? getTeamById(player.teamId) : null), [player])
  const { user } = useAuth()
  const { isFavorite, isExclusive, toggleFavorite, toggleExclusive, canAddExclusive } = useFavorites()

  const [showRemoveFavoriteDialog, setShowRemoveFavoriteDialog] = useState(false)
  const [showRemoveExclusiveDialog, setShowRemoveExclusiveDialog] = useState(false)

  const playerIsFavorite = player ? isFavorite(player.id) : false
  const playerIsExclusive = player ? isExclusive(player.id) : false
  const canMarkExclusive = canAddExclusive() || playerIsExclusive

  const handleFavoriteClick = () => {
    if (user && player) {
      if (playerIsFavorite) {
        // Show confirmation dialog when removing
        setShowRemoveFavoriteDialog(true)
      } else {
        // Add directly without confirmation
        toggleFavorite(player.id, user.id)
      }
    }
  }

  const handleExclusiveClick = () => {
    if (user && player && canMarkExclusive) {
      if (playerIsExclusive) {
        // Show confirmation dialog when removing
        setShowRemoveExclusiveDialog(true)
      } else {
        // Add directly without confirmation
        toggleExclusive(player.id, user.id)
      }
    }
  }

  const confirmRemoveFavorite = () => {
    if (user && player) {
      toggleFavorite(player.id, user.id)
    }
  }

  const confirmRemoveExclusive = () => {
    if (user && player) {
      toggleExclusive(player.id, user.id)
    }
  }

  return {
    player,
    team,
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
  }
}
