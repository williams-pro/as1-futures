import { Users } from "lucide-react"
import { PlayerListItem } from "@/components/shared/player-list-item"
import { TEAM_DETAIL_TEXTS } from "../_constants/team-detail"
import type { Player } from "@/lib/types"

interface TeamPlayersSectionProps {
  players: Player[]
}

export function TeamPlayersSection({ players }: TeamPlayersSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-foreground tracking-tight mb-4">
          {TEAM_DETAIL_TEXTS.UI.TEAM_ROSTER}
        </h2>
      </div>

      {players.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-start">
          {players.map((player) => (
            <div key={player.id} className="w-full lg:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)] min-w-[280px] xl:max-w-[450px]">
              <PlayerListItem player={player} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-slate-100/50 p-6 border border-border/20">
            <Users className="h-12 w-12 text-slate-400/70" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            {TEAM_DETAIL_TEXTS.UI.NO_PLAYERS_TITLE}
          </h3>
          <p className="text-muted-foreground max-w-sm">
            {TEAM_DETAIL_TEXTS.UI.NO_PLAYERS_DESCRIPTION}
          </p>
        </div>
      )}
    </div>
  )
}
