"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Calendar, Video, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { MATCHES_TEXTS } from "../_constants/matches"
import type { MatchCardData } from "../_hooks/use-matches-supabase"

interface MatchCardProps {
  match: MatchCardData
}

// Helper component for team logo
function TeamLogo({ team, className }: { team: any; className?: string }) {
  if (team?.logoUrl) {
    return (
      <div className={cn("relative overflow-hidden rounded-lg", className)}>
        <Image
          src={team.logoUrl}
          alt={MATCHES_TEXTS.ALT_TEXTS.TEAM_LOGO(team.name)}
          width={48}
          height={48}
          className="h-full w-full object-contain"
        />
      </div>
    )
  }
  
  return (
    <div className={cn("flex items-center justify-center rounded-lg bg-primary/10", className)}>
      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
    </div>
  )
}

export function MatchCard({ match }: MatchCardProps) {
  const homeTeam = match.homeTeam
  const awayTeam = match.awayTeam

  const matchDate = new Date(match.date)
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // Use the group from the match data
  const group = match.group
  const groupColors = {
    A: "bg-blue-100 text-blue-800 border-blue-200",
    B: "bg-green-100 text-green-800 border-green-200",
  }

  const groupLabels = {
    A: MATCHES_TEXTS.MATCH_CARD.GROUPS.A,
    B: MATCHES_TEXTS.MATCH_CARD.GROUPS.B,
  }

  return (
    <Card className="group bg-white border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden h-full">
      <CardContent className="p-4 sm:p-6 h-full">
        <div className="space-y-4 h-full flex flex-col">
          {/* Header - Group and Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-shrink-0">
            <Badge className={cn("font-medium w-fit border", groupColors[group as keyof typeof groupColors])}>
              {groupLabels[group as keyof typeof groupLabels]}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{formattedDate}</span>
              <span>•</span>
              <span className="font-mono">{match.time}</span>
            </div>
          </div>

          {/* Teams - Responsive Layout */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4 flex-1">
            {/* Home Team */}
            <Link href={`/teams/${homeTeam.id}`} className="block group/team flex-1 min-w-0">
              <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-primary/5">
                <div className="h-10 w-10 sm:h-12 sm:w-12 group-hover/team:scale-105 transition-transform flex-shrink-0">
                  <TeamLogo team={homeTeam} className="h-full w-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate group-hover/team:text-primary transition-colors text-sm sm:text-base">{homeTeam.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{MATCHES_TEXTS.MATCH_CARD.TEAM_LABELS.HOME}</p>
                </div>
              </div>
            </Link>

            {/* VS - Only show on desktop */}
            <div className="hidden sm:flex items-center justify-center px-4 flex-shrink-0">
              <div className="text-xl font-semibold text-muted-foreground">VS</div>
            </div>

            {/* Away Team */}
            <Link href={`/teams/${awayTeam.id}`} className="block group/team flex-1 min-w-0">
              <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-primary/5">
                <div className="h-10 w-10 sm:h-12 sm:w-12 group-hover/team:scale-105 transition-transform flex-shrink-0">
                  <TeamLogo team={awayTeam} className="h-full w-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate group-hover/team:text-primary transition-colors text-sm sm:text-base">{awayTeam.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{MATCHES_TEXTS.MATCH_CARD.TEAM_LABELS.AWAY}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Video Button - Open video in new tab */}
          <div className="flex-shrink-0">
            {match.videoUrl ? (
              <Button 
                className="w-full gap-2 bg-primary hover:bg-primary/90"
                onClick={() => window.open(match.videoUrl, '_blank', 'noopener,noreferrer')}
              >
                <Play className="h-4 w-4" />
                {MATCHES_TEXTS.MATCH_CARD.BUTTONS.WATCH_VIDEO}
              </Button>
            ) : (
              <Button variant="outline" className="w-full gap-2 bg-transparent" disabled>
                <Video className="h-4 w-4" />
                {MATCHES_TEXTS.MATCH_CARD.BUTTONS.VIDEO_NOT_AVAILABLE}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
