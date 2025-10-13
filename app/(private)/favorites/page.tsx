"use client"

import { Button } from "@/components/ui/button"
import { FavoritesSection } from "./_components/favorites-section"
import { useFavoritesManager } from "./_hooks/use-favorites-manager"
import { useAuth } from "@/contexts/auth-context"
import { Info, Save, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { FAVORITES_TEXTS } from "./_constants/favorites"

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

  // Early return for unauthenticated users
  if (!user) return null

  // Memoized calculations
  const totalFavorites = exclusivePlayers.length + regularFavoritePlayers.length
  const canAddExclusiveValue = canAddExclusive()

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
                className={cn(
                  "gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2",
                  "transition-colors duration-200"
                )}
                aria-label={FAVORITES_TEXTS.ALT_TEXTS.SAVE_ICON}
              >
                <Save className="h-4 w-4" />
                {FAVORITES_TEXTS.SAVE_BANNER.BUTTONS.SAVE_CHANGES}
              </Button>
            </div>
          </div>
        )}

        {/* Sections */}
        <main className="space-y-8" role="main">
          <FavoritesSection
            title={FAVORITES_TEXTS.SECTIONS.EXCLUSIVE_PLAYERS.TITLE}
            icon={FAVORITES_TEXTS.SECTIONS.EXCLUSIVE_PLAYERS.ICON}
            players={exclusivePlayers}
            canAddExclusive={canAddExclusiveValue}
            onReorder={handleReorderExclusives}
            onRemove={(playerId) => handleRemove(playerId, user.id)}
            onToggleFavorite={(playerId) => handleToggleFavorite(playerId, user.id)}
            onToggleExclusive={(playerId) => handleToggleExclusive(playerId, user.id)}
            emptyMessage={FAVORITES_TEXTS.SECTIONS.EXCLUSIVE_PLAYERS.EMPTY_MESSAGE}
          />

          <FavoritesSection
            title={FAVORITES_TEXTS.SECTIONS.FAVORITE_PLAYERS.TITLE}
            icon={FAVORITES_TEXTS.SECTIONS.FAVORITE_PLAYERS.ICON}
            players={regularFavoritePlayers}
            canAddExclusive={canAddExclusiveValue}
            onReorder={handleReorderRegular}
            onRemove={(playerId) => handleRemove(playerId, user.id)}
            onToggleFavorite={(playerId) => handleToggleFavorite(playerId, user.id)}
            onToggleExclusive={(playerId) => handleToggleExclusive(playerId, user.id)}
            emptyMessage={FAVORITES_TEXTS.SECTIONS.FAVORITE_PLAYERS.EMPTY_MESSAGE}
          />
        </main>
      </div>
  )
}
