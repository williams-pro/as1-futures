"use client"

import { PageContent } from "@/components/layout/page-content"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Users, Star } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PlayerListItem } from "./_components/player-list-item"
import { useTeamDetail } from "./_hooks/use-team-detail"

interface TeamDetailPageProps {
  params: {
    teamId: string
  }
}

export default function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { team, players } = useTeamDetail(params.teamId)

  if (!team) {
    notFound()
  }

  return (
    <PageContent>
      <div className="space-y-8">
        {/* Header Navigation */}
        <div>
          <Link href="/teams">
            <Button variant="ghost" className="gap-2 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Teams
            </Button>
          </Link>
        </div>

        {/* Team Header */}
        <div className="flex items-start gap-6">
          {/* Logo Circular */}
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-50 to-slate-100/80 border-2 border-as1-gold/20 shadow-sm">
              {team.logoUrl ? (
                <img
                  src={team.logoUrl}
                  alt={`${team.name} logo`}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <Shield className="h-10 w-10 text-slate-400/70" />
              )}
            </div>
          </div>

          {/* Team Info */}
          <div className="flex-1 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 bg-slate-100/60 px-3 py-1.5 rounded-full border border-border/20">
                  <div className="w-1.5 h-1.5 bg-as1-gold rounded-full" />
                  <span className="text-sm font-medium text-slate-700">Group {team.group}</span>
                </div>
                
                {/* Player Count - Solo una vez */}
                <div className="flex items-center gap-1.5 bg-slate-100/50 px-3 py-1.5 rounded-full border border-border/20">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {players.length} {players.length === 1 ? "player" : "players"}
                  </span>
                </div>
              </div>
              
              <h1 className="text-4xl font-light text-foreground tracking-tight text-balance">
                {team.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

        {/* Players Section - Sin redundancia */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-light text-foreground tracking-tight mb-4">Team Roster</h2>
          </div>

          {players.length > 0 ? (
            <div className="space-y-3">
              {players.map((player) => (
                <PlayerListItem key={player.id} player={player} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-slate-100/50 p-6 border border-border/20">
                <Users className="h-12 w-12 text-slate-400/70" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">No players found</h3>
              <p className="text-muted-foreground max-w-sm">This team doesn't have any players registered yet</p>
            </div>
          )}
        </div>
      </div>
    </PageContent>
  )
}
