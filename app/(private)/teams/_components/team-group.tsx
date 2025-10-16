"use client"

import type { GroupType } from "@/lib/types"
import { TeamCard } from "./team-card"
import { useTeamsData } from "../_hooks/use-teams-data"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"

interface TeamGroupProps {
  group: GroupType | 'all'
}

export function TeamGroup({ group }: TeamGroupProps) {
  const { teams, loading, error } = useTeamsData(group)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Group {group}</h2>
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm text-muted-foreground">Loading teams...</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mx-auto">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="min-w-[280px] flex-1 max-w-[320px]">
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Group {group}</h2>
            <p className="text-sm text-muted-foreground">Error loading teams</p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load teams: {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Si es 'all', agrupar equipos por grupo
  if (group === 'all') {
    const groupedTeams = teams.reduce((acc, team) => {
      const groupCode = team.groupInfo?.code || 'Unknown'
      if (!acc[groupCode]) {
        acc[groupCode] = []
      }
      acc[groupCode].push(team)
      return acc
    }, {} as Record<string, typeof teams>)

    return (
      <div className="space-y-8">
        {Object.entries(groupedTeams).map(([groupCode, groupTeams], index) => (
          <div key={groupCode} className="space-y-6">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Group {groupCode}</h2>
                <p className="text-sm text-muted-foreground">{groupTeams.length} teams</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mx-auto">
              {groupTeams.map((team) => (
                <div key={team.id} className="min-w-[400px] flex-1 max-w-[450px]">
                  <TeamCard team={team} />
                </div>
              ))}
            </div>

            {index < Object.keys(groupedTeams).length - 1 && (
              <div className="h-px bg-gradient-to-r from-transparent via-border/20 to-transparent" />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Group {group}</h2>
          <p className="text-sm text-muted-foreground">{teams.length} teams</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mx-auto">
        {teams.map((team) => (
          <div key={team.id} className="min-w-[280px] flex-1 max-w-[320px]">
            <TeamCard team={team} />
          </div>
        ))}
      </div>
    </div>
  )
}
