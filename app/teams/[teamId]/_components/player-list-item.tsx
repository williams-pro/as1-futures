"use client"

import type React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlayerActionButton } from "@/components/shared/player-action-button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Gem } from "lucide-react"
import type { Player } from "@/lib/types"
import { useFavorites } from "@/contexts/favorites-context"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

interface PlayerListItemProps {
  player: Player
}

export function PlayerListItem({ player }: PlayerListItemProps) {
  const { user } = useAuth()
  const { isFavorite, isExclusive, toggleFavorite, toggleExclusive, canAddExclusive, exclusiveCount } = useFavorites()

  const [showExclusiveModal, setShowExclusiveModal] = useState(false)

  const playerIsFavorite = isFavorite(player.id)
  const playerIsExclusive = isExclusive(player.id)
  const canMarkExclusive = canAddExclusive() || playerIsExclusive

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (playerIsExclusive && playerIsFavorite) {
      return
    }
    if (user) {
      toggleFavorite(player.id, user.id)
    }
  }

  const handleExclusiveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (user && canMarkExclusive) {
      if (playerIsExclusive) {
        // Mostrar modal de confirmación para remover exclusivo
        setShowExclusiveModal(true)
      } else {
        toggleExclusive(player.id, user.id)
      }
    }
  }

  const confirmRemoveExclusive = () => {
    if (user) {
      toggleExclusive(player.id, user.id)
      setShowExclusiveModal(false)
    }
  }

  const cancelRemoveExclusive = () => {
    setShowExclusiveModal(false)
  }

  const initials = `${player.firstName[0]}${player.lastName[0]}`

  return (
    <>
      <Link href={`/players/${player.id}`} className="block max-w-2xl mx-auto">
        <Card className="group bg-white/50 backdrop-blur-sm border border-border/40 hover:border-as1-gold/30 hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              {/* Avatar Compacto */}
              <Avatar className="h-12 w-12 rounded-lg border border-border/30 group-hover:border-as1-gold/20 transition-colors duration-300 flex-shrink-0">
                {player.photoUrl ? (
                  <AvatarImage
                    src={player.photoUrl || "/placeholder.svg"}
                    alt={`${player.firstName} ${player.lastName}`}
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-slate-100/80 text-slate-600 font-medium text-xs rounded-lg">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Player Info - Ultra Compacto */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <h3 className="font-semibold text-foreground text-sm truncate leading-tight">
                  {player.firstName} {player.lastName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono font-medium bg-slate-100/50 px-1.5 py-0.5 rounded">
                    #{player.jerseyNumber}
                  </span>
                  <span className="truncate">{player.position}</span>
                </div>
              </div>

              {/* Action Buttons con Tooltip */}
              {user?.role === "scout" && (
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {/* Botón Favorito */}
                  <PlayerActionButton
                    type="favorite"
                    isActive={playerIsFavorite}
                    isDisabled={playerIsExclusive && playerIsFavorite}
                    onClick={handleFavoriteClick}
                    tooltipContent={
                      <p className="text-xs max-w-[200px]">
                        {playerIsExclusive && playerIsFavorite
                          ? "Cannot remove favorite while exclusive. Remove exclusive status first."
                          : playerIsFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"}
                      </p>
                    }
                  />

                  {/* Botón Exclusivo */}
                  <PlayerActionButton
                    type="exclusive"
                    isActive={playerIsExclusive}
                    isDisabled={!canMarkExclusive}
                    onClick={handleExclusiveClick}
                    tooltipContent={
                      !canMarkExclusive && !playerIsExclusive ? (
                        <div className="text-xs max-w-[200px] text-center">
                          <p className="font-semibold">Límite alcanzado</p>
                          <p>Ya tienes {exclusiveCount}/3 jugadores exclusivos</p>
                          <p className="text-muted-foreground mt-1">Remueve uno para agregar otro</p>
                        </div>
                      ) : playerIsExclusive ? (
                        <p className="text-xs">Remover de exclusivos</p>
                      ) : (
                        <p className="text-xs">Marcar como exclusivo</p>
                      )
                    }
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Modal de Confirmación para Remover Exclusivo */}
      <AlertDialog open={showExclusiveModal} onOpenChange={setShowExclusiveModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Gem className="h-5 w-5 text-purple-600" />
              Remover Jugador Exclusivo
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres remover a{" "}
              <strong>
                {player.firstName} {player.lastName}
              </strong>{" "}
              de tus jugadores exclusivos?
              <br />
              <br />
              Esta acción liberará un espacio para que puedas marcar otro jugador como exclusivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemoveExclusive}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveExclusive} className="bg-purple-600 hover:bg-purple-700">
              Sí, Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
