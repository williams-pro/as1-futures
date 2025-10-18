"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  isLoading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/95 border-border/50 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                variant === "destructive" ? "bg-rose-100" : "bg-amber-100"
              }`}
            >
              <AlertTriangle 
                className={`h-5 w-5 ${
                  variant === "destructive" ? "text-rose-600" : "text-amber-600"
                }`} 
              />
            </div>
            <DialogTitle className="text-xl font-semibold text-foreground">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl border-border/50 hover:bg-slate-50"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 h-11 rounded-xl ${
              variant === "destructive"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-as1-charcoal hover:bg-as1-charcoal/90 text-white"
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
