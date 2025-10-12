"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { MOCK_TEAMS } from "@/lib/mock-data"

interface PlayerFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedTeam: string
  onTeamChange: (value: string) => void
  selectedPosition: string
  onPositionChange: (value: string) => void
  positions: string[]
  resultCount: number
}

export function PlayerFilters({
  searchQuery,
  onSearchChange,
  selectedTeam,
  onTeamChange,
  selectedPosition,
  onPositionChange,
  positions,
  resultCount,
}: PlayerFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or jersey number..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-border focus:border-primary focus:ring-primary"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedTeam} onValueChange={onTeamChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {MOCK_TEAMS.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPosition} onValueChange={onPositionChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Positions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {positions.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center text-sm text-muted-foreground sm:ml-auto">
          <span className="font-mono font-semibold text-foreground">{resultCount}</span>
          <span className="ml-1">{resultCount === 1 ? "player" : "players"}</span>
        </div>
      </div>
    </div>
  )
}
