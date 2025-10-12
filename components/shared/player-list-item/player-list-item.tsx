"use client"

import type React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PlayerCardActionButtons } from "./_components/player-card-action-buttons"
import { PlayerCardAvatar } from "./_components/player-card-avatar"
import { PlayerCardInfo } from "./_components/player-card-info"
import { PlayerCardExclusiveDialog } from "./_components/player-card-exclusive-dialog"
import { cn } from "@/lib/utils"
import type { Player } from "@/lib/types"
import { useFavorites } from "@/contexts/favorites-context"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { PLAYER_LIST_ITEM_TEXTS } from "./_constants/player-list-item"

interface PlayerListItemProps {
  player: Player
}

export function PlayerListItem({ player }: PlayerListItemProps) {
  const { user } = useAuth()
  const { isFavorite, isExclusive, toggleFavorite, toggleExclusive, canAddExclusive } = useFavorites()

  const [showExclusiveModal, setShowExclusiveModal] = useState(false)

  const playerIsFavorite = isFavorite(player.id)
  const playerIsExclusive = isExclusive(player.id)
  const canMarkExclusive = canAddExclusive() || playerIsExclusive

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Si es exclusivo y favorito, no permitir remover favorito
    if (playerIsExclusive && playerIsFavorite) {
      // Mostrar feedback visual - el botón ya está deshabilitado
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

  // Tooltip texts
  const favoriteTooltip = playerIsExclusive && playerIsFavorite
    ? "Cannot remove from favorites while player is exclusive. Remove exclusive status first."
    : playerIsFavorite
      ? PLAYER_LIST_ITEM_TEXTS.TOOLTIPS.FAVORITE.REMOVE
      : PLAYER_LIST_ITEM_TEXTS.TOOLTIPS.FAVORITE.ADD

  const exclusiveTooltip = !canMarkExclusive && !playerIsExclusive
    ? PLAYER_LIST_ITEM_TEXTS.TOOLTIPS.EXCLUSIVE.LIMIT_REACHED
    : playerIsExclusive
      ? PLAYER_LIST_ITEM_TEXTS.TOOLTIPS.EXCLUSIVE.REMOVE
      : PLAYER_LIST_ITEM_TEXTS.TOOLTIPS.EXCLUSIVE.ADD

  return (
    <TooltipProvider delayDuration={300}>
      <Link 
        href={`/players/${player.id}`} 
        className="block"
        onClick={(e) => {
          // Si se hace click en los botones de acción, no navegar
          const target = e.target as HTMLElement
          if (target.closest('button') || target.closest('[role="button"]')) {
            e.preventDefault()
          }
        }}
      >
        <Card className={cn(
          "group overflow-hidden transition-all duration-200",
          "hover:shadow-elevation-3 hover:border-primary"
        )}>
          <CardContent className="p-0">
            <div className="flex items-start gap-4 p-4">
              {/* Player Avatar */}
              <PlayerCardAvatar
                photoUrl={player.photoUrl}
                firstName={player.firstName}
                lastName={player.lastName}
              />

              {/* Player Info */}
              <PlayerCardInfo
                firstName={player.firstName}
                lastName={player.lastName}
                jerseyNumber={player.jerseyNumber}
                position={player.position}
                teamName="Team"
              >
                {/* Action Buttons */}
                {user?.role === "scout" && (
                  <PlayerCardActionButtons
                    playerId={player.id}
                    playerIsFavorite={playerIsFavorite}
                    playerIsExclusive={playerIsExclusive}
                    canMarkExclusive={canMarkExclusive}
                    onFavoriteClick={handleFavoriteClick}
                    onExclusiveClick={handleExclusiveClick}
                    favoriteTooltip={favoriteTooltip}
                    exclusiveTooltip={exclusiveTooltip}
                  />
                )}
              </PlayerCardInfo>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Modal de Confirmación para Remover Exclusivo */}
      <PlayerCardExclusiveDialog
        open={showExclusiveModal}
        onOpenChange={setShowExclusiveModal}
        onConfirm={confirmRemoveExclusive}
        onCancel={cancelRemoveExclusive}
        playerName={`${player.firstName} ${player.lastName}`}
        title={PLAYER_LIST_ITEM_TEXTS.MODAL.REMOVE_EXCLUSIVE.TITLE}
        description={PLAYER_LIST_ITEM_TEXTS.MODAL.REMOVE_EXCLUSIVE.DESCRIPTION}
        confirmText={PLAYER_LIST_ITEM_TEXTS.MODAL.REMOVE_EXCLUSIVE.CONFIRM}
        cancelText={PLAYER_LIST_ITEM_TEXTS.MODAL.REMOVE_EXCLUSIVE.CANCEL}
      />
    </TooltipProvider>
  )
}
