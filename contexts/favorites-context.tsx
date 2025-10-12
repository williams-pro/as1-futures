"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Favorite } from "@/lib/types"

interface FavoritesContextType {
  favorites: Favorite[]
  exclusives: Favorite[]
  isFavorite: (playerId: string) => boolean
  isExclusive: (playerId: string) => boolean
  toggleFavorite: (playerId: string, scoutId: string) => void
  toggleExclusive: (playerId: string, scoutId: string) => void
  reorderFavorites: (reorderedFavorites: Favorite[]) => void
  canAddExclusive: () => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const MAX_EXCLUSIVES = 3

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([])

  useEffect(() => {
    // Load favorites from localStorage
    const stored = localStorage.getItem("as1-favorites")
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  const saveFavorites = (newFavorites: Favorite[]) => {
    setFavorites(newFavorites)
    localStorage.setItem("as1-favorites", JSON.stringify(newFavorites))
  }

  const exclusives = favorites.filter((f) => f.isExclusive)

  const isFavorite = (playerId: string) => {
    return favorites.some((f) => f.playerId === playerId)
  }

  const isExclusive = (playerId: string) => {
    return favorites.some((f) => f.playerId === playerId && f.isExclusive)
  }

  const toggleFavorite = (playerId: string, scoutId: string) => {
    const existing = favorites.find((f) => f.playerId === playerId)

    if (existing) {
      if (existing.isExclusive) {
        console.warn("[v0] Cannot remove favorite while player is exclusive. Remove exclusive status first.")
        return
      }
      // Remove favorite
      saveFavorites(favorites.filter((f) => f.playerId !== playerId))
    } else {
      // Add favorite
      const newFavorite: Favorite = {
        playerId,
        scoutId,
        createdAt: new Date().toISOString(),
        isExclusive: false,
        order: favorites.length,
      }
      saveFavorites([...favorites, newFavorite])
    }
  }

  const toggleExclusive = (playerId: string, scoutId: string) => {
    const existing = favorites.find((f) => f.playerId === playerId)

    if (existing?.isExclusive) {
      // Remove exclusive status (keep as favorite)
      saveFavorites(favorites.map((f) => (f.playerId === playerId ? { ...f, isExclusive: false } : f)))
    } else {
      // Check if we can add more exclusives
      if (exclusives.length >= MAX_EXCLUSIVES) {
        return // Cannot add more exclusives
      }

      if (existing) {
        // Mark existing favorite as exclusive
        saveFavorites(favorites.map((f) => (f.playerId === playerId ? { ...f, isExclusive: true } : f)))
      } else {
        // Add as both favorite and exclusive
        const newFavorite: Favorite = {
          playerId,
          scoutId,
          createdAt: new Date().toISOString(),
          isExclusive: true,
          order: favorites.length,
        }
        saveFavorites([...favorites, newFavorite])
      }
    }
  }

  const reorderFavorites = (reorderedFavorites: Favorite[]) => {
    const withUpdatedOrder = reorderedFavorites.map((fav, index) => ({
      ...fav,
      order: index,
    }))
    saveFavorites(withUpdatedOrder)
  }

  const canAddExclusive = () => {
    return exclusives.length < MAX_EXCLUSIVES
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        exclusives,
        isFavorite,
        isExclusive,
        toggleFavorite,
        toggleExclusive,
        reorderFavorites,
        canAddExclusive,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
