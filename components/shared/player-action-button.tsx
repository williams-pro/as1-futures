"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Star, Gem } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlayerActionButtonProps {
  type: "favorite" | "exclusive"
  isActive: boolean
  isDisabled?: boolean
  onClick: (e: React.MouseEvent) => void
  tooltipContent: React.ReactNode
  className?: string
  exclusiveCount?: number
}

export function PlayerActionButton({
  type,
  isActive,
  isDisabled = false,
  onClick,
  tooltipContent,
  className,
}: PlayerActionButtonProps) {
  const isFavorite = type === "favorite"
  const isExclusive = type === "exclusive"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            if (isDisabled) {
              e.preventDefault()
              e.stopPropagation()
              return
            }
            onClick(e)
          }}
          className={cn(
            "h-7 w-7 rounded-md transition-all duration-200",
            "hover:bg-secondary",
            // Favorite styles - consistent with player-list-item
            isFavorite && isActive && "text-amber-500 hover:text-amber-600 bg-amber-100 hover:bg-amber-200",
            isFavorite && !isActive && "text-muted-foreground",
            // Exclusive styles - consistent with player-list-item
            isExclusive && isActive && "text-as1-purple-500 hover:text-as1-purple-600 bg-as1-purple-100 hover:bg-as1-purple-200",
            isExclusive && !isActive && "text-muted-foreground",
            // Disabled state - visual only, not actually disabled
            isDisabled && "opacity-60 cursor-not-allowed",
            className,
          )}
        >
          {isFavorite && (
            <Star
              size={14}
              fill={isActive ? "currentColor" : "none"}
              strokeWidth={2.5}
              color={isActive ? "currentColor" : "#6b7280"}
            />
          )}
          {isExclusive && (
            <Gem
              size={14}
              strokeWidth={2.5}
              color={isActive ? "currentColor" : "#6b7280"}
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="z-[9999]">{tooltipContent}</TooltipContent>
    </Tooltip>
  )
}
