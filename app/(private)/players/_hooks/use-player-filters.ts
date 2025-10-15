"use client"

import { useState, useMemo } from "react"
import { usePlayersData } from "./use-players-data"

interface Player {
  id: string
  first_name: string
  last_name: string
  jersey_number: number
  position: string
  team: {
    id: string
    name: string
    team_code: string
    group: string
  }
  tournament_group: {
    name: string
  }
  photo_url?: string
  video_url?: string
  is_favorite?: boolean
  is_exclusive?: boolean
}

export function usePlayerFilters() {
  const { players, teams, positions, isLoading, error } = usePlayersData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [selectedPosition, setSelectedPosition] = useState<string>("all")

  const filteredPlayers = useMemo(() => {
    let filtered = [...players]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (player) =>
          player.first_name.toLowerCase().includes(query) ||
          player.last_name.toLowerCase().includes(query) ||
          player.jersey_number.toString().includes(query),
      )
    }

    // Team filter
    if (selectedTeam !== "all") {
      filtered = filtered.filter((player) => player.team.id === selectedTeam)
    }

    // Position filter
    if (selectedPosition !== "all") {
      filtered = filtered.filter((player) => player.position === selectedPosition)
    }

    return filtered
  }, [players, searchQuery, selectedTeam, selectedPosition])

  return {
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
  }
}
