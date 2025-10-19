'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useAppContext } from '@/contexts/app-context'
import { detectDeviceTypeClient } from '@/lib/utils/device-detection'
import { trackPlayerView } from '@/app/actions/analytics/track-player-view'
import { logger } from '@/lib/logger'

const globalTrackingState = new Map<string, {
  hasTracked: boolean
  isSaving: boolean
  cleanupExecuted: boolean
  videoPlayed: boolean
  statsExpanded: boolean
  scrollDepth: number
  hasScrollableContent: boolean
  userDidScroll: boolean
  deviceType: 'mobile' | 'tablet' | 'desktop'
  startTime: number | null
}>()

function getGlobalState(playerId: string) {
  if (!globalTrackingState.has(playerId)) {
    globalTrackingState.set(playerId, {
      hasTracked: false,
      isSaving: false,
      cleanupExecuted: false,
      videoPlayed: false,
      statsExpanded: false,
      scrollDepth: 0,
      hasScrollableContent: false,
      userDidScroll: false,
      deviceType: detectDeviceTypeClient(),
      startTime: null
    })
  }
  return globalTrackingState.get(playerId)!
}

function clearGlobalState(playerId: string) {
  globalTrackingState.delete(playerId)
}

interface PlayerTrackingData {
  playerId: string
  startTime: number
  hasScrolled: boolean
  videoPlayed: boolean
  statsExpanded: boolean
  deviceType: 'mobile' | 'tablet' | 'desktop'
}

interface UsePlayerTrackingOptions {
  playerId: string
  enabled?: boolean
  minDurationSeconds?: number
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
}

interface UsePlayerTrackingReturn {
  markVideoPlayed: () => void
  markStatsExpanded: () => void
  isTracking: boolean
  trackingData: PlayerTrackingData | null
}

export function usePlayerTracking({
  playerId,
  enabled = true,
  minDurationSeconds = 3,
  scrollContainerRef
}: UsePlayerTrackingOptions): UsePlayerTrackingReturn {
  const { tournamentId, sessionId, userId } = useAppContext()
  const [isTracking, setIsTracking] = useState(false)
  const [trackingData, setTrackingData] = useState<PlayerTrackingData | null>(null)

  const startTimeRef = useRef<number | null>(null)
  const hasScrolledRef = useRef<boolean>(false)
  const videoPlayedRef = useRef<boolean>(false)
  const statsExpandedRef = useRef<boolean>(false)
  const deviceTypeRef = useRef<'mobile' | 'tablet' | 'desktop'>('desktop')
  const hasTrackedRef = useRef<boolean>(false)
  const isSavingRef = useRef<boolean>(false)
  const cleanupExecutedRef = useRef<boolean>(false)
  
  const tournamentIdRef = useRef<string | null>(null)
  const sessionIdRef = useRef<string | null>(null)
  const userIdRef = useRef<string | null>(null)
  const isTrackingRef = useRef<boolean>(false)

  tournamentIdRef.current = tournamentId
  sessionIdRef.current = sessionId
  userIdRef.current = userId
  isTrackingRef.current = isTracking

  const markVideoPlayed = useCallback(() => {
    if (!isTrackingRef.current) return
    
    videoPlayedRef.current = true
    const globalState = getGlobalState(playerId)
    globalState.videoPlayed = true
  }, [playerId])

  const markStatsExpanded = useCallback(() => {
    if (!isTrackingRef.current) return
    
    statsExpandedRef.current = true
    const globalState = getGlobalState(playerId)
    globalState.statsExpanded = true
  }, [playerId])

  const saveTrackingData = useCallback(async () => {
    const currentIsTracking = isTrackingRef.current
    const currentTournamentId = tournamentIdRef.current
    const currentSessionId = sessionIdRef.current
    const currentUserId = userIdRef.current

    const globalState = getGlobalState(playerId)

    if (globalState.hasTracked || globalState.isSaving) return

    if (!currentIsTracking || !currentTournamentId || !currentSessionId) return

    if (!startTimeRef.current) return

    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000)
    
    if (durationSeconds < minDurationSeconds) return

    globalState.hasTracked = true
    globalState.isSaving = true
    hasTrackedRef.current = true
    isSavingRef.current = true
    const trackingData: PlayerTrackingData = {
      playerId,
      startTime: startTimeRef.current,
      hasScrolled: globalState.userDidScroll,
      videoPlayed: globalState.videoPlayed,
      statsExpanded: globalState.statsExpanded,
      deviceType: globalState.deviceType
    }

    setTrackingData(trackingData)

    try {
      const trackingPayload = {
        playerId,
        tournamentId: currentTournamentId,
        sessionId: currentSessionId,
        durationSeconds,
        scrollDepthPercentage: globalState.scrollDepth,
        hasScrollableContent: globalState.hasScrollableContent,
        userDidScroll: globalState.userDidScroll,
        videoPlayed: globalState.videoPlayed,
        statsExpanded: globalState.statsExpanded,
        deviceType: globalState.deviceType
      }


      const result = await trackPlayerView(trackingPayload)

      if (!result.success) {
        logger.error('Failed to track player view', {
          operation: 'PLAYER_TRACKING',
          userId: currentUserId || undefined,
          metadata: { playerId, error: result.error }
        })
      }
    } catch (error) {
      logger.error('Error tracking player view', {
        operation: 'PLAYER_TRACKING',
        userId: currentUserId || undefined,
        metadata: { playerId }
      }, error instanceof Error ? error : undefined)
    } finally {
      globalState.isSaving = false
      isSavingRef.current = false
      
      if (globalState.hasTracked) {
        setTimeout(() => {
          clearGlobalState(playerId)
        }, 1000)
      }
    }
  }, [playerId, minDurationSeconds])

  useEffect(() => {
    if (!isTracking) return

    const container = scrollContainerRef?.current || window

    const handleScroll = () => {
      const scrollY = container === window ? window.scrollY : (container as HTMLElement).scrollTop
      const scrollHeight = container === window ? document.documentElement.scrollHeight : (container as HTMLElement).scrollHeight
      const clientHeight = container === window ? window.innerHeight : (container as HTMLElement).clientHeight
      
      const maxScroll = scrollHeight - clientHeight
      
      let scrollDepth = 0
      if (maxScroll > 0) {
        scrollDepth = Math.min(100, Math.max(0, Math.round((scrollY / maxScroll) * 100)))
      }
      
      const hasScrollableContent = scrollHeight > clientHeight
      const userScrolled = scrollY > 0

      const globalState = getGlobalState(playerId)
      
      // Mantener el scroll depth más alto alcanzado
      if (scrollDepth > globalState.scrollDepth) {
        globalState.scrollDepth = scrollDepth
      }
      
      // Mantener hasScrollableContent (se actualiza solo si cambia a true)
      if (hasScrollableContent) {
        globalState.hasScrollableContent = hasScrollableContent
      }
      
      // Una vez que el usuario hace scroll, mantenerlo en true
      if (userScrolled) {
        globalState.userDidScroll = true
      }

      if (!hasScrolledRef.current && userScrolled) {
        hasScrolledRef.current = true
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [isTracking, playerId, scrollContainerRef])

  useEffect(() => {
    return () => {
      const globalState = getGlobalState(playerId)
      
      if (isTrackingRef.current && tournamentIdRef.current && sessionIdRef.current && 
          !globalState.hasTracked && !globalState.isSaving && !globalState.cleanupExecuted) {
        
        globalState.cleanupExecuted = true
        cleanupExecutedRef.current = true
        
        saveTrackingData()
        setIsTracking(false)
      }
    }
  }, [saveTrackingData, playerId])

  useEffect(() => {
    if (enabled && tournamentId && sessionId && userId && !isTracking) {
      startTimeRef.current = Date.now()
      deviceTypeRef.current = detectDeviceTypeClient()
      hasScrolledRef.current = false
      videoPlayedRef.current = false
      statsExpandedRef.current = false
      hasTrackedRef.current = false
      isSavingRef.current = false
      cleanupExecutedRef.current = false

      const globalState = getGlobalState(playerId)
      globalState.videoPlayed = false
      globalState.statsExpanded = false
      globalState.scrollDepth = 0
      globalState.hasScrollableContent = false
      globalState.userDidScroll = false
      globalState.deviceType = deviceTypeRef.current
      globalState.startTime = startTimeRef.current

      setIsTracking(true)
    }
  }, [enabled, tournamentId, sessionId, userId, playerId, isTracking])

  return {
    markVideoPlayed,
    markStatsExpanded,
    isTracking,
    trackingData
  }
}