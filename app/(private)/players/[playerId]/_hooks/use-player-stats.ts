'use client'

import { useState, useEffect } from 'react'
import { getPlayerStats } from '@/app/actions/players/get-player-stats'
import { PLAYER_STATS_TEXTS } from '../_constants/player-stats'

interface PlayerStat {
  id: string
  category: string
  metric: string
  value_absolute: number
  value_relative: number
  updated_at: string
}

export function usePlayerStats(playerId: string) {
  const [stats, setStats] = useState<PlayerStat[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const result = await getPlayerStats(playerId)

        if (result.success && result.data) {
          setStats(result.data)
        } else {
          setError(result.error || PLAYER_STATS_TEXTS.ERRORS.UNKNOWN_ERROR)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : PLAYER_STATS_TEXTS.ERRORS.UNKNOWN_ERROR)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [playerId])

  return { stats, loading, error }
}