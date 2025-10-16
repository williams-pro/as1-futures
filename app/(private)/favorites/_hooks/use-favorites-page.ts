"use client"

import { useMemo, useState, useCallback } from "react"
import { Player } from "@/lib/types"
import { useFavorites } from "@/contexts/favorites-context"
import { useToast } from "@/hooks/use-toast"

export function useFavoritesPage() {
  const { toast } = useToast()
  const {
    favorites,
    exclusives,
    currentTournamentId,
    isLoading: contextLoading,
    error: contextError,
    isFavorite,
    isExclusive,
    toggleFavorite,
    toggleExclusive,
    removeFromFavorites,
    canAddExclusive,
    refreshFavorites,
    reorderFavorites,
  } = useFavorites()

  // State for tracking pending changes
  const [hasChanges, setHasChanges] = useState(false)
  const [pendingExclusiveOrder, setPendingExclusiveOrder] = useState<Player[]>([])
  const [pendingRegularOrder, setPendingRegularOrder] = useState<Player[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Transform favorites data to Player objects using data from context
  const players = useMemo(() => {
    return favorites
      .filter(fav => fav.player) // Only include favorites with player data
      .map(fav => ({
        id: fav.player!.id,
        firstName: fav.player!.first_name,
        lastName: fav.player!.last_name,
        jerseyNumber: fav.player!.jersey_number,
        position: fav.player!.position,
        teamId: fav.player!.team?.id || '',
        photoUrl: fav.player!.photo_url || undefined,
        videoUrl: undefined, // Not available in favorites data
        birthDate: new Date(2000, 0, 1).toISOString(), // Default value, not available in favorites
        height: undefined, // Not available in favorites data
        weight: undefined, // Not available in favorites data
        nationality: undefined, // Not available in favorites data
        dominantFoot: undefined // Not available in favorites data
      } as Player))
  }, [favorites])

  // Separate exclusive and regular favorite players
  // Exclusives appear in both lists (exclusive and regular favorites)
  const exclusivePlayers = players.filter(player => isExclusive(player.id))
  const regularFavoritePlayers = players.filter(player => isFavorite(player.id))

  // Use pending orders if available, otherwise use current order
  const displayExclusivePlayers = pendingExclusiveOrder.length > 0 ? pendingExclusiveOrder : exclusivePlayers
  const displayRegularPlayers = pendingRegularOrder.length > 0 ? pendingRegularOrder : regularFavoritePlayers

  // Memoized calculations
  const totalFavorites = players.length
  const canAddExclusiveValue = canAddExclusive()

  // Handle reordering for exclusive players
  const handleReorderExclusives = useCallback((reorderedPlayers: Player[]) => {
    setPendingExclusiveOrder(reorderedPlayers)
    setHasChanges(true)
  }, [])

  // Handle reordering for regular favorite players
  const handleReorderRegular = useCallback((reorderedPlayers: Player[]) => {
    setPendingRegularOrder(reorderedPlayers)
    setHasChanges(true)
  }, [])

  // Handle saving changes
  const handleSaveChanges = useCallback(async () => {
    if (!currentTournamentId) {
      toast({
        title: "Error",
        description: "No active tournament found",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Create a map to track all players and their final order
      const allPlayers = new Map<string, { player: Player; order: number }>()
      let currentOrder = 0
      
      // Process exclusive players first (they get priority in the final order)
      displayExclusivePlayers.forEach(player => {
        allPlayers.set(player.id, { player, order: currentOrder++ })
      })
      
      // Process regular players, but skip if they're already processed (exclusives)
      displayRegularPlayers.forEach(player => {
        if (!allPlayers.has(player.id)) {
          allPlayers.set(player.id, { player, order: currentOrder++ })
        }
      })
      
      // Convert to array and sort by final order
      const finalOrderedPlayers = Array.from(allPlayers.values())
        .sort((a, b) => a.order - b.order)
        .map(item => item.player)
      
      // Map to favorites maintaining the final order
      const reorderedFavorites = finalOrderedPlayers.map(player => {
        const favorite = favorites.find(fav => fav.playerId === player.id)
        return favorite!
      }).filter(Boolean)

      // Use the context's reorderFavorites function
      await reorderFavorites(reorderedFavorites)
      
      // Clear pending changes
      setPendingExclusiveOrder([])
      setPendingRegularOrder([])
      setHasChanges(false)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }, [currentTournamentId, displayExclusivePlayers, displayRegularPlayers, favorites, reorderFavorites, toast])

  // Handle discarding changes
  const handleDiscardChanges = useCallback(() => {
    setPendingExclusiveOrder([])
    setPendingRegularOrder([])
    setHasChanges(false)
  }, [])

  // Handle removing from exclusives section (should only remove exclusive status)
  const handleRemoveFromExclusives = useCallback((playerId: string) => {
    toggleExclusive(playerId)
  }, [toggleExclusive])

  // Handle removing from favorites section
  // If player is exclusive, only remove exclusive status (keep as favorite)
  // If player is only favorite, remove completely
  const handleRemoveFromFavorites = useCallback((playerId: string) => {
    if (isExclusive(playerId)) {
      // If exclusive, only remove exclusive status (keep as favorite)
      toggleExclusive(playerId)
    } else {
      // If only favorite, remove completely
      removeFromFavorites(playerId)
    }
  }, [isExclusive, toggleExclusive, removeFromFavorites])

  return {
    // Data
    players,
    exclusivePlayers,
    regularFavoritePlayers,
    displayExclusivePlayers,
    displayRegularPlayers,
    totalFavorites,
    canAddExclusiveValue,
    
    // State
    hasChanges,
    isSaving,
    contextLoading,
    contextError,
    
    // Actions
    handleReorderExclusives,
    handleReorderRegular,
    handleSaveChanges,
    handleDiscardChanges,
    handleRemoveFromExclusives,
    handleRemoveFromFavorites,
    refreshFavorites,
    
    // Context functions (for direct use in components)
    toggleFavorite,
    toggleExclusive,
  }
}
