"use client"

import { PlayerFilters } from "./_components/player-filters"
import { PlayerGrid } from "./_components/player-grid"
import { usePlayerFilters } from "./_hooks/use-player-filters"

export default function PlayersPage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedTeam,
    setSelectedTeam,
    selectedPosition,
    setSelectedPosition,
    filteredPlayers,
    positions,
  } = usePlayerFilters()

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Players</h1>
          <p className="mt-2 text-muted-foreground">Browse and search all tournament players</p>
        </div>

        <PlayerFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}
          selectedPosition={selectedPosition}
          onPositionChange={setSelectedPosition}
          positions={positions}
          resultCount={filteredPlayers.length}
        />

        <PlayerGrid players={filteredPlayers} />
      </div>
  )
}
