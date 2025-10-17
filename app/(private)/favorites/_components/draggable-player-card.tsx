"use client"

import type React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GripVertical, X, ExternalLink } from "lucide-react"
import { PlayerActionButton } from "@/components/shared/player-action-button"
import type { Player } from "@/lib/types"

interface PlayerWithTeam extends Player {
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
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ConfirmDialog } from "./confirm-dialog"

interface DraggablePlayerCardProps {
  player: PlayerWithTeam
  isExclusive: boolean
  isFavorite: boolean
  canAddExclusive: boolean
  onRemove: () => void
  onToggleFavorite: () => void
  onToggleExclusive: () => void
  sectionType?: "exclusives" | "favorites"
}

export function DraggablePlayerCard({
  player,
  isExclusive,
  isFavorite,
  canAddExclusive,
  onRemove,
  onToggleFavorite,
  onToggleExclusive,
  sectionType = "favorites",
}: DraggablePlayerCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: player.id,
  })

  const [showRemoveExclusiveDialog, setShowRemoveExclusiveDialog] = useState(false)
  const [showRemoveFavoriteDialog, setShowRemoveFavoriteDialog] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const initials = `${player.firstName[0]}${player.lastName[0]}`

  const handleExclusiveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isExclusive) {
      setShowRemoveExclusiveDialog(true)
    } else {
      onToggleExclusive()
    }
  }

  const handleConfirmRemoveExclusive = () => {
    onToggleExclusive()
    setShowRemoveExclusiveDialog(false)
  }

  const handleConfirmRemoveFavorite = () => {
    onRemove()
    setShowRemoveFavoriteDialog(false)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isExclusive && isFavorite) {
      return
    }
    onToggleFavorite()
  }

  return (
    <TooltipProvider>
      <div ref={setNodeRef} style={style} className={cn(isDragging && "opacity-60 scale-95")}>
        <Card
          className={cn(
            "bg-white/50 backdrop-blur-sm border border-border/40 hover:shadow-md transition-all duration-300 rounded-xl",
            isDragging && "shadow-lg border-as1-gold/40",
            isExclusive && "border-slate-200/50 hover:border-slate-300/50",
          )}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              {/* Drag Handle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Drag to reorder</p>
                </TooltipContent>
              </Tooltip>

              {/* Player Avatar */}
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-border/30 overflow-hidden flex-shrink-0">
                <Avatar className="h-full w-full rounded-lg border-0">
                  {player.photoUrl ? (
                    <AvatarImage
                      src={player.photoUrl || "/placeholder.svg"}
                      alt={`${player.firstName} ${player.lastName}`}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-transparent text-slate-700 font-medium text-xs rounded-lg">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0 space-y-1">
                 {/* Team Name - More Prominent */}
                 {player.team && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-as1-gold bg-as1-gold/10 px-2 py-0.5 rounded-full border border-as1-gold/20">
                      {player.team.name}
                    </span>
                  </div>
                )}
                {/* Player Name */}
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-sm truncate leading-tight">
                    {player.firstName} {player.lastName}
                  </h3>
                </div>
                
               
                
                {/* Player Details */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono font-medium bg-slate-100/50 px-1.5 py-0.5 rounded">
                    #{player.jerseyNumber}
                  </span>
                  <span className="truncate">{player.position}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Favorite Button */}
                <PlayerActionButton
                  type="favorite"
                  isActive={isFavorite}
                  isDisabled={isExclusive && isFavorite}
                  onClick={handleFavoriteClick}
                  tooltipContent={
                    <p className="text-xs">
                      {isExclusive && isFavorite
                        ? "Remove exclusive status first"
                        : isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"}
                    </p>
                  }
                />

                {/* Exclusive Button */}
                <PlayerActionButton
                  type="exclusive"
                  isActive={isExclusive}
                  isDisabled={!isExclusive && !canAddExclusive}
                  onClick={handleExclusiveClick}
                  tooltipContent={
                    <p className="text-xs">
                      {isExclusive
                        ? "Remove exclusive status"
                        : !canAddExclusive
                          ? "Maximum 3 exclusives reached"
                          : "Mark as exclusive"}
                    </p>
                  }
                />

                {/* View Player */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/players/${player.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">View player details</p>
                  </TooltipContent>
                </Tooltip>

                {/* Remove Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowRemoveFavoriteDialog(true)
                      }}
                      className="h-7 w-7 rounded-md bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-600 transition-all duration-200"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Remove from list</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        <ConfirmDialog
          open={showRemoveExclusiveDialog}
          onOpenChange={setShowRemoveExclusiveDialog}
          onConfirm={handleConfirmRemoveExclusive}
          title="Remove Exclusive Status?"
          description={`Are you sure you want to remove the exclusive status from ${player.firstName} ${player.lastName}? The player will remain in your favorites.`}
          confirmText="Remove Exclusive"
          cancelText="Cancel"
        />

        <ConfirmDialog
          open={showRemoveFavoriteDialog}
          onOpenChange={setShowRemoveFavoriteDialog}
          onConfirm={handleConfirmRemoveFavorite}
          title={sectionType === "exclusives" ? "Remove Exclusive Status?" : "Remove from Favorites?"}
          description={
            sectionType === "exclusives" 
              ? `Are you sure you want to remove the exclusive status from ${player.firstName} ${player.lastName}? The player will remain in your favorites.`
              : isExclusive
                ? `Are you sure you want to remove the exclusive status from ${player.firstName} ${player.lastName}? The player will remain in your favorites.`
                : `Are you sure you want to remove ${player.firstName} ${player.lastName} from your favorites? The player will no longer appear in any section.`
          }
          confirmText={sectionType === "exclusives" ? "Remove Exclusive" : isExclusive ? "Remove Exclusive" : "Remove"}
          cancelText="Cancel"
          variant={sectionType === "exclusives" || isExclusive ? "default" : "destructive"}
        />
      </div>
    </TooltipProvider>
  )
}
