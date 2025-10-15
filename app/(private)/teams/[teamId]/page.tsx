"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { useTeamDetail } from "./_hooks/use-team-detail"
import { TeamHeader, TeamPlayersSection, TeamNavigation } from "./_components"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"

interface TeamDetailPageProps {
  params: Promise<{
    teamId: string
  }>
}

export default function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { teamId } = use(params)
  const { team, players, loading, error } = useTeamDetail(teamId)

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Navigation Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>

        {/* Team Header Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading team details...</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

        {/* Players Section Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        {/* Header Navigation */}
        <TeamNavigation />

        {/* Error State */}
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load team details: {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!team) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Header Navigation */}
      <TeamNavigation />

      {/* Team Header */}
      <TeamHeader team={team} playerCount={players.length} />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

      {/* Players Section */}
      <TeamPlayersSection players={players} />
    </div>
  )
}
