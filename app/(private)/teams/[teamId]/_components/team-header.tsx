import { Shield, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { TEAM_DETAIL_TEXTS } from "../_constants/team-detail"
import type { Team } from "@/lib/types"

interface TeamHeaderProps {
  team: Team
  playerCount: number
}

export function TeamHeader({ team, playerCount }: TeamHeaderProps) {
  return (
    <div className="flex items-start gap-6">
      {/* Logo Circular */}
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-50 to-slate-100/80 border-2 border-as1-gold/20 shadow-sm">
          {team.logoUrl ? (
            <img
              src={team.logoUrl}
              alt={TEAM_DETAIL_TEXTS.ALT_TEXTS.TEAM_LOGO(team.name)}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <Shield className="h-10 w-10 text-slate-400/70" />
          )}
        </div>
      </div>

      {/* Team Info */}
      <div className="flex-1 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 bg-slate-100/60 px-3 py-1.5 rounded-full border border-border/20">
              <div className="w-1.5 h-1.5 bg-as1-gold rounded-full" />
              <span className="text-sm font-medium text-slate-700">
                {TEAM_DETAIL_TEXTS.UI.GROUP_PREFIX} {team.group}
              </span>
            </div>
            
            {/* Player Count */}
            <div className="flex items-center gap-1.5 bg-slate-100/50 px-3 py-1.5 rounded-full border border-border/20">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">
                {playerCount} {playerCount === 1 ? TEAM_DETAIL_TEXTS.UI.PLAYER_COUNT.SINGLE : TEAM_DETAIL_TEXTS.UI.PLAYER_COUNT.PLURAL}
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl font-light text-foreground tracking-tight text-balance">
            {team.name}
          </h1>
        </div>
      </div>
    </div>
  )
}
