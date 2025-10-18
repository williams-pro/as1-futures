"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTournamentGroups } from "../_hooks/use-tournament-groups"
import { Skeleton } from "@/components/ui/skeleton"

interface MatchesFilterProps {
  selectedGroup: string
  onGroupChange: (value: string) => void
  resultCount: number
}

export function MatchesFilter({ selectedGroup, onGroupChange, resultCount }: MatchesFilterProps) {
  const { groups, loading } = useTournamentGroups()
  

  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-[180px] h-10" />
        </div>
        <Skeleton className="w-24 h-6" />
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Select value={selectedGroup} onValueChange={onGroupChange}>
          <SelectTrigger className="w-[180px] border-silver-white cursor-pointer">
            <SelectValue placeholder="All Groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.code}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center text-sm text-muted-foreground">
        <span className="font-mono font-medium text-foreground">{resultCount}</span>
        <span className="ml-1">{resultCount === 1 ? "match" : "matches"}</span>
      </div>
    </div>
  )
}
