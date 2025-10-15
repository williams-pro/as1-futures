"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Users, Star, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TeamCardData } from "../_hooks/use-teams-data"
import { TEAM_CARD_TEXTS } from "../_constants"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface TeamCardProps {
  team: TeamCardData
}

// Componente para el botón con loading state
function TeamCardButton({ team, className }: { team: TeamCardData; className?: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular un pequeño delay para mostrar el loading
    await new Promise(resolve => setTimeout(resolve, 300))
    
    router.push(`/teams/${team.id}`)
  }

  return (
    <Button 
      onClick={handleClick}
      className={cn(
        "w-full h-10 bg-gradient-to-r from-as1-charcoal to-as1-charcoal/90",
        "hover:from-as1-charcoal/90 hover:to-as1-charcoal text-white text-sm font-medium",
        "rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group/btn",
        "disabled:opacity-70 disabled:cursor-not-allowed",
        className
      )}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {TEAM_CARD_TEXTS.UI.LOADING}
        </>
      ) : (
        <span>{TEAM_CARD_TEXTS.UI.VIEW_PLAYERS}</span>
      )}
    </Button>
  )
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className={cn(
      "group h-full bg-white/60 backdrop-blur-sm border border-border/50",
      "hover:border-as1-gold/40 hover:shadow-lg transition-all duration-300",
      "rounded-xl overflow-hidden"
    )}>
      <CardContent className={cn("p-5 flex flex-col h-full space-y-4")}>
        {/* Logo Container Circular */}
        <div className="relative mx-auto">
          {team.logoUrl ? (
            <div className="relative h-20 w-20 rounded-full overflow-hidden">
              <Image
                src={team.logoUrl}
                alt={TEAM_CARD_TEXTS.ALT_TEXTS.TEAM_LOGO(team.name)}
                width={80}
                height={80}
                className="h-full w-full object-cover"
                style={{ 
                  filter: TEAM_CARD_TEXTS.STYLES.IMAGE_FILTER
                }}
              />
            </div>
          ) : (
            <div className={cn(
              "relative h-20 w-20 rounded-full bg-gradient-to-br from-slate-50 to-slate-100/80",
              "border border-border/30 group-hover:border-as1-gold/20 transition-all duration-300",
              "overflow-hidden shadow-sm flex items-center justify-center"
            )}>
              <Shield className="h-8 w-8 text-slate-400/70" />
            </div>
          )}
        </div>

        {/* Team Name y Grupo */}
        <div className="text-center space-y-3">
          <div className="space-y-2">
            <h3 className={cn(
              "text-lg font-semibold text-foreground leading-tight text-balance line-clamp-2"
            )}>
              {team.name}
            </h3>
            
            {/* Grupo */}
            <div className="flex items-center justify-center">
              <div className={cn(
                "inline-flex items-center gap-1.5 bg-slate-100/60 px-2.5 py-1 rounded-full"
              )}>
                <div className="w-1.5 h-1.5 bg-as1-gold rounded-full" />
                <span className="text-xs font-medium text-slate-700">
                  {TEAM_CARD_TEXTS.UI.GROUP_PREFIX} {team.group}
                </span>
              </div>
            </div>
          </div>

          {/* Player Count */}
          <div className={cn("flex items-center justify-center gap-2 text-sm text-muted-foreground")}>
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium">{team.playerCount}</span>
            <span className="text-xs text-slate-500">{TEAM_CARD_TEXTS.UI.PLAYERS_LABEL}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <TeamCardButton team={team} />
        </div>
      </CardContent>
    </Card>
  )
}

// Versión compacta horizontal con logo circular
export function TeamCardCompact({ team }: TeamCardProps) {
  return (
    <Card className={cn(
      "group h-full bg-white/70 backdrop-blur-sm border border-border/40",
      "hover:border-as1-gold/30 hover:shadow-md transition-all duration-300",
      "rounded-xl overflow-hidden"
    )}>
      <CardContent className={cn("p-4 flex flex-col h-full space-y-3")}>
        <div className="flex items-start gap-3">
          {/* Logo Container circular más pequeño */}
          <div className="relative flex-shrink-0">
            <div className={cn(
              "relative h-12 w-12 rounded-full bg-gradient-to-br from-slate-50 to-slate-100/90",
              "border border-border/30 overflow-hidden shadow-sm"
            )}>
              {team.logoUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={team.logoUrl || TEAM_CARD_TEXTS.ALT_TEXTS.PLACEHOLDER_LOGO}
                    alt={TEAM_CARD_TEXTS.ALT_TEXTS.TEAM_LOGO(team.name)}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    style={{ 
                      filter: TEAM_CARD_TEXTS.STYLES.IMAGE_FILTER
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
                <div className={cn(
                  "w-4 h-4 bg-gradient-to-r from-as1-gold to-as1-gold/90 rounded-full",
                  "flex items-center justify-center shadow-lg"
                )}>
                  <Star className="h-2 w-2 text-white fill-white" />
                </div>
              </div>
            )}
          </div>

          {/* Contenido de texto */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div>
              <h3 className={cn(
                "text-sm font-semibold text-foreground leading-tight text-balance line-clamp-2"
              )}>
                {team.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <div className="w-1.5 h-1.5 bg-as1-gold rounded-full" />
                  <span>{TEAM_CARD_TEXTS.UI.GROUP_PREFIX} {team.group}</span>
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
              className={cn(
                "w-full h-8 border-border/40 hover:border-as1-gold/40 hover:bg-as1-gold/5",
                "text-foreground hover:text-as1-gold text-xs font-medium rounded-md",
                "transition-all duration-300"
              )}
            >
              {TEAM_CARD_TEXTS.UI.VIEW_TEAM}
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
    <Card className={cn(
      "group h-full bg-white/60 backdrop-blur-sm border border-border/50",
      "hover:border-as1-gold/40 hover:shadow-lg transition-all duration-300",
      "rounded-xl overflow-hidden"
    )}>
      <CardContent className={cn("p-5 flex flex-col h-full space-y-4")}>
        {/* Logo Container Circular con borde dorado sutil */}
        <div className="relative mx-auto">
          <div className={cn(
            "relative h-20 w-20 rounded-full bg-gradient-to-br from-slate-50 to-slate-100/80",
            "border-2 border-as1-gold/20 group-hover:border-as1-gold/40 transition-all duration-300",
            "overflow-hidden shadow-sm"
          )}>
            {team.logoUrl ? (
              <div className="relative h-full w-full">
                <Image
                  src={team.logoUrl || TEAM_CARD_TEXTS.ALT_TEXTS.PLACEHOLDER_LOGO}
                  alt={TEAM_CARD_TEXTS.ALT_TEXTS.TEAM_LOGO(team.name)}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  style={{ 
                    filter: TEAM_CARD_TEXTS.STYLES.IMAGE_FILTER
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
              <div className={cn(
                "flex items-center gap-1 bg-gradient-to-r from-as1-gold to-as1-gold/90",
                "text-white px-2 py-1 rounded-full shadow-lg"
              )}>
                <Star className="h-2.5 w-2.5 fill-white" />
                <span className="text-xs font-semibold">{TEAM_CARD_TEXTS.UI.AS1_LABEL}</span>
              </div>
            </div>
          )}
        </div>

        {/* Resto del contenido igual */}
        <div className="text-center space-y-3">
          <div className="space-y-2">
            <h3 className={cn(
              "text-lg font-semibold text-foreground leading-tight text-balance line-clamp-2"
            )}>
              {team.name}
            </h3>
            <div className="flex items-center justify-center">
              <div className={cn(
                "inline-flex items-center gap-1.5 bg-slate-100/60 px-2.5 py-1 rounded-full"
              )}>
                <div className="w-1.5 h-1.5 bg-as1-gold rounded-full" />
                <span className="text-xs font-medium text-slate-700">
                  {TEAM_CARD_TEXTS.UI.GROUP_PREFIX} {team.group}
                </span>
              </div>
            </div>
          </div>

          <div className={cn("flex items-center justify-center gap-2 text-sm text-muted-foreground")}>
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium">{team.playerCount}</span>
            <span className="text-xs text-slate-500">{TEAM_CARD_TEXTS.UI.PLAYERS_LABEL}</span>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <TeamCardButton team={team} />
        </div>
      </CardContent>
    </Card>
  )
}
