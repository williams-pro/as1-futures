"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Calendar, Video, Play } from "lucide-react"
import type { Match } from "@/lib/types"
import { getTeamById } from "@/lib/mock-data"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { MATCHES_TEXTS } from "../_constants/matches"

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const homeTeam = getTeamById(match.homeTeamId)
  const awayTeam = getTeamById(match.awayTeamId)

  const matchDate = new Date(match.date)
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const statusColors = {
    scheduled: "bg-secondary text-secondary-foreground",
    live: "bg-destructive text-destructive-foreground animate-pulse",
    finished: "bg-primary text-primary-foreground",
  }

  const statusLabels = {
    scheduled: MATCHES_TEXTS.MATCH_CARD.STATUS.SCHEDULED,
    live: MATCHES_TEXTS.MATCH_CARD.STATUS.LIVE,
    finished: MATCHES_TEXTS.MATCH_CARD.STATUS.FINISHED,
  }

  return (
    <Card className="group bg-white border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header - Status and Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Badge className={cn("font-medium w-fit", statusColors[match.status])}>{statusLabels[match.status]}</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
              <span>•</span>
              <span className="font-mono">{match.time}</span>
            </div>
          </div>

          {/* Teams - Responsive Layout */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
            {/* Home Team */}
            <Link href={`/teams/${homeTeam?.id}`} className="block group/team">
              <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-primary/5">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 group-hover/team:bg-primary/20 transition-colors">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate group-hover/team:text-primary transition-colors text-sm sm:text-base">{homeTeam?.name}</p>
                  <p className="text-xs text-muted-foreground">{MATCHES_TEXTS.MATCH_CARD.TEAM_LABELS.HOME}</p>
                </div>
              </div>
            </Link>

            {/* VS - Only show on desktop */}
            <div className="hidden sm:flex items-center justify-center px-4">
              <div className="text-xl font-semibold text-muted-foreground">VS</div>
            </div>

            {/* Away Team */}
            <Link href={`/teams/${awayTeam?.id}`} className="block group/team">
              <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-primary/5">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 group-hover/team:bg-primary/20 transition-colors">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate group-hover/team:text-primary transition-colors text-sm sm:text-base">{awayTeam?.name}</p>
                  <p className="text-xs text-muted-foreground">{MATCHES_TEXTS.MATCH_CARD.TEAM_LABELS.AWAY}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Video Button - Show for all states if videoUrl exists */}
          {match.videoUrl ? (
            <Link href={`/matches/${match.id}`}>
              <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                <Play className="h-4 w-4" />
                {MATCHES_TEXTS.MATCH_CARD.BUTTONS.WATCH_VIDEO}
                {match.videoProvider && (
                  <Badge variant="secondary" className="ml-auto">
                    {match.videoProvider.toUpperCase()}
                  </Badge>
                )}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" className="w-full gap-2 bg-transparent" disabled>
              <Video className="h-4 w-4" />
              {MATCHES_TEXTS.MATCH_CARD.BUTTONS.VIDEO_NOT_AVAILABLE}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
