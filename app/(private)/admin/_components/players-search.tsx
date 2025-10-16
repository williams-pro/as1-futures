"use client"

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, X, Filter } from 'lucide-react'
import { Player } from '@/lib/types/admin.types'
import { PLAYER_POSITIONS, POSITION_DISPLAY_NAMES } from '@/lib/constants/player-positions'

interface PlayersSearchProps {
  players: Player[]
  onFilteredPlayers: (filteredPlayers: Player[]) => void
}

export function PlayersSearch({ players, onFilteredPlayers }: PlayersSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPosition, setSelectedPosition] = useState<string>('all')
  const [selectedTeam, setSelectedTeam] = useState<string>('all')

  // Get unique teams for filter
  const uniqueTeams = useMemo(() => {
    const teams = players
      .map(player => player.team)
      .filter(Boolean)
      .reduce((acc, team) => {
        if (team && !acc.find(t => t.id === team.id)) {
          acc.push(team)
        }
        return acc
      }, [] as any[])
    
    return teams.sort((a, b) => a.name.localeCompare(b.name))
  }, [players])

  // Filter players based on search criteria
  const filteredPlayers = useMemo(() => {
    let filtered = players

    // Search by name
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(player => 
        player.first_name.toLowerCase().includes(term) ||
        player.last_name.toLowerCase().includes(term) ||
        player.full_name.toLowerCase().includes(term)
      )
    }

    // Filter by position
    if (selectedPosition !== 'all') {
      filtered = filtered.filter(player => player.position === selectedPosition)
    }

    // Filter by team
    if (selectedTeam !== 'all') {
      filtered = filtered.filter(player => player.team?.id === selectedTeam)
    }

    return filtered
  }, [players, searchTerm, selectedPosition, selectedTeam])

  // Update parent component when filtered players change
  useMemo(() => {
    onFilteredPlayers(filteredPlayers)
  }, [filteredPlayers, onFilteredPlayers])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedPosition('all')
    setSelectedTeam('all')
  }

  const hasActiveFilters = searchTerm || selectedPosition !== 'all' || selectedTeam !== 'all'

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search players by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Position Filter */}
        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Positions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {PLAYER_POSITIONS.map((position) => (
              <SelectItem key={position} value={position}>
                {POSITION_DISPLAY_NAMES[position]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Team Filter */}
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {uniqueTeams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>
            Showing {filteredPlayers.length} of {players.length} players
          </span>
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span>Active filters:</span>
            {searchTerm && (
              <Badge variant="secondary" className="text-xs">
                Search: "{searchTerm}"
              </Badge>
            )}
            {selectedPosition !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Position: {POSITION_DISPLAY_NAMES[selectedPosition as keyof typeof POSITION_DISPLAY_NAMES]}
              </Badge>
            )}
            {selectedTeam !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Team: {uniqueTeams.find(t => t.id === selectedTeam)?.name}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
