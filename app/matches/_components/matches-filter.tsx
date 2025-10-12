"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MatchesFilterProps {
  selectedStatus: string
  onStatusChange: (value: string) => void
  resultCount: number
}

export function MatchesFilter({ selectedStatus, onStatusChange, resultCount }: MatchesFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px] border-silver-white">
            <SelectValue placeholder="All Matches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Matches</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="finished">Finished</SelectItem>
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
