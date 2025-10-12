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
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={isDisabled}
            className={cn(
              "h-7 w-7 rounded-md transition-all duration-200 relative",
              // Favorite styles
              isFavorite && isActive && "bg-amber-100 text-amber-600 hover:bg-amber-200 hover:text-amber-700",
              isFavorite && !isActive && "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-amber-600",
              // Exclusive styles
              isExclusive && isActive && "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700",
              isExclusive && !isActive && "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700",
              // Disabled state
              isDisabled && "opacity-40 cursor-not-allowed",
              className,
            )}
          >
            {isFavorite && (
              <Star
                className={cn(
                  "h-3.5 w-3.5 transition-all duration-200",
                  isActive ? "fill-amber-500 stroke-amber-500" : "stroke-slate-400",
                )}
              />
            )}
            {isExclusive && (
              <>
                <div
                  className={cn(
                    "absolute inset-0 rounded-md transition-all duration-200",
                    isActive && "bg-slate-600/10",
                  )}
                />
                <Gem
                  className={cn(
                    "h-3.5 w-3.5 transition-all duration-200 relative z-10",
                    isActive ? "stroke-slate-600" : "stroke-slate-400",
                  )}
                />
                {isActive && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-slate-600 rounded-full border border-white z-20" />
                )}
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="z-[9999]">{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
