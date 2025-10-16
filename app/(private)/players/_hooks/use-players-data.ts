'use client'

import { useState, useEffect } from 'react'
import { getPlayers } from '@/app/actions/players/get-players'
import { getActiveTournament } from '@/app/actions/tournaments/get-active-tournament'

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

interface UsePlayersDataReturn {
  players: Player[]
  teams: Array<{ id: string; name: string; team_code: string }>
  positions: string[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePlayersData(): UsePlayersDataReturn {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Array<{ id: string; name: string; team_code: string }>>([])
  const [positions, setPositions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get active tournament first
      const tournamentResult = await getActiveTournament()
      if (!tournamentResult.success || !tournamentResult.tournament) {
        throw new Error('No active tournament found')
      }

      // Get players for the active tournament
      const playersResult = await getPlayers({
        tournamentId: tournamentResult.tournament.id,
        limit: 1000, // Get all players for now
        offset: 0
      })

      if (!playersResult.success) {
        throw new Error(playersResult.error || 'Failed to fetch players')
      }

      setPlayers(playersResult.players || [])
      
      // Extract unique teams and positions
      const uniqueTeams = Array.from(
        new Map(
          (playersResult.players || [])
            .map(p => [p.team.id, { id: p.team.id, name: p.team.name, team_code: p.team.team_code }])
        ).values()
      )
      
      const uniquePositions = Array.from(
        new Set((playersResult.players || []).map(p => p.position))
      ).sort()

      setTeams(uniqueTeams)
      setPositions(uniquePositions)

    } catch (err) {
      console.error('Error fetching players data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    players,
    teams,
    positions,
    isLoading,
    error,
    refetch: fetchData
  }
}



