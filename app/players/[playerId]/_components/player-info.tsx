import type { Player } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Ruler, Footprints } from "lucide-react"

interface PlayerInfoCardProps {
  player: Player
}

export function PlayerInfoCard({ player }: PlayerInfoCardProps) {
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
  const birthDateFormatted = new Date(player.birthDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="border-border bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Player Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p className="font-medium text-foreground">
              {birthDateFormatted} ({age} years old)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Nationality</p>
            <p className="font-medium text-foreground">{player.nationality}</p>
          </div>
        </div>

        {player.height && (
          <div className="flex items-center gap-3">
            <Ruler className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Height</p>
              <p className="font-medium font-mono text-foreground">{player.height} cm</p>
            </div>
          </div>
        )}

        {player.dominantFoot && (
          <div className="flex items-center gap-3">
            <Footprints className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Dominant Foot</p>
              <p className="font-medium text-foreground capitalize">{player.dominantFoot}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
