"use client"

import { useMemo, useState, useCallback } from "react"
import { Player } from "@/lib/types"
import { useFavorites } from "@/contexts/favorites-context"
import { useToast } from "@/hooks/use-toast"
import { reorderFavorites as reorderFavoritesAction } from "@/app/actions/favorites/reorder-favorites"

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

  // Transform exclusives data to Player objects
  const exclusivePlayers = useMemo(() => {
    return exclusives
      .filter(fav => fav.player) // Only include exclusives with player data
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
        dominantFoot: undefined, // Not available in favorites data
        team: fav.player!.team, // Include team information
      } as Player & { team?: { id: string; name: string; team_code: string; group?: { id: string; name: string; code: string } } }))
  }, [exclusives])

  // Transform favorites data to Player objects (includes exclusives)
  const regularFavoritePlayers = useMemo(() => {
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
        dominantFoot: undefined, // Not available in favorites data
        team: fav.player!.team, // Include team information
      } as Player & { team?: { id: string; name: string; team_code: string; group?: { id: string; name: string; code: string } } }))
  }, [favorites])

  // Use pending orders if available, otherwise use current order
  const displayExclusivePlayers = pendingExclusiveOrder.length > 0 ? pendingExclusiveOrder : exclusivePlayers
  const displayRegularPlayers = pendingRegularOrder.length > 0 ? pendingRegularOrder : regularFavoritePlayers

  // Memoized calculations
  const totalFavorites = regularFavoritePlayers.length
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
      // Preparar actualizaciones para exclusivos (usar display_order)
      const exclusiveUpdates = displayExclusivePlayers.map((player, index) => {
        const favorite = favorites.find(fav => fav.playerId === player.id)
        return {
          id: favorite!.id,
          display_order: index
        }
      })

      // Preparar actualizaciones para favoritos (usar favorite_display_order)
      const favoriteUpdates = displayRegularPlayers.map((player, index) => {
        const favorite = favorites.find(fav => fav.playerId === player.id)
        return {
          id: favorite!.id,
          favorite_display_order: index
        }
      })

      // Combinar todas las actualizaciones
      const allUpdates = [...exclusiveUpdates, ...favoriteUpdates]
      
      // Llamar directamente a la acción de reordenamiento con los datos específicos
      const result = await reorderFavoritesAction(currentTournamentId, allUpdates)
      
      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "Failed to save order",
          variant: "destructive",
        })
        return
      }

      // Actualizar el estado local con los nuevos órdenes
      const updatedFavorites = favorites.map(fav => {
        const exclusiveUpdate = allUpdates.find(update => update.id === fav.id && 'display_order' in update) as { id: string; display_order: number } | undefined
        const favoriteUpdate = allUpdates.find(update => update.id === fav.id && 'favorite_display_order' in update) as { id: string; favorite_display_order: number } | undefined
        
        return {
          ...fav,
          order: exclusiveUpdate ? exclusiveUpdate.display_order : fav.order,
          favoriteOrder: favoriteUpdate ? favoriteUpdate.favorite_display_order : fav.favoriteOrder
        }
      })

      const updatedExclusives = exclusives.map(fav => {
        const exclusiveUpdate = allUpdates.find(update => update.id === fav.id && 'display_order' in update) as { id: string; display_order: number } | undefined
        const favoriteUpdate = allUpdates.find(update => update.id === fav.id && 'favorite_display_order' in update) as { id: string; favorite_display_order: number } | undefined
        
        return {
          ...fav,
          order: exclusiveUpdate ? exclusiveUpdate.display_order : fav.order,
          favoriteOrder: favoriteUpdate ? favoriteUpdate.favorite_display_order : fav.favoriteOrder
        }
      })
      
      // Recargar datos desde la BD para asegurar sincronización completa
      await refreshFavorites()
      
      // Clear pending changes
      setPendingExclusiveOrder([])
      setPendingRegularOrder([])
      setHasChanges(false)

      toast({
        title: "Success",
        description: "Order saved successfully",
      })
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
    players: regularFavoritePlayers, // For backward compatibility
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
