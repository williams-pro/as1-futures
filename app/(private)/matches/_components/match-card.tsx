"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Calendar, MapPin, Video, Play } from "lucide-react"
import type { Match } from "@/lib/types"
import { getTeamById } from "@/lib/mock-data"
import Link from "next/link"
import { cn } from "@/lib/utils"

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
    scheduled: "Scheduled",
    live: "Live",
    finished: "Finished",
  }

  return (
    <Card className="group bg-white border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={cn("font-medium", statusColors[match.status])}>{statusLabels[match.status]}</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
              <span>•</span>
              <span className="font-mono">{match.time}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Link href={`/teams/${homeTeam?.id}`} className="flex-1">
              <div className="flex items-center gap-3 hover:text-primary transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{homeTeam?.name}</p>
                  <p className="text-xs text-muted-foreground">Home</p>
                </div>
              </div>
            </Link>

            <div className="flex items-center justify-center px-4">
              {match.score ? (
                <div className="text-center">
                  <div className="text-3xl font-bold font-mono text-foreground">
                    {match.score.home} - {match.score.away}
                  </div>
                </div>
              ) : (
                <div className="text-xl font-semibold text-muted-foreground">VS</div>
              )}
            </div>

            <Link href={`/teams/${awayTeam?.id}`} className="flex-1">
              <div className="flex items-center gap-3 hover:text-primary transition-colors flex-row-reverse">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="font-semibold text-foreground truncate">{awayTeam?.name}</p>
                  <p className="text-xs text-muted-foreground">Away</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{match.venue}</span>
          </div>

          {match.videoUrl && (
            <Link href={`/matches/${match.id}`}>
              <Button className="w-full gap-2 bg-primary">
                <Play className="h-4 w-4" />
                Watch Video
                {match.videoProvider && (
                  <Badge variant="secondary" className="ml-auto">
                    {match.videoProvider.toUpperCase()}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {match.status === "scheduled" && !match.videoUrl && (
            <Button variant="outline" className="w-full gap-2 bg-transparent" disabled>
              <Video className="h-4 w-4" />
              Video Not Available
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
