"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useSupabaseAuth } from '@/hooks/use-supabase-auth'
import { toggleFavorite as toggleFavoriteAction } from '@/app/actions/favorites/toggle-favorite'
import { toggleExclusive as toggleExclusiveAction } from '@/app/actions/favorites/toggle-exclusive'
import { getMyFavorites } from '@/app/actions/favorites/get-my-favorites'
import { getTournaments } from '@/app/actions/tournaments/get-tournaments'
import { reorderFavorites as reorderFavoritesAction } from '@/app/actions/favorites/reorder-favorites'
import { useToast } from '@/hooks/use-toast'

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface Favorite {
  id: string // Favorite ID from database
  playerId: string
  scoutId: string
  createdAt: string
  isExclusive: boolean
  order?: number
  player?: {
    id: string
    first_name: string
    last_name: string
    jersey_number: number
    position: string
    photo_url?: string
    team?: {
      id: string
      name: string
      team_code: string
      group?: {
        id: string
        name: string
        code: string
      }
    }
  }
}

export interface FavoritesContextType {
  // Data
  favorites: Favorite[]
  exclusives: Favorite[]
  currentTournamentId: string | null
  
  // State
  isLoading: boolean
  error: string | null
  
  // Actions
  isFavorite: (playerId: string) => boolean
  isExclusive: (playerId: string) => boolean
  toggleFavorite: (playerId: string) => Promise<void>
  toggleExclusive: (playerId: string) => Promise<void>
  canAddExclusive: () => boolean
  refreshFavorites: () => Promise<void>
  
  // Reordering (for drag & drop)
  reorderFavorites: (reorderedFavorites: Favorite[]) => Promise<void>
}

// =====================================================
// CONSTANTS
// =====================================================

const MAX_EXCLUSIVES = 3

// =====================================================
// CONTEXT
// =====================================================

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

// =====================================================
// PROVIDER
// =====================================================

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useSupabaseAuth()
  const { toast } = useToast()
  
  // State
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [currentTournamentId, setCurrentTournamentId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  
  const loadData = useCallback(async () => {
    if (!user) {
      setFavorites([])
      setCurrentTournamentId(null)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Load tournaments first
      const tournamentsResult = await getTournaments()
      
      if (!tournamentsResult.success || !tournamentsResult.tournaments?.length) {
        setError('No active tournaments found')
        setFavorites([])
        return
      }

      const activeTournament = tournamentsResult.tournaments[0]
      setCurrentTournamentId(activeTournament.id)

      // Load favorites for the active tournament
      const favoritesResult = await getMyFavorites(activeTournament.id)
      
      if (favoritesResult.success && favoritesResult.players) {
        const convertedFavorites: Favorite[] = favoritesResult.players.map((favorite: any) => ({
          id: favorite.id, // Favorite ID from database
          playerId: favorite.player.id,
          scoutId: user.id,
          createdAt: favorite.created_at || new Date().toISOString(),
          isExclusive: favorite.is_exclusive || false,
          order: favorite.display_order || 0,
          player: favorite.player ? {
            id: favorite.player.id,
            first_name: favorite.player.first_name,
            last_name: favorite.player.last_name,
            jersey_number: favorite.player.jersey_number,
            position: favorite.player.position,
            photo_url: favorite.player.photo_url,
            team: favorite.player.team ? {
              id: favorite.player.team.id,
              name: favorite.player.team.name,
              team_code: favorite.player.team.team_code,
              group: favorite.player.team.group ? {
                id: favorite.player.team.group.id,
                name: favorite.player.team.group.name,
                code: favorite.player.team.group.code
              } : undefined
            } : undefined
          } : undefined
        }))
        
        setFavorites(convertedFavorites)
      } else {
        setFavorites([])
        if (!favoritesResult.success) {
          setError(favoritesResult.error || 'Failed to load favorites')
        }
      }
    } catch (err) {
      console.error('Error loading favorites:', err)
      setError('Failed to load favorites')
      setFavorites([])
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && user) {
      loadData()
    }
  }, [authLoading, user, loadData])

  // Reset when user logs out
  useEffect(() => {
    if (!user && !authLoading) {
      setFavorites([])
      setCurrentTournamentId(null)
    }
  }, [user, authLoading])


  const exclusives = favorites.filter((f) => f.isExclusive)


  const isFavorite = useCallback((playerId: string) => {
    return favorites.some((f) => f.playerId === playerId)
  }, [favorites])

  const isExclusive = useCallback((playerId: string) => {
    return favorites.some((f) => f.playerId === playerId && f.isExclusive)
  }, [favorites])

  const canAddExclusive = useCallback(() => {
    return exclusives.length < MAX_EXCLUSIVES
  }, [exclusives.length])


  const toggleFavorite = useCallback(async (playerId: string) => {
    if (!user || !currentTournamentId) return

    try {
      const isCurrentlyFavorite = isFavorite(playerId)
      
      const formData = new FormData()
      formData.append('playerId', playerId)
      formData.append('tournamentId', currentTournamentId)
      formData.append('isFavorite', (!isCurrentlyFavorite).toString())

      const result = await toggleFavoriteAction(formData)
      
      if (result.success) {
        await loadData()
        
        toast({
          title: "Success",
          description: isCurrentlyFavorite ? "Removed from favorites" : "Added to favorites",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update favorite",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update favorite",
        variant: "destructive",
      })
    }
  }, [user, isFavorite, currentTournamentId, loadData, toast])

  const toggleExclusive = useCallback(async (playerId: string) => {
    if (!user || !currentTournamentId) return

    try {
      const isCurrentlyExclusive = isExclusive(playerId)
      
      if (!isCurrentlyExclusive && !canAddExclusive()) {
        toast({
          title: "Limit Reached",
          description: "You can only have 3 exclusive players per tournament",
          variant: "destructive",
        })
        return
      }
      
      const formData = new FormData()
      formData.append('playerId', playerId)
      formData.append('tournamentId', currentTournamentId)
      formData.append('isExclusive', (!isCurrentlyExclusive).toString())

      const result = await toggleExclusiveAction(formData)
      
      if (result.success) {
        await loadData()
        
        toast({
          title: "Success",
          description: isCurrentlyExclusive ? "Removed exclusive status" : "Marked as exclusive",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update exclusive status",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update exclusive status",
        variant: "destructive",
      })
    }
  }, [user, isExclusive, canAddExclusive, currentTournamentId, loadData, toast])

  const reorderFavorites = useCallback(async (reorderedFavorites: Favorite[]) => {
    if (!currentTournamentId) {
      toast({
        title: "Error",
        description: "No active tournament found",
        variant: "destructive",
      })
      return
    }

    try {
      const withUpdatedOrder = reorderedFavorites.map((fav, index) => ({
        ...fav,
        order: index,
      }))
      setFavorites(withUpdatedOrder)

      const reorderData = reorderedFavorites.map((fav, index) => ({
        id: fav.id,
        display_order: index
      }))

      const result = await reorderFavoritesAction(currentTournamentId, reorderData)
      
      if (!result.success) {
        await loadData()
        toast({
          title: "Error",
          description: result.error || "Failed to save order",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Order saved successfully",
        })
      }
    } catch (err) {
      await loadData()
      toast({
        title: "Error",
        description: "Failed to save order",
        variant: "destructive",
      })
    }
  }, [currentTournamentId, loadData, toast])

  const refreshFavorites = useCallback(async () => {
    await loadData()
  }, [loadData])


  const value: FavoritesContextType = {
    favorites,
    exclusives,
    currentTournamentId,
    isLoading,
    error,
    isFavorite,
    isExclusive,
    toggleFavorite,
    toggleExclusive,
    canAddExclusive,
    refreshFavorites,
    reorderFavorites,
  }

  return (
    <FavoritesContext.Provider value={value}>
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
