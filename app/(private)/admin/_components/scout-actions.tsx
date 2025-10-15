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
import { deleteScout } from '@/app/actions/admin/scouts/delete-scout'
import { logger } from '@/lib/logger'
import { useToast } from '@/hooks/use-toast'

interface AdminScout {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  role: 'scout' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
  last_login?: string
}

interface ScoutActionsProps {
  scout: AdminScout
  onEdit: () => void
  onDeleted: () => void
}

export function ScoutActions({ scout, onEdit, onDeleted }: ScoutActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      
      const formData = new FormData()
      formData.append('id', scout.id)
      
      const result = await deleteScout(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: `Scout ${scout.full_name} deleted successfully`,
        })
        setShowDeleteDialog(false)
        onDeleted()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete scout",
          variant: "destructive",
        })
      }
    } catch (error) {
      logger.error('SCOUT_ACTIONS', 'Failed to delete scout', { scoutId: scout.id }, error)
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
              This action cannot be undone. This will permanently delete the scout{' '}
              <strong>{scout.full_name}</strong> ({scout.email}) and all their data.
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

