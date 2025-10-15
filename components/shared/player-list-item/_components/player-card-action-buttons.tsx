"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Star, Gem, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlayerCardActionButtonsProps {
  playerId: string
  playerIsFavorite: boolean
  playerIsExclusive: boolean
  canMarkExclusive: boolean
  isLoading: boolean
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
  isLoading,
  onFavoriteClick,
  onExclusiveClick,
  favoriteTooltip,
  exclusiveTooltip,
}: PlayerCardActionButtonsProps) {
  // Estado local para rastrear qué jugador está siendo procesado
  const [isThisPlayerLoading, setIsThisPlayerLoading] = useState(false)
  
  // Resetear loading local cuando el loading global termine
  useEffect(() => {
    if (!isLoading) {
      setIsThisPlayerLoading(false)
    }
  }, [isLoading])
  
  // Loading solo si es global Y es este jugador específico
  const isFavoriteLoading = isLoading && isThisPlayerLoading
  const isExclusiveLoading = isLoading && isThisPlayerLoading
  
  const isFavoriteDisabled = isFavoriteLoading || (playerIsExclusive && playerIsFavorite)
  const isExclusiveDisabled = isExclusiveLoading || (!canMarkExclusive && !playerIsExclusive)

  return (
    <div className="flex gap-1">
      {/* Favorite Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={async (e) => {
              if (isFavoriteDisabled) {
                e.preventDefault()
                e.stopPropagation()
                return
              }
              
              // Activar loading local para este jugador
              setIsThisPlayerLoading(true)
              await onFavoriteClick(e)
            }}
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-200 relative",
              "hover:bg-secondary",
              playerIsFavorite 
                ? "text-amber-500 hover:text-amber-600 bg-amber-100 hover:bg-amber-200" 
                : "text-muted-foreground",
              isFavoriteDisabled && "opacity-60 cursor-not-allowed"
            )}
          >
            {isThisPlayerLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Star 
                size={16} 
                fill={playerIsFavorite ? "currentColor" : "none"} 
                strokeWidth={2.5}
                color={playerIsFavorite ? "currentColor" : "#6b7280"}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="z-[9999]">
          <p className="text-xs max-w-[200px]">{favoriteTooltip}</p>
        </TooltipContent>
      </Tooltip>
      
      {/* Exclusive Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={async (e) => {
              if (isExclusiveDisabled) {
                e.preventDefault()
                e.stopPropagation()
                return
              }
              
              // Activar loading local para este jugador
              setIsThisPlayerLoading(true)
              await onExclusiveClick(e)
            }}
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-200 relative",
              "hover:bg-secondary",
              playerIsExclusive 
                ? "text-as1-purple-500 hover:text-as1-purple-600 bg-as1-purple-100 hover:bg-as1-purple-200" 
                : "text-muted-foreground",
              isExclusiveDisabled && "opacity-60 cursor-not-allowed"
            )}
          >
            {isThisPlayerLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Gem 
                size={16} 
                strokeWidth={2.5}
                color={playerIsExclusive ? "currentColor" : "#6b7280"}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="z-[9999]">
          <p className="text-xs max-w-[200px]">{exclusiveTooltip}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}