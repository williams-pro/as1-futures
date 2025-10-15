"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { deleteMatch } from '@/app/actions/admin/matches/delete-match'
import { logger } from '@/lib/logger'
import { useToast } from '@/hooks/use-toast'

interface AdminMatch {
  id: string
  match_code: string
  tournament: { id: string; name: string; year: number }
  group: { id: string; name: string; code: string }
  home_team: { id: string; name: string; team_code: string; logo_url?: string; is_as1_team: boolean }
  away_team: { id: string; name: string; team_code: string; logo_url?: string; is_as1_team: boolean }
  match_date: string
  match_time: string
  video_url?: string
  created_at: string
  updated_at: string
}

interface MatchActionsProps {
  match: AdminMatch
  onEdit: () => void
  onDeleted: () => void
}

export function MatchActions({ match, onEdit, onDeleted }: MatchActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      
      const formData = new FormData()
      formData.append('id', match.id)
      
      const result = await deleteMatch(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: `Match ${match.match_code} deleted successfully`,
        })
        setShowDeleteDialog(false)
        onDeleted()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete match",
          variant: "destructive",
        })
      }
    } catch (error) {
      logger.error('MATCH_ACTIONS', 'Failed to delete match', { matchId: match.id }, error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
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
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the match{' '}
              <strong>{match.match_code}</strong> between {match.home_team.name} and {match.away_team.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

