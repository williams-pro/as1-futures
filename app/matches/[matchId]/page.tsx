import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { getTeamById, getPlayersByTeam } from "@/lib/mock-data"
import { MOCK_MATCHES } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { VideoPlayer } from "./_components/video-player"
import { cn } from "@/lib/utils"

interface MatchDetailPageProps {
  params: {
    matchId: string
  }
}

export default function MatchDetailPage({ params }: MatchDetailPageProps) {
  const match = MOCK_MATCHES.find((m) => m.id === params.matchId)

  if (!match) {
    notFound()
  }

  const homeTeam = getTeamById(match.homeTeamId)
  const awayTeam = getTeamById(match.awayTeamId)
  const homePlayers = homeTeam ? getPlayersByTeam(homeTeam.id) : []
  const awayPlayers = awayTeam ? getPlayersByTeam(awayTeam.id) : []

  const matchDate = new Date(match.date)
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
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
    live: "Live Now",
    finished: "Final",
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <Link href="/matches">
            <Button variant="ghost" className="gap-2 hover:bg-accent">
              <ArrowLeft className="h-4 w-4" />
              Back to Matches
            </Button>
          </Link>
        </div>

        <div>
          <Badge className={cn("mb-4", statusColors[match.status])}>{statusLabels[match.status]}</Badge>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-6">
            <Link href={`/teams/${homeTeam?.id}`} className="flex-1 text-center md:text-right">
              <div className="inline-flex flex-col items-center md:items-end gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{homeTeam?.name}</h2>
                  <p className="text-sm text-muted-foreground">Home</p>
                </div>
              </div>
            </Link>

            <div className="flex flex-col items-center gap-2">
              {match.score ? (
                <div className="text-5xl font-bold font-mono text-foreground">
                  {match.score.home} - {match.score.away}
                </div>
              ) : (
                <div className="text-3xl font-bold text-muted-foreground">VS</div>
              )}
            </div>

            <Link href={`/teams/${awayTeam?.id}`} className="flex-1 text-center md:text-left">
              <div className="inline-flex flex-col items-center md:items-start gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{awayTeam?.name}</h2>
                  <p className="text-sm text-muted-foreground">Away</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formattedDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{match.time}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{match.venue}</span>
            </div>
          </div>
        </div>

        {match.videoUrl && match.videoProvider && (
          <Card className="border-border bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Match Video</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoPlayer videoUrl={match.videoUrl} videoProvider={match.videoProvider} />
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                {homeTeam?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {homePlayers.map((player) => (
                  <Link key={player.id} href={`/players/${player.id}`}>
                    <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors">
                      <span className="font-mono text-sm font-medium text-muted-foreground w-8">
                        #{player.jerseyNumber}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {player.firstName} {player.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{player.position}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                {awayTeam?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {awayPlayers.map((player) => (
                  <Link key={player.id} href={`/players/${player.id}`}>
                    <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors">
                      <span className="font-mono text-sm font-medium text-muted-foreground w-8">
                        #{player.jerseyNumber}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {player.firstName} {player.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{player.position}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
