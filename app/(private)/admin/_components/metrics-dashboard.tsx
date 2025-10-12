"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, TrendingUp, Users, Star, Gem, Clock } from "lucide-react"
import type { PlayerMetric, TeamMetric, ScoutActivityMetric, GroupType } from "@/lib/types"

interface MetricsDashboardProps {
  playerMetrics: PlayerMetric[]
  teamMetrics: TeamMetric[]
  scoutMetrics: ScoutActivityMetric[]
}

export function MetricsDashboard({ playerMetrics, teamMetrics, scoutMetrics }: MetricsDashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("most-marked")
  const [groupFilter, setGroupFilter] = useState<GroupType | "all">("all")

  const handleExport = (metricType: string) => {
    console.log("[v0] Exporting metric:", metricType)
    // Mock CSV export
    const csvContent = "data:text/csv;charset=utf-8," + "Player,Team,Favorites,Exclusives,Total\n"
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${metricType}-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredPlayerMetrics =
    groupFilter === "all"
      ? playerMetrics
      : playerMetrics.filter((p) => {
          const team = teamMetrics.find((t) => t.teamName === p.teamName)
          return team?.group === groupFilter
        })

  const filteredTeamMetrics = groupFilter === "all" ? teamMetrics : teamMetrics.filter((t) => t.group === groupFilter)

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players Marked</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{playerMetrics.filter((p) => p.totalMarks > 0).length}</div>
            <p className="text-xs text-muted-foreground">
              {playerMetrics.reduce((sum, p) => sum + p.favoritesCount, 0)} favorites total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exclusive Players</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{playerMetrics.filter((p) => p.exclusivesCount > 0).length}</div>
            <p className="text-xs text-muted-foreground">
              {playerMetrics.reduce((sum, p) => sum + p.exclusivesCount, 0)} total marks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scouts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scoutMetrics.length}</div>
            <p className="text-xs text-muted-foreground">
              {scoutMetrics.filter((s) => s.lastLogin).length} logged in recently
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Discovery Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(teamMetrics.reduce((sum, t) => sum + t.discoveryRate, 0) / teamMetrics.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all teams</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most-marked">Most Marked Players</SelectItem>
            <SelectItem value="multiple-scouts">Players with Multiple Scouts</SelectItem>
            <SelectItem value="team-discovery">Team Discovery Rate</SelectItem>
            <SelectItem value="time-on-page">Avg. Time on Player Pages</SelectItem>
            <SelectItem value="scout-activity">Scout Activity Breakdown</SelectItem>
          </SelectContent>
        </Select>

        <Select value={groupFilter} onValueChange={(value) => setGroupFilter(value as GroupType | "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            <SelectItem value="A">Group A</SelectItem>
            <SelectItem value="B">Group B</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={() => handleExport(selectedMetric)} className="ml-auto">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Metric Tables */}
      {selectedMetric === "most-marked" && (
        <Card>
          <CardHeader>
            <CardTitle>Most Marked Players</CardTitle>
            <CardDescription>Players ranked by total favorites and exclusives</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">Favorites</TableHead>
                  <TableHead className="text-center">Exclusives</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayerMetrics
                  .sort((a, b) => b.totalMarks - a.totalMarks)
                  .slice(0, 10)
                  .map((player, index) => (
                    <TableRow key={player.playerId}>
                      <TableCell className="font-medium">#{index + 1}</TableCell>
                      <TableCell>{player.playerName}</TableCell>
                      <TableCell>{player.teamName}</TableCell>
                      <TableCell className="text-center">{player.favoritesCount}</TableCell>
                      <TableCell className="text-center">{player.exclusivesCount}</TableCell>
                      <TableCell className="text-center font-bold">{player.totalMarks}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedMetric === "multiple-scouts" && (
        <Card>
          <CardHeader>
            <CardTitle>Players with Multiple Scouts</CardTitle>
            <CardDescription>Players marked by 2 or more scouts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">Scout Count</TableHead>
                  <TableHead>Scouts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayerMetrics
                  .filter((p) => p.scoutCount >= 2)
                  .sort((a, b) => b.scoutCount - a.scoutCount)
                  .slice(0, 10)
                  .map((player) => (
                    <TableRow key={player.playerId}>
                      <TableCell className="font-medium">{player.playerName}</TableCell>
                      <TableCell>{player.teamName}</TableCell>
                      <TableCell className="text-center font-bold">{player.scoutCount}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {player.scouts?.join(", ") || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedMetric === "team-discovery" && (
        <Card>
          <CardHeader>
            <CardTitle>Team Discovery Rate</CardTitle>
            <CardDescription>Percentage of team players marked by scouts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead className="text-center">Total Players</TableHead>
                  <TableHead className="text-center">Marked Players</TableHead>
                  <TableHead className="text-center">Discovery Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeamMetrics
                  .sort((a, b) => b.discoveryRate - a.discoveryRate)
                  .map((team, index) => (
                    <TableRow key={team.teamId}>
                      <TableCell className="font-medium">#{index + 1}</TableCell>
                      <TableCell>{team.teamName}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          Group {team.group}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{team.totalPlayers}</TableCell>
                      <TableCell className="text-center">{team.markedPlayers}</TableCell>
                      <TableCell className="text-center font-bold">{team.discoveryRate.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedMetric === "time-on-page" && (
        <Card>
          <CardHeader>
            <CardTitle>Average Time on Player Pages</CardTitle>
            <CardDescription>Players with highest average viewing time</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">Avg. Time</TableHead>
                  <TableHead className="text-center">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayerMetrics
                  .filter((p) => p.avgTimeOnPage)
                  .sort((a, b) => (b.avgTimeOnPage || 0) - (a.avgTimeOnPage || 0))
                  .slice(0, 10)
                  .map((player, index) => (
                    <TableRow key={player.playerId}>
                      <TableCell className="font-medium">#{index + 1}</TableCell>
                      <TableCell>{player.playerName}</TableCell>
                      <TableCell>{player.teamName}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono">{player.avgTimeOnPage}s</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{player.scoutCount}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedMetric === "scout-activity" && (
        <Card>
          <CardHeader>
            <CardTitle>Scout Activity Breakdown</CardTitle>
            <CardDescription>Detailed activity metrics per scout</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scout</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Logins</TableHead>
                  <TableHead className="text-center">Players Viewed</TableHead>
                  <TableHead className="text-center">Favorites</TableHead>
                  <TableHead className="text-center">Exclusives</TableHead>
                  <TableHead className="text-center">Time on Platform</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scoutMetrics
                  .sort((a, b) => b.timeOnPlatform - a.timeOnPlatform)
                  .map((scout) => (
                    <TableRow key={scout.scoutId}>
                      <TableCell className="font-medium">{scout.scoutName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{scout.email}</TableCell>
                      <TableCell className="text-center">{scout.loginCount}</TableCell>
                      <TableCell className="text-center">{scout.playersViewed}</TableCell>
                      <TableCell className="text-center">{scout.favoritesAdded}</TableCell>
                      <TableCell className="text-center">{scout.exclusivesAdded}</TableCell>
                      <TableCell className="text-center font-mono">{scout.timeOnPlatform}h</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
