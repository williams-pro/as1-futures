import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Users, ArrowRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Team } from "@/lib/types"
import { TEAM_CARD_TEXTS } from "../_constants"

interface TeamCardProps {
  team: Team & { playerCount: number }
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className="group h-full bg-white/60 backdrop-blur-sm border border-border/50 hover:border-as1-gold/40 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
      <CardContent className="p-5 flex flex-col h-full space-y-4">
        {/* Logo Container Circular */}
        <div className="relative mx-auto">
          <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-slate-50 to-slate-100/80 border border-border/30 group-hover:border-as1-gold/20 transition-all duration-300 overflow-hidden shadow-sm">
            {team.logoUrl ? (
              <div className="relative h-full w-full">
                <Image
                  src={team.logoUrl || "/placeholder.svg"}
                  alt={`${team.name} logo`}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  style={{ 
                    filter: 'brightness(1.05) contrast(1.1)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-slate-400/70" />
              </div>
            )}
          </div>
        </div>

        {/* Team Name y Grupo */}
        <div className="text-center space-y-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground leading-tight text-balance line-clamp-2">
              {team.name}
            </h3>
            
            {/* Grupo */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-1.5 bg-slate-100/60 px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-as1-gold rounded-full" />
                <span className="text-xs font-medium text-slate-700">Group {team.group}</span>
              </div>
            </div>
          </div>

          {/* Player Count */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium">{team.playerCount}</span>
            <span className="text-xs text-slate-500">players</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <Link href={`/teams/${team.id}`} className="block">
            <Button 
              className="w-full h-10 bg-gradient-to-r from-as1-charcoal to-as1-charcoal/90 hover:from-as1-charcoal/90 hover:to-as1-charcoal text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group/btn"
            >
              <span>View Players</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Versión compacta horizontal con logo circular
export function TeamCardCompact({ team }: TeamCardProps) {
  return (
    <Card className="group h-full bg-white/70 backdrop-blur-sm border border-border/40 hover:border-as1-gold/30 hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden">
      <CardContent className="p-4 flex flex-col h-full space-y-3">
        <div className="flex items-start gap-3">
          {/* Logo Container circular más pequeño */}
          <div className="relative flex-shrink-0">
            <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-slate-50 to-slate-100/90 border border-border/30 overflow-hidden shadow-sm">
              {team.logoUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={team.logoUrl || "/placeholder.svg"}
                    alt={`${team.name} logo`}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    style={{ 
                      filter: 'brightness(1.05) contrast(1.1)'
                    }}
                  />
                </div>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-slate-400/70" />
                </div>
              )}
            </div>
            
            {team.isAS1Team && (
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 bg-gradient-to-r from-as1-gold to-as1-gold/90 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="h-2 w-2 text-white fill-white" />
                </div>
              </div>
            )}
          </div>

          {/* Contenido de texto */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div>
              <h3 className="text-sm font-semibold text-foreground leading-tight text-balance line-clamp-2">
                {team.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <div className="w-1.5 h-1.5 bg-as1-gold rounded-full" />
                  <span>Group {team.group}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{team.playerCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button más compacto */}
        <div className="mt-auto">
          <Link href={`/teams/${team.id}`} className="block">
            <Button 
              variant="outline"
              className="w-full h-8 border-border/40 hover:border-as1-gold/40 hover:bg-as1-gold/5 text-foreground hover:text-as1-gold text-xs font-medium rounded-md transition-all duration-300"
            >
              View Team
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Versión con borde circular dorado sutil para destacar
export function TeamCardPremium({ team }: TeamCardProps) {
  return (
    <Card className="group h-full bg-white/60 backdrop-blur-sm border border-border/50 hover:border-as1-gold/40 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
      <CardContent className="p-5 flex flex-col h-full space-y-4">
        {/* Logo Container Circular con borde dorado sutil */}
        <div className="relative mx-auto">
          <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-slate-50 to-slate-100/80 border-2 border-as1-gold/20 group-hover:border-as1-gold/40 transition-all duration-300 overflow-hidden shadow-sm">
            {team.logoUrl ? (
              <div className="relative h-full w-full">
                <Image
                  src={team.logoUrl || "/placeholder.svg"}
                  alt={`${team.name} logo`}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  style={{ 
                    filter: 'brightness(1.05) contrast(1.1)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-slate-400/70" />
              </div>
            )}
          </div>

          {/* Indicador AS1 Team */}
          {team.isAS1Team && (
            <div className="absolute -bottom-1 -right-1">
              <div className="flex items-center gap-1 bg-gradient-to-r from-as1-gold to-as1-gold/90 text-white px-2 py-1 rounded-full shadow-lg">
                <Star className="h-2.5 w-2.5 fill-white" />
                <span className="text-xs font-semibold">AS1</span>
              </div>
            </div>
          )}
        </div>

        {/* Resto del contenido igual */}
        <div className="text-center space-y-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground leading-tight text-balance line-clamp-2">
              {team.name}
            </h3>
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-1.5 bg-slate-100/60 px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-as1-gold rounded-full" />
                <span className="text-xs font-medium text-slate-700">Group {team.group}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium">{team.playerCount}</span>
            <span className="text-xs text-slate-500">players</span>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <Link href={`/teams/${team.id}`} className="block">
            <Button 
              className="w-full h-10 bg-gradient-to-r from-as1-charcoal to-as1-charcoal/90 hover:from-as1-charcoal/90 hover:to-as1-charcoal text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group/btn"
            >
              <span>View Players</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
