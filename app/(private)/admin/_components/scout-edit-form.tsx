"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, X, AlertCircle } from 'lucide-react'
import { updateScout } from '@/app/actions/admin/scouts/update-scout'
import { logger } from '@/lib/logger'
import { useToast } from '@/hooks/use-toast'

const UpdateScoutSchema = z.object({
  id: z.string().uuid('Invalid scout ID'),
  first_name: z.string().min(2, 'First name must be at least 2 characters').optional(),
  last_name: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  role: z.enum(['scout', 'admin']).optional(),
  is_active: z.boolean().optional(),
  pin: z.string().min(4, 'PIN must be at least 4 digits').max(4, 'PIN must be exactly 4 digits').regex(/^\d{4}$/, 'PIN must contain only numbers').optional()
})

type UpdateScoutFormData = z.infer<typeof UpdateScoutSchema>

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

interface ScoutEditFormProps {
  scout: AdminScout
  onSuccess: () => void
  onCancel: () => void
}

export function ScoutEditForm({ scout, onSuccess, onCancel }: ScoutEditFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<UpdateScoutFormData>({
    resolver: zodResolver(UpdateScoutSchema),
    defaultValues: {
      id: scout.id,
      first_name: scout.first_name,
      last_name: scout.last_name,
      role: scout.role,
      is_active: scout.is_active,
      pin: ''
    }
  })

  const selectedRole = watch('role')
  const isActive = watch('is_active')

  const onSubmit = async (data: UpdateScoutFormData) => {
    try {
      setLoading(true)
      
      const formData = new FormData()
      formData.append('id', data.id)
      
      // Solo agregar campos que han cambiado
      if (data.first_name !== undefined) formData.append('first_name', data.first_name)
      if (data.last_name !== undefined) formData.append('last_name', data.last_name)
      if (data.role !== undefined) formData.append('role', data.role)
      if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString())
      if (data.pin && data.pin.trim() !== '') formData.append('pin', data.pin)

      const result = await updateScout(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Scout updated successfully",
        })
        onSuccess()
      } else {
        // Mostrar errores de validación específicos
        if (result.errors) {
          const errorMessages = Object.entries(result.errors)
            .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
            .join('; ')
          toast({
            title: "Validation Error",
            description: errorMessages,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update scout",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      logger.error('SCOUT_EDIT_FORM', 'Failed to update scout', { operation: 'SCOUT_EDIT_FORM' }, error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Edit Scout</CardTitle>
            <CardDescription>Update scout information</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email (readonly) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={scout.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            {/* PIN */}
            <div className="space-y-2">
              <Label htmlFor="pin">New PIN (4 digits)</Label>
              <Input
                id="pin"
                {...register('pin')}
                placeholder="Leave empty to keep current PIN"
                maxLength={4}
              />
              {errors.pin && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.pin.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                {...register('first_name')}
                placeholder="John"
              />
              {errors.first_name && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.first_name.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                {...register('last_name')}
                placeholder="Doe"
              />
              {errors.last_name && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.last_name.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => setValue('role', value as 'scout' | 'admin')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scout">Scout</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.role.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Active Status */}
            <div className="space-y-2">
              <Label htmlFor="is_active">Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue('is_active', checked)}
                />
                <Label htmlFor="is_active" className="text-sm">
                  {isActive ? 'Active' : 'Inactive'}
                </Label>
              </div>
              {errors.is_active && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.is_active.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Leave the PIN field empty to keep the current PIN. Only fill it if you want to change it.
              The scout will need to use the new PIN for future logins.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Scout'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

