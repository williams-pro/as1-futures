"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Scout } from "@/lib/types"

const scoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
})

type ScoutFormData = z.infer<typeof scoutSchema>

interface AddScoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (scout: Omit<Scout, "id" | "fullName" | "createdAt" | "favoritesCount" | "exclusivesCount">) => void
}

export function AddScoutDialog({ open, onOpenChange, onAdd }: AddScoutDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ScoutFormData>({
    resolver: zodResolver(scoutSchema),
  })

  const onSubmit = (data: ScoutFormData) => {
    onAdd({
      ...data,
      isActive: true,
      lastLogin: undefined,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Scout</DialogTitle>
          <DialogDescription>
            Create a new scout account. They will receive a welcome email with login instructions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" {...register("firstName")} className={errors.firstName ? "border-destructive" : ""} />
            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" {...register("lastName")} className={errors.lastName ? "border-destructive" : ""} />
            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Scout</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
