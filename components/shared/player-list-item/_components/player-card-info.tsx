import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface PlayerCardInfoProps {
  firstName: string
  lastName: string
  jerseyNumber: number
  position: string
  className?: string
  children?: ReactNode
}

export function PlayerCardInfo({
  firstName,
  lastName,
  jerseyNumber,
  position,
  className,
  children
}: PlayerCardInfoProps) {
  return (
    <div className={cn("flex-1 min-w-0", className)}>
      <div className="space-y-1.5">
        {/* First Name */}
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn(
            "font-semibold text-foreground text-base leading-tight",
            "truncate flex-1 min-w-0"
          )}>
            {firstName}
          </h4>
          <div className="flex-shrink-0 ml-2">
            {children}
          </div>
        </div>
        
        {/* Last Name */}
        <div className="flex items-center gap-2">
          <h5 className={cn(
            "font-medium text-foreground text-sm leading-tight",
            "truncate"
          )}>
            {lastName}
          </h5>
        </div>
        
        {/* Jersey Number */}
        <div className="flex items-center gap-2">
          <span className={cn("font-mono text-sm text-muted-foreground")}>
            #{jerseyNumber}
          </span>
        </div>
        
        {/* Position */}
        <div className="flex items-center gap-2">
          <span className={cn("text-sm text-muted-foreground")}>
            {position}
          </span>
        </div>
      </div>
    </div>
  )
}
