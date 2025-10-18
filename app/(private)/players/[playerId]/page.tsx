"use client"

import { use } from "react"
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
import { ConfirmDialog } from "./_components/confirm-dialog"
import { usePlayerDetail } from "./_hooks/use-player-detail"
import { cn } from "@/lib/utils"
import { PLAYER_DETAIL_TEXTS } from "./_constants/player-detail"

interface PlayerDetailPageProps {
  params: Promise<{
    playerId: string
  }>
}

export default function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  const { playerId } = use(params)
  const {
    player,
    team,
    user,
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

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Navigation Skeleton */}
        <div>
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Player Header Skeleton */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Player Avatar Skeleton */}
          <div className="flex-shrink-0">
            <Skeleton className="h-40 w-40 rounded-2xl" />
          </div>

          {/* Player Info Skeleton */}
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-12 w-64" />
            </div>

            {/* Team Info Skeleton */}
            <Skeleton className="h-16 w-48" />

            {/* Action Buttons Skeleton */}
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-11 w-32" />
              <Skeleton className="h-11 w-32" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
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
      <div className="space-y-8">
          {/* Header Navigation */}
          <div>
            {team ? (
              <Link href={`/teams/${team.id}`}>
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  {PLAYER_DETAIL_TEXTS.UI.BACK_TO_TEAM} {team.name}
                </Button>
              </Link>
            ) : (
              <Link href="/teams">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  {PLAYER_DETAIL_TEXTS.UI.BACK_TO_TEAMS}
                </Button>
              </Link>
            )}
          </div>

          {/* Player Header */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Player Avatar */}
            <div className="flex-shrink-0">
              <div className="h-40 w-40 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-border/30 shadow-sm overflow-hidden">
                <Avatar className="h-full w-full rounded-2xl border-0">
                  {player.photoUrl ? (
                    <AvatarImage
                      src={player.photoUrl || "/placeholder.svg"}
                      alt={`${player.firstName} ${player.lastName}`}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-transparent text-slate-700 text-4xl font-bold rounded-2xl">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1 space-y-6">
              {/* Badges y Nombre */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-slate-100 text-slate-700 font-mono text-sm border-0">
                    {PLAYER_DETAIL_TEXTS.UI.JERSEY_PREFIX}{player.jerseyNumber}
                  </Badge>
                  <Badge variant="secondary" className="text-slate-600">
                    {player.position}
                  </Badge>
                  {playerIsFavorite && (
                    <Badge className="bg-amber-100 text-amber-700 gap-1.5 border-0">
                      <Star className="h-3 w-3 fill-amber-500" />
                      {PLAYER_DETAIL_TEXTS.UI.FAVORITE_BADGE}
                    </Badge>
                  )}
                  {playerIsExclusive && (
                    <Badge className="bg-as1-purple-100 text-as1-purple-700 gap-1.5 border-0">
                      <Gem className="h-3 w-3" />
                      {PLAYER_DETAIL_TEXTS.UI.EXCLUSIVE_BADGE}
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl font-semibold text-foreground tracking-tight text-balance">
                  {player.firstName} <span className="font-semibold">{player.lastName}</span>
                </h1>
              </div>

              {/* Team Info */}
              {team && (
                <Link href={`/teams/${team.id}`}>
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

              {/* Action Buttons with Tooltips */}
              <div className="flex flex-wrap gap-3 pt-4">
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
                          "gap-2 h-11 px-6 rounded-xl transition-all duration-300 flex items-center relative",
                          playerIsFavorite
                            ? "bg-amber-100 hover:bg-amber-200 text-amber-700 hover:text-amber-800 border border-amber-200 hover:border-amber-300"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
                          (isLoading || (playerIsExclusive && playerIsFavorite)) && "opacity-60 cursor-not-allowed",
                        )}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            {playerIsFavorite ? PLAYER_DETAIL_TEXTS.BUTTONS.FAVORITE.REMOVE : PLAYER_DETAIL_TEXTS.BUTTONS.FAVORITE.ADD}
                            <Star className={cn("h-4 w-4", playerIsFavorite && "fill-current")} />
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
                          "gap-2 h-11 px-6 rounded-xl transition-all duration-300 relative",
                          playerIsExclusive
                            ? "bg-as1-purple-100 hover:bg-as1-purple-200 text-as1-purple-700 hover:text-as1-purple-800 border border-as1-purple-200 hover:border-as1-purple-300"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
                          (isLoading || (!canMarkExclusive && !playerIsExclusive)) && "opacity-60 cursor-not-allowed",
                        )}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            {playerIsExclusive ? PLAYER_DETAIL_TEXTS.BUTTONS.EXCLUSIVE.REMOVE : PLAYER_DETAIL_TEXTS.BUTTONS.EXCLUSIVE.ADD}
                            <Gem 
                              className="h-4 w-4" 
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

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <PlayerInfoCard player={player} team={team || undefined} />
            <PlayerHighlights videos={player?.playerVideos} />
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
