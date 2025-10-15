"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { deletePlayer } from '@/app/actions/admin/players/delete-player'
import { Player } from '@/lib/types/admin.types'
import { logger } from '@/lib/logger'

interface PlayerActionsProps {
  player: Player
  onEdit: () => void
  onDeleted: () => void
}

export function PlayerActions({ player, onEdit, onDeleted }: PlayerActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      logger.database('PLAYER_ACTIONS', 'Deleting player', undefined, { playerId: player.id })

      const formData = new FormData()
      formData.append('id', player.id)

      const result = await deletePlayer(formData)

      if (result.success) {
        logger.database('PLAYER_ACTIONS', 'Player deleted successfully', undefined, { playerId: player.id })
        toast({
          title: "Success",
          description: `Player "${player.full_name}" deleted successfully`,
        })
        onDeleted()
      } else {
        throw new Error(result.error || 'Delete failed')
      }
    } catch (error) {
      logger.error('PLAYER_ACTIONS', 'Failed to delete player', { playerId: player.id }, error)
      toast({
        title: "Error",
        description: result.error || "Failed to delete player",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem 
              onSelect={(e) => e.preventDefault()}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the player 
                <strong> "{player.full_name}"</strong> and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete Player"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

