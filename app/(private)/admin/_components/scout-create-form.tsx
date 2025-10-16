"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, X, AlertCircle } from 'lucide-react'
import { createScout } from '@/app/actions/admin/scouts/create-scout'
import { logger } from '@/lib/logger'
import { useToast } from '@/hooks/use-toast'

const CreateScoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.enum(['scout', 'admin']).default('scout'),
  pin: z.string().min(4, 'PIN must be at least 4 digits').max(4, 'PIN must be exactly 4 digits').regex(/^\d{4}$/, 'PIN must contain only numbers')
})

type CreateScoutFormData = z.infer<typeof CreateScoutSchema>

interface ScoutCreateFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function ScoutCreateForm({ onSuccess, onCancel }: ScoutCreateFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<CreateScoutFormData>({
    resolver: zodResolver(CreateScoutSchema),
    defaultValues: {
      role: 'scout'
    }
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: CreateScoutFormData) => {
    try {
      setLoading(true)
      
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      const result = await createScout(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: `Scout created successfully. Email: ${data.email}, PIN: ${data.pin}`,
        })
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create scout",
          variant: "destructive",
        })
      }
    } catch (error) {
      logger.error('SCOUT_CREATE_FORM', 'Failed to create scout', { operation: 'SCOUT_CREATE_FORM' }, error)
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
            <CardTitle>Create New Scout</CardTitle>
            <CardDescription>Add a new scout to the system</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="scout@example.com"
              />
              {errors.email && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.email.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* PIN */}
            <div className="space-y-2">
              <Label htmlFor="pin">PIN (4 digits) *</Label>
              <Input
                id="pin"
                {...register('pin')}
                placeholder="1234"
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
              <Label htmlFor="first_name">First Name *</Label>
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
              <Label htmlFor="last_name">Last Name *</Label>
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
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="role">Role *</Label>
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
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              The scout will be able to log in using their email and the 4-digit PIN you provide. 
              The PIN will be automatically encoded for security.
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
                  Creating...
                </>
              ) : (
                'Create Scout'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}



