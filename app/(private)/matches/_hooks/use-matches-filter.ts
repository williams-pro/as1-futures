"use client"

import { useState } from "react"
import { useMatchesSupabase } from "./use-matches-supabase"

export function useMatchesFilter() {
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  
  // Usar el hook de Supabase para obtener los matches
  const { matches, loading, error } = useMatchesSupabase(selectedGroup)

  return {
    selectedGroup,
    setSelectedGroup,
    filteredMatches: matches,
    loading,
    error,
  }
}
