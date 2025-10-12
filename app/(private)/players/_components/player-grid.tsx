"use client"

import type { Player } from "@/lib/types"
import { PlayerListItem } from "@/app/teams/[teamId]/_components/player-list-item"
import { Users } from "lucide-react"

interface PlayerGridProps {
  players: Player[]
}

export function PlayerGrid({ players }: PlayerGridProps) {
  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-6">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">No players found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {players.map((player) => (
        <PlayerListItem key={player.id} player={player} />
      ))}
    </div>
  )
}
