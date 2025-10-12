"use client"

import { PageContent } from "@/components/layout/page-content"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft, Star, Gem, Shield } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PlayerInfoCard } from "./_components/player-info"
import { PlayerHighlights } from "./_components/player-highlights"
import { ConfirmDialog } from "./_components/confirm-dialog"
import { usePlayerDetail } from "./_hooks/use-player-detail"
import { cn } from "@/lib/utils"

interface PlayerDetailPageProps {
  params: {
    playerId: string
  }
}

export default function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  const {
    player,
    team,
    user,
    playerIsFavorite,
    playerIsExclusive,
    canMarkExclusive,
    handleFavoriteClick,
    handleExclusiveClick,
    showRemoveFavoriteDialog,
    setShowRemoveFavoriteDialog,
    showRemoveExclusiveDialog,
    setShowRemoveExclusiveDialog,
    confirmRemoveFavorite,
    confirmRemoveExclusive,
  } = usePlayerDetail(params.playerId)

  if (!player) {
    notFound()
  }

  const initials = `${player.firstName[0]}${player.lastName[0]}`

  return (
    <PageContent>
      <TooltipProvider delayDuration={300}>
        <div className="space-y-8">
          {/* Header Navigation */}
          <div>
            {team ? (
              <Link href={`/teams/${team.id}`}>
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to {team.name}
                </Button>
              </Link>
            ) : (
              <Link href="/teams">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Teams
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
                    #{player.jerseyNumber}
                  </Badge>
                  <Badge variant="secondary" className="text-slate-600">
                    {player.position}
                  </Badge>
                  {playerIsFavorite && (
                    <Badge className="bg-amber-100 text-amber-700 gap-1.5 border-0">
                      <Star className="h-3 w-3 fill-amber-500" />
                      Favorite
                    </Badge>
                  )}
                  {playerIsExclusive && (
                    <Badge className="bg-slate-800 text-amber-400 gap-1.5 border-0">
                      <Gem className="h-3 w-3 fill-amber-400" />
                      Exclusive
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl font-light text-foreground tracking-tight text-balance">
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
                        Group {team.group}
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Action Buttons with Tooltips */}
              {user?.role === "scout" && (
                <div className="flex flex-wrap gap-3 pt-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleFavoriteClick}
                        disabled={playerIsExclusive && playerIsFavorite}
                        className={cn(
                          "gap-2 h-11 px-6 rounded-xl transition-all duration-300",
                          playerIsFavorite
                            ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
                          playerIsExclusive && playerIsFavorite && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <Star className={cn("h-4 w-4", playerIsFavorite && "fill-current")} />
                        {playerIsFavorite ? "Remove Favorite" : "Add to Favorites"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {playerIsExclusive && playerIsFavorite
                        ? "Cannot remove favorite while player is exclusive. Remove exclusive status first."
                        : playerIsFavorite
                          ? "Click to remove from favorites"
                          : "Click to add to favorites (unlimited)"}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleExclusiveClick}
                        disabled={!canMarkExclusive}
                        className={cn(
                          "gap-2 h-11 px-6 rounded-xl transition-all duration-300",
                          playerIsExclusive
                            ? "bg-slate-800 hover:bg-slate-900 text-amber-400 shadow-lg hover:shadow-xl border border-amber-400/20"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
                          !canMarkExclusive && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <Gem className={cn("h-4 w-4", playerIsExclusive && "fill-amber-400")} />
                        {playerIsExclusive ? "Remove Exclusive" : "Mark as Exclusive"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {!canMarkExclusive
                        ? "Maximum exclusives reached (3/3). Remove one first."
                        : playerIsExclusive
                          ? "Click to remove exclusive status. Player will remain in favorites."
                          : "Click to mark as exclusive (max 3 players). Automatically adds to favorites."}
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <PlayerInfoCard player={player} />
            <PlayerHighlights videoUrls={player.videoUrls} />
          </div>
        </div>

        {/* Confirmation Dialogs */}
        <ConfirmDialog
          open={showRemoveFavoriteDialog}
          onOpenChange={setShowRemoveFavoriteDialog}
          title="Remove from Favorites?"
          description={`Are you sure you want to remove ${player.firstName} ${player.lastName} from your favorites? This action cannot be undone.`}
          confirmText="Remove"
          cancelText="Cancel"
          onConfirm={confirmRemoveFavorite}
          variant="destructive"
        />

        <ConfirmDialog
          open={showRemoveExclusiveDialog}
          onOpenChange={setShowRemoveExclusiveDialog}
          title="Remove Exclusive Status?"
          description={`${player.firstName} ${player.lastName} will no longer be marked as exclusive, but will remain in your favorites. You can mark another player as exclusive.`}
          confirmText="Remove Exclusive"
          cancelText="Cancel"
          onConfirm={confirmRemoveExclusive}
        />
      </TooltipProvider>
    </PageContent>
  )
}
