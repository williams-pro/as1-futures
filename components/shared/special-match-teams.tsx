"use client"

import { Badge } from "@/components/ui/badge"
import type { SpecialMatchWithTeams } from "@/lib/types/special-matches.types"

interface SpecialMatchTeamsProps {
  match: SpecialMatchWithTeams
  className?: string
}

export function SpecialMatchTeams({ match, className }: SpecialMatchTeamsProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1">
        {match.home_team ? (
          <div className="flex items-center gap-2">
            <span className="font-medium">{match.home_team.name}</span>
            <Badge variant="outline" className="text-xs">
              {match.home_team.team_code}
            </Badge>
          </div>
        ) : (
          <span className="text-muted-foreground italic">
            {match.home_team_display || "TBD"}
          </span>
        )}
      </div>
      
      <div className="mx-4 text-muted-foreground font-medium">
        vs
      </div>
      
      <div className="flex-1 text-right">
        {match.away_team ? (
          <div className="flex items-center justify-end gap-2">
            <Badge variant="outline" className="text-xs">
              {match.away_team.team_code}
            </Badge>
            <span className="font-medium">{match.away_team.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground italic">
            {match.away_team_display || "TBD"}
          </span>
        )}
      </div>
    </div>
  )
}
