"use client"

import { PlayerFilters } from "./_components/player-filters"
import { PlayerGrid } from "./_components/player-grid"
import { usePlayerFilters } from "./_hooks/use-player-filters"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
    teams,
    isLoading,
    error,
  } = usePlayerFilters()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Players</h1>
          <p className="mt-2 text-muted-foreground">Browse and search all tournament players</p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-as1-gold" />
            <p className="text-sm text-muted-foreground">Loading players...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Players</h1>
          <p className="mt-2 text-muted-foreground">Browse and search all tournament players</p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

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
        teams={teams}
        resultCount={filteredPlayers.length}
      />

      <PlayerGrid players={filteredPlayers} />
    </div>
  )
}
