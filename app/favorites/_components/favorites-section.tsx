"use client"

import type React from "react"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { DraggablePlayerCard } from "./draggable-player-card"
import type { Player } from "@/lib/types"
import { Gem, Star, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFavorites } from "@/contexts/favorites-context"

interface FavoritesSectionProps {
  title: string
  icon: "star" | "gem"
  players: Player[]
  canAddExclusive: boolean
  onReorder: (newOrder: Player[]) => void
  onRemove: (playerId: string) => void
  onToggleFavorite: (playerId: string) => void
  onToggleExclusive: (playerId: string) => void
  emptyMessage: string | React.ReactNode
  variant?: "default" | "compact"
}

export function FavoritesSection({
  title,
  icon,
  players,
  canAddExclusive,
  onReorder,
  onRemove,
  onToggleFavorite,
  onToggleExclusive,
  emptyMessage,
  variant = "default",
}: FavoritesSectionProps) {
  const { isFavorite, isExclusive } = useFavorites()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = players.findIndex((p) => p.id === active.id)
      const newIndex = players.findIndex((p) => p.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(players, oldIndex, newIndex)
        onReorder(newOrder)
      }
    }
  }

  const Icon = icon === "gem" ? Gem : Star
  const iconColor = icon === "gem" ? "text-slate-600" : "text-amber-600"

  return (
    <div className="space-y-5">
      {/* Header Simplificado */}
      <div className="flex items-center gap-3">

        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
      </div>

      {/* Lista de Jugadores */}
      {players.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={players.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {players.map((player) => (
                <DraggablePlayerCard
                  key={player.id}
                  player={player}
                  isExclusive={isExclusive(player.id)}
                  isFavorite={isFavorite(player.id)}
                  canAddExclusive={canAddExclusive}
                  onRemove={() => onRemove(player.id)}
                  onToggleFavorite={() => onToggleFavorite(player.id)}
                  onToggleExclusive={() => onToggleExclusive(player.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        /* Empty State Simplificado */
        <div
          className={cn(
            "flex flex-col items-center justify-center py-16 text-center rounded-xl border-2 border-dashed transition-all duration-300",
            icon === "gem" ? "border-purple-200/50" : "border-amber-200/50",
            "bg-white/40 backdrop-blur-sm",
          )}
        >
          {typeof emptyMessage === "string" ? (
            <>
              <div
                className={cn(
                  "h-16 w-16 rounded-xl flex items-center justify-center mb-4",
                  icon === "gem"
                    ? "bg-purple-100/50 border border-purple-200/50"
                    : "bg-amber-100/50 border border-amber-200/50",
                )}
              >
                <Icon className={cn("h-8 w-8", iconColor)} />
              </div>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">{emptyMessage}</p>
            </>
          ) : (
            emptyMessage
          )}
        </div>
      )}

      {/* Footer con información de ayuda */}
      {players.length > 0 && (
        <div className="flex items-center justify-center pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-50/50 px-3 py-1.5 rounded-lg border border-slate-200/50">
            <Users className="h-3 w-3" />
            <span>Drag to reorder your {icon === "gem" ? "exclusive" : "favorite"} players</span>
          </div>
        </div>
      )}
    </div>
  )
}
