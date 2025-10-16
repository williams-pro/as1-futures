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
import { deleteTeam } from '@/app/actions/admin/teams/delete-team'
import { Team } from '@/lib/types/admin.types'
import { logger } from '@/lib/logger'

interface TeamActionsProps {
  team: Team
  onEdit: () => void
  onDeleted: () => void
}

export function TeamActions({ team, onEdit, onDeleted }: TeamActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      logger.database('TEAM_ACTIONS', 'Deleting team', team.id)

      const formData = new FormData()
      formData.append('id', team.id)

      const result = await deleteTeam(formData)

      if (result.success) {
        logger.database('TEAM_ACTIONS', 'Team deleted successfully', team.id)
        toast({
          title: "Success",
          description: `Team "${team.name}" deleted successfully`,
        })
        onDeleted()
      } else {
        throw new Error(result.error || 'Delete failed')
      }
    } catch (error) {
      logger.error('Failed to delete team', { operation: 'TEAM_ACTIONS', metadata: { teamId: team.id } }, error as Error)
      toast({
        title: "Error",
        description: "Failed to delete team",
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
                This action cannot be undone. This will permanently delete the team 
                <strong> "{team.name}"</strong> and all associated players, matches, and data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete Team"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}



