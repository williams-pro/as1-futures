"use client"

import { Button } from "@/components/ui/button"
import { FavoritesSection } from "./_components/favorites-section"
import { useFavoritesPage } from "./_hooks"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { Info, Save, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { FAVORITES_TEXTS } from "./_constants/favorites"

export default function FavoritesPage() {
  const { user } = useSupabaseAuth()
  const {
    displayExclusivePlayers,
    displayRegularPlayers,
    canAddExclusiveValue,
    hasChanges,
    isSaving,
    contextLoading,
    contextError,
    handleReorderExclusives,
    handleReorderRegular,
    handleSaveChanges,
    handleDiscardChanges,
    handleRemoveFromExclusives,
    handleRemoveFromFavorites,
    refreshFavorites,
    toggleFavorite,
    toggleExclusive,
  } = useFavoritesPage()

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

        {/* Sticky Save Banner - Mobile Optimized */}
        {hasChanges && (
          <div 
            className="sticky top-2 z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-lg border border-slate-200 bg-white p-3 sm:p-4 shadow-sm mx-2 sm:mx-0"
            role="banner"
            aria-live="polite"
          >
            {/* Info Section */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Info className="h-4 w-4 text-slate-600 flex-shrink-0" aria-label={FAVORITES_TEXTS.ALT_TEXTS.INFO_ICON} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{FAVORITES_TEXTS.SAVE_BANNER.TITLE}</p>
                <p className="text-xs text-muted-foreground hidden sm:block">{FAVORITES_TEXTS.SAVE_BANNER.DESCRIPTION}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDiscardChanges} 
                disabled={isSaving}
                className={cn(
                  "gap-2 border-slate-300 hover:border-slate-400 px-3 sm:px-4 py-2 flex-1 sm:flex-none",
                  "transition-colors duration-200 text-xs sm:text-sm"
                )}
                aria-label={FAVORITES_TEXTS.ALT_TEXTS.DISCARD_ICON}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{FAVORITES_TEXTS.SAVE_BANNER.BUTTONS.DISCARD}</span>
                <span className="sm:hidden">Cancel</span>
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveChanges} 
                disabled={isSaving}
                className={cn(
                  "gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-4 py-2 flex-1 sm:flex-none",
                  "transition-colors duration-200 text-xs sm:text-sm"
                )}
                aria-label={FAVORITES_TEXTS.ALT_TEXTS.SAVE_ICON}
              >
                <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">
                  {isSaving ? "Saving..." : FAVORITES_TEXTS.SAVE_BANNER.BUTTONS.SAVE_CHANGES}
                </span>
                <span className="sm:hidden">
                  {isSaving ? "Saving..." : "Save"}
                </span>
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
            onRemove={handleRemoveFromExclusives}
            onToggleFavorite={(playerId) => toggleFavorite(playerId)}
            onToggleExclusive={(playerId) => toggleExclusive(playerId)}
            emptyMessage={FAVORITES_TEXTS.SECTIONS.EXCLUSIVE_PLAYERS.EMPTY_MESSAGE}
            sectionType="exclusives"
          />

          <FavoritesSection
            title={FAVORITES_TEXTS.SECTIONS.FAVORITE_PLAYERS.TITLE}
            icon={FAVORITES_TEXTS.SECTIONS.FAVORITE_PLAYERS.ICON}
            players={displayRegularPlayers}
            canAddExclusive={canAddExclusiveValue}
            onReorder={handleReorderRegular}
            onRemove={handleRemoveFromFavorites}
            onToggleFavorite={(playerId) => toggleFavorite(playerId)}
            onToggleExclusive={(playerId) => toggleExclusive(playerId)}
            emptyMessage={FAVORITES_TEXTS.SECTIONS.FAVORITE_PLAYERS.EMPTY_MESSAGE}
            sectionType="favorites"
          />
        </main>
      </div>
  )
}
