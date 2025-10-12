"use client"

import { useState, useMemo } from "react"
import { MOCK_PLAYERS } from "@/lib/mock-data"

export function usePlayerFilters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [selectedPosition, setSelectedPosition] = useState<string>("all")

  const filteredPlayers = useMemo(() => {
    let filtered = [...MOCK_PLAYERS]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (player) =>
          player.firstName.toLowerCase().includes(query) ||
          player.lastName.toLowerCase().includes(query) ||
          player.jerseyNumber.toString().includes(query),
      )
    }

    // Team filter
    if (selectedTeam !== "all") {
      filtered = filtered.filter((player) => player.teamId === selectedTeam)
    }

    // Position filter
    if (selectedPosition !== "all") {
      filtered = filtered.filter((player) => player.position === selectedPosition)
    }

    return filtered
  }, [searchQuery, selectedTeam, selectedPosition])

  const positions = useMemo(() => {
    const positionSet = new Set(MOCK_PLAYERS.map((p) => p.position))
    return Array.from(positionSet).sort()
  }, [])

  return {
    searchQuery,
    setSearchQuery,
    selectedTeam,
    setSelectedTeam,
    selectedPosition,
    setSelectedPosition,
    filteredPlayers,
    positions,
  }
}
