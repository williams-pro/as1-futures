"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { FavoritesSection } from "./_components/favorites-section"
import { useFavoritesManager } from "./_hooks/use-favorites-manager"
import { useAuth } from "@/contexts/auth-context"
import { Info, Save, X, Gem, Star, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FavoritesPage() {
  const { user } = useAuth()
  const {
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
  } = useFavoritesManager()

  if (!user) return null

  const totalFavorites = exclusivePlayers.length + regularFavoritePlayers.length

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-light tracking-tight text-foreground">My Favorites</h1>
          <p className="text-lg text-muted-foreground font-light">
            Manage your scouting list and priority targets
          </p>
        </div>

        {/* Sticky Save Banner */}
        {hasChanges && (
          <div className="sticky top-4 z-10 flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Info className="h-4 w-4 text-slate-600" />
              <div>
                <p className="text-sm font-medium text-foreground">Unsaved changes</p>
                <p className="text-xs text-muted-foreground">Drag to reorder, then save your changes</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDiscardChanges} 
                className="gap-2 border-slate-300 hover:border-slate-400"
              >
                <X className="h-4 w-4" />
                Discard
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveChanges} 
                className="gap-2 bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-8">
          <FavoritesSection
            title="Exclusive Players"
            icon="gem"
            players={exclusivePlayers}
            canAddExclusive={canAddExclusive()}
            onReorder={handleReorderExclusives}
            onRemove={(playerId) => handleRemove(playerId, user.id)}
            onToggleFavorite={(playerId) => handleToggleFavorite(playerId, user.id)}
            onToggleExclusive={(playerId) => handleToggleExclusive(playerId, user.id)}
            emptyMessage="No exclusive players yet. Mark up to 3 players as exclusive from any player details page."
          />

          <FavoritesSection
            title="Favorite Players"
            icon="star"
            players={regularFavoritePlayers}
            canAddExclusive={canAddExclusive()}
            onReorder={handleReorderRegular}
            onRemove={(playerId) => handleRemove(playerId, user.id)}
            onToggleFavorite={(playerId) => handleToggleFavorite(playerId, user.id)}
            onToggleExclusive={(playerId) => handleToggleExclusive(playerId, user.id)}
            emptyMessage="No favorite players yet. Start adding players from the Teams or Players pages."
          />
        </div>
      </div>
    </AppLayout>
  )
}
