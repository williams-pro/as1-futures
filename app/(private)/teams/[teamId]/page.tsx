"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { useTeamDetail } from "./_hooks/use-team-detail"
import { TeamHeader, TeamPlayersSection, TeamNavigation } from "./_components"

interface TeamDetailPageProps {
  params: Promise<{
    teamId: string
  }>
}

export default function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { teamId } = use(params)
  const { team, players } = useTeamDetail(teamId)

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
