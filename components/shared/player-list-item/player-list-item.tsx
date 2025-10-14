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
import { usePlayerActions } from "@/hooks/use-player-actions"
import { useState } from "react"
import { PLAYER_LIST_ITEM_TEXTS } from "./_constants/player-list-item"

interface PlayerListItemProps {
  player: Player
}

export function PlayerListItem({ player }: PlayerListItemProps) {
  const {
    user,
    playerIsFavorite,
    playerIsExclusive,
    canMarkExclusive,
    handleFavoriteClick,
    handleExclusiveClick,
    showRemoveExclusiveDialog,
    setShowRemoveExclusiveDialog,
    confirmRemoveExclusive,
    cancelRemoveExclusive,
  } = usePlayerActions({ 
    playerId: player.id, 
    showConfirmationDialogs: false 
  })

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
          "group overflow-hidden transition-all duration-200 h-full",
          "hover:shadow-elevation-3 hover:border-primary"
        )}>
          <CardContent className="p-0 h-full">
            <div className="flex items-start gap-4 p-4 h-full min-h-[140px]">
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
        open={showRemoveExclusiveDialog}
        onOpenChange={setShowRemoveExclusiveDialog}
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
