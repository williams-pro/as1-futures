"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MatchesFilterProps {
  selectedGroup: string
  onGroupChange: (value: string) => void
  resultCount: number
}

export function MatchesFilter({ selectedGroup, onGroupChange, resultCount }: MatchesFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Select value={selectedGroup} onValueChange={onGroupChange}>
          <SelectTrigger className="w-[180px] border-silver-white">
            <SelectValue placeholder="All Groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            <SelectItem value="A">Group A</SelectItem>
            <SelectItem value="B">Group B</SelectItem>
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
