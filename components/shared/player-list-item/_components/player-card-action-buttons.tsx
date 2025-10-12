"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Star, Gem } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlayerCardActionButtonsProps {
  playerId: string
  playerIsFavorite: boolean
  playerIsExclusive: boolean
  canMarkExclusive: boolean
  onFavoriteClick: (e: React.MouseEvent) => void
  onExclusiveClick: (e: React.MouseEvent) => void
  favoriteTooltip: string
  exclusiveTooltip: string
}

export function PlayerCardActionButtons({
  playerId,
  playerIsFavorite,
  playerIsExclusive,
  canMarkExclusive,
  onFavoriteClick,
  onExclusiveClick,
  favoriteTooltip,
  exclusiveTooltip,
}: PlayerCardActionButtonsProps) {
  return (
    <div className="flex gap-1">
      {/* Favorite Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-200",
              "hover:bg-secondary",
              playerIsFavorite 
                ? "text-amber-500 hover:text-amber-600 bg-amber-100 hover:bg-amber-200" 
                : "text-muted-foreground",
              playerIsExclusive && playerIsFavorite && "opacity-60 cursor-not-allowed"
            )}
            onClick={onFavoriteClick}
          >
            <Star 
              size={16} 
              fill={playerIsFavorite ? "currentColor" : "none"} 
              strokeWidth={2.5}
              color={playerIsFavorite ? "currentColor" : "#6b7280"}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-[200px]">{favoriteTooltip}</p>
        </TooltipContent>
      </Tooltip>
      
      {/* Exclusive Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-200",
              "hover:bg-secondary",
              playerIsExclusive 
                ? "text-as1-purple-500 hover:text-as1-purple-600 bg-as1-purple-100 hover:bg-as1-purple-200" 
                : "text-muted-foreground",
              !canMarkExclusive && !playerIsExclusive && "opacity-60 cursor-not-allowed"
            )}
            onClick={onExclusiveClick}
          >
            <Gem 
              size={16} 
              strokeWidth={2.5}
              color={playerIsExclusive ? "currentColor" : "#6b7280"}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-[200px]">{exclusiveTooltip}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
