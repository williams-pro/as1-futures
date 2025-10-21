"use client"

import { use, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Star, Gem, Shield, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PlayerInfoCard } from "./_components/player-info"
import { PlayerHighlights } from "./_components/player-highlights"
import { PlayerStatsCard } from "./_components/player-stats-card"
import { ConfirmDialog } from "./_components/confirm-dialog"
import { usePlayerDetail } from "./_hooks/use-player-detail"
import { usePlayerTracking } from "@/hooks/use-player-tracking"
import { cn } from "@/lib/utils"
import { PLAYER_DETAIL_TEXTS } from "./_constants/player-detail"

interface PlayerDetailPageProps {
  params: Promise<{
    playerId: string
  }>
}

export default function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  const { playerId } = use(params)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const {
    player,
    team,
    loading,
    error,
    playerIsFavorite,
    playerIsExclusive,
    canMarkExclusive,
    isLoading,
    handleFavoriteClick,
    handleExclusiveClick,
    showRemoveFavoriteDialog,
    setShowRemoveFavoriteDialog,
    showRemoveExclusiveDialog,
    setShowRemoveExclusiveDialog,
    confirmRemoveFavorite,
    confirmRemoveExclusive,
  } = usePlayerDetail(playerId)

  // Inicializar tracking de jugador
  const { markVideoPlayed } = usePlayerTracking({
    playerId,
    enabled: !loading && !isLoading && !error && !!player,
    minDurationSeconds: 3,
    scrollContainerRef
  })

  if (loading) {
    return (
      <div className="h-full flex flex-col overflow-y-auto">
        {/* Header Section Skeleton - Auto height */}
        <div className="h-auto flex flex-col space-y-4 lg:space-y-8 bg-gradient-to-b from-slate-50/50 to-transparent lg:bg-transparent rounded-b-2xl lg:rounded-none p-4 lg:p-0">
          {/* Header Navigation Skeleton */}
          <div>
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Player Header Skeleton */}
          <div className="flex items-start gap-3 lg:gap-8 flex-1">
          {/* Player Avatar Skeleton */}
          <div className="flex-shrink-0">
            <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 lg:h-40 lg:w-40 rounded-xl lg:rounded-2xl" />
          </div>

          {/* Player Info Skeleton */}
          <div className="flex-1 space-y-1.5 lg:space-y-4">
            <div className="space-y-1.5 lg:space-y-4">
              <div className="flex flex-wrap items-start gap-1.5 lg:gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 sm:h-5 lg:h-12 w-32 sm:w-40 lg:w-64" />
            </div>

            {/* Team Info Skeleton - Desktop Only */}
            <div className="hidden lg:flex">
              <Skeleton className="h-16 w-48" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-2 lg:gap-3 pt-1.5 lg:pt-4">
              <Skeleton className="h-8 w-16 lg:h-11 lg:w-32" />
              <Skeleton className="h-8 w-16 lg:h-11 lg:w-32" />
            </div>
          </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

        {/* Content Container Skeleton */}
        <div className="flex-1 border border-border/20 rounded-lg p-3 sm:p-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col space-y-8 overflow-y-auto">
        {/* Header Navigation */}
        <div>
          <Link href="/teams">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              {PLAYER_DETAIL_TEXTS.UI.BACK_TO_TEAMS}
            </Button>
          </Link>
        </div>

        {/* Error State */}
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load player details: {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!player) {
    notFound()
  }

  const initials = `${player.firstName[0]}${player.lastName[0]}`

  return (
    <TooltipProvider delayDuration={300}>
      <div ref={scrollContainerRef} className="h-full flex flex-col overflow-y-auto">
          {/* Header Section - Auto height */}
          <div className="h-auto flex flex-col space-y-3 lg:space-y-8 bg-gradient-to-b from-slate-50/50 to-transparent lg:bg-transparent rounded-b-2xl lg:rounded-none p-4 lg:p-0">
            {/* Header Navigation - Compact */}
            <div className="flex items-center justify-between">
              {team ? (
                <Link href={`/teams/${team.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground transition-colors h-8 px-2">
                    <ArrowLeft className="h-3 w-3" />
                    <span className="hidden sm:inline">{PLAYER_DETAIL_TEXTS.UI.BACK_TO_TEAM}</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/teams">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground transition-colors h-8 px-2">
                    <ArrowLeft className="h-3 w-3" />
                    <span className="hidden sm:inline">{PLAYER_DETAIL_TEXTS.UI.BACK_TO_TEAMS}</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                </Link>
              )}
              
              {/* Team Badge - Mobile Only, Top Right */}
              {team && (
                <Link href={`/teams/${team.id}`} className="lg:hidden">
                  <Badge variant="outline" className="text-xs h-7 px-3 bg-white/80 backdrop-blur-sm border-slate-200 hover:border-slate-300 hover:bg-white transition-all duration-200 shadow-sm">
                    <Shield className="h-3 w-3 mr-1.5 text-slate-600" />
                    <span className="font-medium text-slate-700">{team.name}</span>
                  </Badge>
                </Link>
              )}
            </div>

            {/* Player Header - Two Column Layout */}
            <div className="flex items-start gap-3 lg:gap-8 flex-1">
            {/* Player Avatar - Left Column */}
            <div className="flex-shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 lg:h-40 lg:w-40 rounded-xl lg:rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                <Avatar className="h-full w-full rounded-xl lg:rounded-2xl border-0">
                  {player.photoUrl ? (
                    <AvatarImage
                      src={player.photoUrl || "/placeholder.svg"}
                      alt={`${player.firstName} ${player.lastName}`}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 text-lg sm:text-xl lg:text-4xl font-bold rounded-xl lg:rounded-2xl">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </div>

            {/* Player Info - Right Column */}
            <div className="flex-1 min-w-0 text-left">
              {/* Badges y Nombre - Inline */}
              <div className="space-y-1.5 lg:space-y-4">
                <div className="flex flex-wrap items-start gap-1.5 lg:gap-2">
                  <Badge className="bg-slate-100 text-slate-700 font-mono text-xs lg:text-sm border-0 h-6 lg:h-6 px-2.5 shadow-sm">
                    {PLAYER_DETAIL_TEXTS.UI.JERSEY_PREFIX}{player.jerseyNumber}
                  </Badge>
                  <Badge variant="secondary" className="text-slate-600 text-xs lg:text-sm h-6 lg:h-6 px-2.5 shadow-sm border-0">
                    {player.position}
                  </Badge>
                  {playerIsFavorite && (
                    <Badge className="bg-amber-100 text-amber-700 gap-1 border-0 text-xs lg:text-sm h-6 lg:h-6 px-2.5 shadow-sm hidden lg:flex">
                      <Star className="h-2.5 w-2.5 lg:h-3 lg:w-3 fill-amber-500" />
                      {PLAYER_DETAIL_TEXTS.UI.FAVORITE_BADGE}
                    </Badge>
                  )}
                  {playerIsExclusive && (
                    <Badge className="bg-as1-purple-100 text-as1-purple-700 gap-1 border-0 text-xs lg:text-sm h-6 lg:h-6 px-2.5 shadow-sm hidden lg:flex">
                      <Gem className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                      {PLAYER_DETAIL_TEXTS.UI.EXCLUSIVE_BADGE}
                    </Badge>
                  )}
                </div>

                <h1 className="text-base sm:text-lg lg:text-4xl font-semibold text-foreground tracking-tight text-balance lg:whitespace-normal leading-tight">
                  {player.firstName} <span className="font-semibold">{player.lastName}</span>
                </h1>
              </div>

              {/* Team Info - Desktop Only */}
              {team && (
                <Link href={`/teams/${team.id}`} className="hidden lg:block">
                  <div className="inline-flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-border/20 hover:border-as1-gold/30 hover:bg-slate-50 transition-all duration-300 group">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-border/30 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-foreground group-hover:text-as1-gold transition-colors">
                        {team.name}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-as1-gold rounded-full" />
                        {PLAYER_DETAIL_TEXTS.UI.GROUP_PREFIX} {team.group}
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Action Buttons with Tooltips - Compact */}
              <div className="flex gap-2 lg:gap-3 pt-1.5 lg:pt-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={(e) => {
                          if (isLoading || (playerIsExclusive && playerIsFavorite)) {
                            e.preventDefault()
                            e.stopPropagation()
                            return
                          }
                          handleFavoriteClick(e)
                        }}
                        className={cn(
                          "gap-1 lg:gap-2 h-9 w-20 lg:h-11 lg:w-auto px-4 lg:px-6 rounded-lg lg:rounded-xl transition-all duration-300 flex items-center justify-center relative text-xs lg:text-sm font-medium shadow-sm",
                          playerIsFavorite
                            ? "bg-amber-100 hover:bg-amber-200 text-amber-700 hover:text-amber-800 border border-amber-200 hover:border-amber-300"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
                          (isLoading || (playerIsExclusive && playerIsFavorite)) && "opacity-60 cursor-not-allowed",
                        )}
                      >
                        {isLoading ? (
                          <Loader2 className="h-3 w-3 lg:h-4 lg:w-4 animate-spin" />
                        ) : (
                          <>
                            <span className="hidden lg:inline">
                              {playerIsFavorite ? PLAYER_DETAIL_TEXTS.BUTTONS.FAVORITE.REMOVE : PLAYER_DETAIL_TEXTS.BUTTONS.FAVORITE.ADD}
                            </span>
                            <span className="lg:hidden">
                              {playerIsFavorite ? "Remove" : "Add"}
                            </span>
                            <Star className={cn("h-3 w-3 lg:h-4 lg:w-4", playerIsFavorite && "fill-current")} />
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[9999]">
                      <p className="text-xs max-w-[200px]">
                        {playerIsExclusive && playerIsFavorite
                          ? PLAYER_DETAIL_TEXTS.TOOLTIPS.FAVORITE.CANNOT_REMOVE
                          : playerIsFavorite
                            ? PLAYER_DETAIL_TEXTS.TOOLTIPS.FAVORITE.REMOVE
                            : PLAYER_DETAIL_TEXTS.TOOLTIPS.FAVORITE.ADD}
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={(e) => {
                          if (isLoading || (!canMarkExclusive && !playerIsExclusive)) {
                            e.preventDefault()
                            e.stopPropagation()
                            return
                          }
                          handleExclusiveClick(e)
                        }}
                        className={cn(
                          "gap-1 lg:gap-2 h-9 w-20 lg:h-11 lg:w-auto px-4 lg:px-6 rounded-lg lg:rounded-xl transition-all duration-300 relative text-xs lg:text-sm font-medium shadow-sm flex items-center justify-center",
                          playerIsExclusive
                            ? "bg-as1-purple-100 hover:bg-as1-purple-200 text-as1-purple-700 hover:text-as1-purple-800 border border-as1-purple-200 hover:border-as1-purple-300"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
                          (isLoading || (!canMarkExclusive && !playerIsExclusive)) && "opacity-60 cursor-not-allowed",
                        )}
                      >
                        {isLoading ? (
                          <Loader2 className="h-3 w-3 lg:h-4 lg:w-4 animate-spin" />
                        ) : (
                          <>
                            <span className="hidden lg:inline">
                              {playerIsExclusive ? PLAYER_DETAIL_TEXTS.BUTTONS.EXCLUSIVE.REMOVE : PLAYER_DETAIL_TEXTS.BUTTONS.EXCLUSIVE.ADD}
                            </span>
                            <span className="lg:hidden">
                              {playerIsExclusive ? "Remove" : "Add"}
                            </span>
                            <Gem 
                              className="h-3 w-3 lg:h-4 lg:w-4" 
                              strokeWidth={2.5}
                              color={playerIsExclusive ? "currentColor" : "#6b7280"}
                            />
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[9999]">
                      <p className="text-xs max-w-[200px]">
                        {!canMarkExclusive && !playerIsExclusive
                          ? PLAYER_DETAIL_TEXTS.TOOLTIPS.EXCLUSIVE.LIMIT_REACHED
                          : playerIsExclusive
                            ? PLAYER_DETAIL_TEXTS.TOOLTIPS.EXCLUSIVE.REMOVE
                            : PLAYER_DETAIL_TEXTS.TOOLTIPS.EXCLUSIVE.ADD}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
            </div>
          </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

          {/* Content Container */}
          <div className="flex-1 border border-border/20 rounded-lg p-3 sm:p-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              <PlayerInfoCard player={player} team={team || undefined} />
              <PlayerHighlights videos={player?.playerVideos} onVideoPlayed={markVideoPlayed} />
              <div className="xl:col-span-2">
                <PlayerStatsCard playerId={playerId} />
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialogs */}
        <ConfirmDialog
          open={showRemoveFavoriteDialog}
          onOpenChange={setShowRemoveFavoriteDialog}
          title={PLAYER_DETAIL_TEXTS.MODAL.REMOVE_FAVORITE.TITLE}
          description={PLAYER_DETAIL_TEXTS.MODAL.REMOVE_FAVORITE.DESCRIPTION(player.firstName, player.lastName)}
          confirmText={PLAYER_DETAIL_TEXTS.MODAL.REMOVE_FAVORITE.CONFIRM}
          cancelText={PLAYER_DETAIL_TEXTS.MODAL.REMOVE_FAVORITE.CANCEL}
          onConfirm={confirmRemoveFavorite}
          variant="destructive"
        />

        <ConfirmDialog
          open={showRemoveExclusiveDialog}
          onOpenChange={setShowRemoveExclusiveDialog}
          title={PLAYER_DETAIL_TEXTS.MODAL.REMOVE_EXCLUSIVE.TITLE}
          description={PLAYER_DETAIL_TEXTS.MODAL.REMOVE_EXCLUSIVE.DESCRIPTION(player.firstName, player.lastName)}
          confirmText={PLAYER_DETAIL_TEXTS.MODAL.REMOVE_EXCLUSIVE.CONFIRM}
          cancelText={PLAYER_DETAIL_TEXTS.MODAL.REMOVE_EXCLUSIVE.CANCEL}
          onConfirm={confirmRemoveExclusive}
        />
      </TooltipProvider>
  )
}
