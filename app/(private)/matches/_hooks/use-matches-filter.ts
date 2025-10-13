"use client"

import { useState, useMemo } from "react"
import { MOCK_MATCHES, getTeamById } from "@/lib/mock-data"

export function useMatchesFilter() {
  const [selectedGroup, setSelectedGroup] = useState<string>("all")

  const filteredMatches = useMemo(() => {
    let filtered = [...MOCK_MATCHES]

    if (selectedGroup !== "all") {
      filtered = filtered.filter((match) => {
        const homeTeam = getTeamById(match.homeTeamId)
        const awayTeam = getTeamById(match.awayTeamId)
        return homeTeam?.group === selectedGroup || awayTeam?.group === selectedGroup
      })
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)
      return dateB.getTime() - dateA.getTime()
    })

    return filtered
  }, [selectedGroup])

  return {
    selectedGroup,
    setSelectedGroup,
    filteredMatches,
  }
}
