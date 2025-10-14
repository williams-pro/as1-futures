"use client"

import { useState, useMemo, useEffect } from "react"
import { useFavorites } from "@/contexts/favorites-context"
import { getPlayerById } from "@/lib/mock-data"
import type { Player } from "@/lib/types"

export function useFavoritesManager() {
  const { favorites, exclusives, toggleFavorite, toggleExclusive, reorderFavorites, canAddExclusive } = useFavorites()
  const [hasChanges, setHasChanges] = useState(false)
  const [localFavorites, setLocalFavorites] = useState(favorites)

  useEffect(() => {
    setLocalFavorites(favorites)
  }, [favorites])

  // Get players for exclusives
  const exclusivePlayers = useMemo(() => {
    const exclusiveFavs = localFavorites.filter((f) => f.isExclusive)
    return exclusiveFavs
      .map((fav) => getPlayerById(fav.playerId))
      .filter((p): p is Player => p !== undefined)
      .sort((a, b) => {
        const orderA = exclusiveFavs.find((f) => f.playerId === a.id)?.order ?? 0
        const orderB = exclusiveFavs.find((f) => f.playerId === b.id)?.order ?? 0
        return orderA - orderB
      })
  }, [localFavorites])

  // Get players for regular favorites (all favorites, including exclusives)
  const regularFavoritePlayers = useMemo(() => {
    return localFavorites
      .map((fav) => getPlayerById(fav.playerId))
      .filter((p): p is Player => p !== undefined)
      .sort((a, b) => {
        const orderA = localFavorites.find((f) => f.playerId === a.id)?.order ?? 0
        const orderB = localFavorites.find((f) => f.playerId === b.id)?.order ?? 0
        return orderA - orderB
      })
  }, [localFavorites])

  const handleReorderExclusives = (newOrder: Player[]) => {
    const updatedFavorites = localFavorites.map((fav) => {
      if (fav.isExclusive) {
        const newIndex = newOrder.findIndex((p) => p.id === fav.playerId)
        if (newIndex !== -1) {
          return { ...fav, order: newIndex }
        }
      }
      return fav
    })
    setLocalFavorites(updatedFavorites)
    setHasChanges(true)
  }

  const handleReorderRegular = (newOrder: Player[]) => {
    const updatedFavorites = localFavorites.map((fav) => {
      const newIndex = newOrder.findIndex((p) => p.id === fav.playerId)
      if (newIndex !== -1) {
        return { ...fav, order: newIndex }
      }
      return fav
    })
    setLocalFavorites(updatedFavorites)
    setHasChanges(true)
  }

  const handleRemove = (playerId: string, scoutId: string) => {
    toggleFavorite(playerId, scoutId)
    setHasChanges(false)
  }

  const handleToggleFavorite = (playerId: string, scoutId: string) => {
    toggleFavorite(playerId, scoutId)
  }

  const handleToggleExclusive = (playerId: string, scoutId: string) => {
    toggleExclusive(playerId, scoutId)
  }

  const handleSaveChanges = () => {
    reorderFavorites(localFavorites)
    setHasChanges(false)
  }

  const handleDiscardChanges = () => {
    setLocalFavorites(favorites)
    setHasChanges(false)
  }

  return {
    exclusivePlayers,
    regularFavoritePlayers,
    hasChanges,
    canAddExclusive,
    handleReorderExclusives,
    handleReorderRegular,
    handleRemove,
    handleToggleFavorite,
    handleToggleExclusive,
    handleSaveChanges,
    handleDiscardChanges,
  }
}
