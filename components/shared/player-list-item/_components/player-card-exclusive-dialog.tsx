"use client"

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

interface PlayerCardExclusiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  onCancel: () => void
  playerName: string
  title: string
  description: string
  confirmText: string
  cancelText: string
}

export function PlayerCardExclusiveDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  playerName,
  title,
  description,
  confirmText,
  cancelText,
}: PlayerCardExclusiveDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-as1-purple-600" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="bg-as1-purple-600 hover:bg-as1-purple-700"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
