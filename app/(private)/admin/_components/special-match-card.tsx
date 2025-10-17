"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ExternalLink } from "lucide-react"
import type { SpecialMatchWithTeams } from "@/lib/types/special-matches.types"
import { formatDateForDisplay } from "@/lib/utils/date-utils"

interface SpecialMatchCardProps {
  match: SpecialMatchWithTeams
  onEdit: (match: SpecialMatchWithTeams) => void
  onDelete: (match: SpecialMatchWithTeams) => void
}

export function SpecialMatchCard({ match, onEdit, onDelete }: SpecialMatchCardProps) {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {match.match_type}
            </Badge>
          </div>
          
          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(match)}>
                Edit Match
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(match)}
                className="text-red-600 focus:text-red-600"
              >
                Delete Match
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium">
            {formatDateForDisplay(match.match_date)}
          </span>
          <span className="font-mono">
            {formatTime(match.match_time)}
          </span>
        </div>

        {/* Teams */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {match.home_team ? (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{match.home_team.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {match.home_team.team_code}
                  </Badge>
                </div>
              ) : (
                <span className="text-muted-foreground italic">
                  {match.home_team_display || "TBD"}
                </span>
              )}
            </div>
            <span className="text-muted-foreground mx-2">vs</span>
            <div className="flex-1 text-right">
              {match.away_team ? (
                <div className="flex items-center justify-end gap-2">
                  <Badge variant="outline" className="text-xs">
                    {match.away_team.team_code}
                  </Badge>
                  <span className="font-medium">{match.away_team.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground italic">
                  {match.away_team_display || "TBD"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Video Link */}
        {match.video_url && (
          <div className="pt-2 border-t">
            <a 
              href={match.video_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Watch Video
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
