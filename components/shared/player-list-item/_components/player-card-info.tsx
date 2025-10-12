import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface PlayerCardInfoProps {
  firstName: string
  lastName: string
  jerseyNumber: number
  position: string
  teamName?: string
  className?: string
  children?: ReactNode
}

export function PlayerCardInfo({
  firstName,
  lastName,
  jerseyNumber,
  position,
  teamName = "Team",
  className,
  children
}: PlayerCardInfoProps) {
  return (
    <div className={cn("flex-1", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className={cn("font-semibold text-foreground")}>
            {firstName} {lastName}
          </h4>
          <p className={cn("font-mono text-sm text-muted-foreground")}>
            #{jerseyNumber} · {position}
          </p>
          <p className={cn("text-xs text-muted-foreground")}>
            {teamName}
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
