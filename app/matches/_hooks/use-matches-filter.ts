"use client"

import { useState, useMemo } from "react"
import { MOCK_MATCHES } from "@/lib/mock-data"

export function useMatchesFilter() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredMatches = useMemo(() => {
    let filtered = [...MOCK_MATCHES]

    if (selectedStatus !== "all") {
      filtered = filtered.filter((match) => match.status === selectedStatus)
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)
      return dateB.getTime() - dateA.getTime()
    })

    return filtered
  }, [selectedStatus])

  return {
    selectedStatus,
    setSelectedStatus,
    filteredMatches,
  }
}
