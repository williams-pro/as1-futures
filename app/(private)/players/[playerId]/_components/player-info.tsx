import type { Player, Team } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Ruler, Footprints, Shield, Hash } from "lucide-react"
import { formatDateForDisplay } from "@/lib/utils/date-utils"

interface PlayerInfoCardProps {
  player: Player
  team?: Team
}

export function PlayerInfoCard({ player, team }: PlayerInfoCardProps) {
  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const age = calculateAge(player.birthDate)
  // Formatear para mostrar de manera legible
  const birthDateFormatted = formatDateForDisplay(player.birthDate)

  return (
    <Card className="border-border bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Player Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 1. Equipo y nombre completo */}
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Team & Player</p>
            <p className="font-medium text-foreground">
              {team?.name || "Unknown Team"} - {player.firstName} {player.lastName}
            </p>
          </div>
        </div>

        {/* 2. Posición específica y número de camiseta */}
        <div className="flex items-center gap-3">
          <Hash className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Position & Jersey Number</p>
            <p className="font-medium text-foreground">
              {player.position} - #{player.jerseyNumber}
            </p>
          </div>
        </div>

        {/* 3. Pie dominante y altura exacta */}
        <div className="flex items-center gap-3">
          <Footprints className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Dominant Foot & Height</p>
            <p className="font-medium text-foreground">
              {player.dominantFoot ? player.dominantFoot.charAt(0).toUpperCase() + player.dominantFoot.slice(1) : "Not specified"} foot
              {player.height && ` - ${player.height} cm`}
            </p>
          </div>
        </div>

        {/* 4. Fecha de nacimiento verificada */}
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Verified Date of Birth</p>
            <p className="font-medium text-foreground">
              Born: {birthDateFormatted} ({age} years old)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
