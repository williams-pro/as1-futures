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
      <div className="flex items-start justify-between gap-3">
        {/* Primera columna - Información del jugador */}
        <div className="flex-1 min-w-0">
          {/* First Name */}
          <div>
            <h4 className={cn(
              "text-foreground font-bold text-base leading-tight",
              "truncate"
            )}>
              {firstName}
            </h4>
          </div>
          
          {/* Last Name */}
          <div>
            <h5 className={cn(
              "text-base font-bold text-foreground leading-tight",
              "truncate"
            )}>
              {lastName}
            </h5>
          </div>
          
          {/* Jersey Number */}
          <div>
            <span className={cn("font-mono text-sm text-muted-foreground")}>
              #{jerseyNumber}
            </span>
          </div>
          
          {/* Position */}
          <div>
            <span className={cn("text-sm text-muted-foreground")}>
              {position}
            </span>
          </div>
        </div>

        {/* Segunda columna - Iconos (children) */}
        {children && (
          <div className="flex-shrink-0 flex items-start">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
