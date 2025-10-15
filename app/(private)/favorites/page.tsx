"use client"

import { Button } from "@/components/ui/button"
import { FavoritesSection } from "./_components/favorites-section"
import { useFavorites } from "@/contexts/favorites-context"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { Info, Save, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { FAVORITES_TEXTS } from "./_constants/favorites"
import { useMemo, useState, useCallback } from "react"
import { Player } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function FavoritesPage() {
  const { user } = useSupabaseAuth()
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
  const exclusivePlayers = players.filter(player => isExclusive(player.id))
  const regularFavoritePlayers = players.filter(player => isFavorite(player.id) && !isExclusive(player.id))

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
      // Combine all reordered favorites
      const allReorderedPlayers = [...displayExclusivePlayers, ...displayRegularPlayers]
      const reorderedFavorites = allReorderedPlayers.map(player => {
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

  // Early return for unauthenticated users
  if (!user) return null

  // Loading state
  if (contextLoading) {
    return (
      <div className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-4xl font-light tracking-tight text-foreground">{FAVORITES_TEXTS.UI.PAGE_TITLE}</h1>
          <p className="text-lg text-muted-foreground font-light">
            {FAVORITES_TEXTS.UI.PAGE_DESCRIPTION}
          </p>
        </header>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (contextError) {
    return (
      <div className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-4xl font-light tracking-tight text-foreground">{FAVORITES_TEXTS.UI.PAGE_TITLE}</h1>
          <p className="text-lg text-muted-foreground font-light">
            {FAVORITES_TEXTS.UI.PAGE_DESCRIPTION}
          </p>
        </header>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">{contextError}</p>
            <Button onClick={refreshFavorites}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-4xl font-light tracking-tight text-foreground">{FAVORITES_TEXTS.UI.PAGE_TITLE}</h1>
          <p className="text-lg text-muted-foreground font-light">
            {FAVORITES_TEXTS.UI.PAGE_DESCRIPTION}
          </p>
        </header>

        {/* Sticky Save Banner */}
        {hasChanges && (
          <div 
            className="sticky top-4 z-10 flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            role="banner"
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <Info className="h-4 w-4 text-slate-600" aria-label={FAVORITES_TEXTS.ALT_TEXTS.INFO_ICON} />
              <div>
                <p className="text-sm font-medium text-foreground">{FAVORITES_TEXTS.SAVE_BANNER.TITLE}</p>
                <p className="text-xs text-muted-foreground">{FAVORITES_TEXTS.SAVE_BANNER.DESCRIPTION}</p>
              </div>
            </div>
            <div className="flex gap-2 px-2 py-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDiscardChanges} 
                disabled={isSaving}
                className={cn(
                  "gap-2 border-slate-300 hover:border-slate-400 px-4 py-2",
                  "transition-colors duration-200"
                )}
                aria-label={FAVORITES_TEXTS.ALT_TEXTS.DISCARD_ICON}
              >
                <X className="h-4 w-4" />
                {FAVORITES_TEXTS.SAVE_BANNER.BUTTONS.DISCARD}
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveChanges} 
                disabled={isSaving}
                className={cn(
                  "gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2",
                  "transition-colors duration-200"
                )}
                aria-label={FAVORITES_TEXTS.ALT_TEXTS.SAVE_ICON}
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : FAVORITES_TEXTS.SAVE_BANNER.BUTTONS.SAVE_CHANGES}
              </Button>
            </div>
          </div>
        )}

        {/* Sections */}
        <main className="space-y-8" role="main">
          <FavoritesSection
            title={FAVORITES_TEXTS.SECTIONS.EXCLUSIVE_PLAYERS.TITLE}
            icon={FAVORITES_TEXTS.SECTIONS.EXCLUSIVE_PLAYERS.ICON}
            players={displayExclusivePlayers}
            canAddExclusive={canAddExclusiveValue}
            onReorder={handleReorderExclusives}
            onRemove={(playerId) => toggleFavorite(playerId)}
            onToggleFavorite={(playerId) => toggleFavorite(playerId)}
            onToggleExclusive={(playerId) => toggleExclusive(playerId)}
            emptyMessage={FAVORITES_TEXTS.SECTIONS.EXCLUSIVE_PLAYERS.EMPTY_MESSAGE}
          />

          <FavoritesSection
            title={FAVORITES_TEXTS.SECTIONS.FAVORITE_PLAYERS.TITLE}
            icon={FAVORITES_TEXTS.SECTIONS.FAVORITE_PLAYERS.ICON}
            players={displayRegularPlayers}
            canAddExclusive={canAddExclusiveValue}
            onReorder={handleReorderRegular}
            onRemove={(playerId) => toggleFavorite(playerId)}
            onToggleFavorite={(playerId) => toggleFavorite(playerId)}
            onToggleExclusive={(playerId) => toggleExclusive(playerId)}
            emptyMessage={FAVORITES_TEXTS.SECTIONS.FAVORITE_PLAYERS.EMPTY_MESSAGE}
          />
        </main>
      </div>
  )
}
