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
import { Loader2, Upload, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createPlayer } from '@/app/actions/admin/players/create-player'
import { uploadPlayerPhoto } from '@/app/actions/admin/upload/upload-player-photo'
import { Team, PlayerPositionType, DominantFootType } from '@/lib/types/admin.types'
import { logger } from '@/lib/logger'

const PlayerCreateSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  jersey_number: z.number().int().min(1).max(99),
  position: z.enum(['Goalkeeper', 'Defender', 'Midfielder', 'Forward']),
  dominant_foot: z.enum(['Left', 'Right', 'Both']),
  height_cm: z.number().int().min(150).max(220),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  team_id: z.string().uuid('Please select a team'),
})

type PlayerCreateFormData = z.infer<typeof PlayerCreateSchema>

const POSITIONS: { value: PlayerPositionType; label: string }[] = [
  { value: 'Goalkeeper', label: 'Goalkeeper' },
  { value: 'Defender', label: 'Defender' },
  { value: 'Midfielder', label: 'Midfielder' },
  { value: 'Forward', label: 'Forward' },
]

const DOMINANT_FEET: { value: DominantFootType; label: string }[] = [
  { value: 'Left', label: 'Left' },
  { value: 'Right', label: 'Right' },
  { value: 'Both', label: 'Both' },
]

interface PlayerCreateFormProps {
  teams: Team[]
  onSuccess?: () => void
  onCancel?: () => void
}

export function PlayerCreateForm({ teams, onSuccess, onCancel }: PlayerCreateFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PlayerCreateFormData>({
    resolver: zodResolver(PlayerCreateSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      jersey_number: 1,
      position: 'Midfielder',
      dominant_foot: 'Right',
      height_cm: 175,
      date_of_birth: '',
      team_id: '',
    },
  })

  const watchedValues = watch()

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    try {
      logger.database('PLAYER_CREATE_FORM', 'Uploading player photo', undefined, { fileName: file.name })

      // Crear un ID temporal para la subida
      const tempId = 'temp-' + Date.now()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('player_id', tempId)

      const result = await uploadPlayerPhoto(formData)

      if (result.success && result.data?.url) {
        setPhotoPreview(result.data.url)
        toast({
          title: "Success",
          description: "Photo uploaded successfully",
        })
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      logger.error('PLAYER_CREATE_FORM', 'Failed to upload photo', { fileName: file.name }, error)
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
  }

  const onSubmit = async (data: PlayerCreateFormData) => {
    setIsLoading(true)
    try {
      logger.database('PLAYER_CREATE_FORM', 'Creating player', undefined, { teamId: data.team_id })

      // Obtener el tournament_id del equipo seleccionado
      const selectedTeam = teams.find(team => team.id === data.team_id)
      if (!selectedTeam) {
        throw new Error('Selected team not found')
      }

      const formData = new FormData()
      formData.append('first_name', data.first_name)
      formData.append('last_name', data.last_name)
      formData.append('jersey_number', data.jersey_number.toString())
      formData.append('position', data.position)
      formData.append('dominant_foot', data.dominant_foot)
      formData.append('height_cm', data.height_cm.toString())
      formData.append('date_of_birth', data.date_of_birth)
      formData.append('team_id', data.team_id)
      formData.append('tournament_id', selectedTeam.tournament_id)
      if (photoPreview) {
        formData.append('photo_url', photoPreview)
      }

      const result = await createPlayer(formData)

      if (result.success) {
        logger.database('PLAYER_CREATE_FORM', 'Player created successfully', undefined, { teamId: data.team_id })
        toast({
          title: "Success",
          description: "Player created successfully",
        })
        onSuccess?.()
      } else {
        throw new Error(result.error || 'Create failed')
      }
    } catch (error) {
      logger.error('PLAYER_CREATE_FORM', 'Failed to create player', { teamId: data.team_id }, error)
      toast({
        title: "Error",
        description: result.error || "Failed to create player",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Player</CardTitle>
        <CardDescription>
          Add a new player to the tournament
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                {...register('first_name')}
                placeholder="e.g., Carlos"
              />
              {errors.first_name && (
                <Alert variant="destructive">
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
                placeholder="e.g., Mendoza"
              />
              {errors.last_name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.last_name.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Jersey Number */}
            <div className="space-y-2">
              <Label htmlFor="jersey_number">Jersey Number</Label>
              <Input
                id="jersey_number"
                type="number"
                min="1"
                max="99"
                {...register('jersey_number', { valueAsNumber: true })}
                placeholder="e.g., 10"
              />
              {errors.jersey_number && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.jersey_number.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={watchedValues.position}
                onValueChange={(value) => setValue('position', value as PlayerPositionType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((position) => (
                    <SelectItem key={position.value} value={position.value}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.position && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.position.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dominant Foot */}
            <div className="space-y-2">
              <Label htmlFor="dominant_foot">Dominant Foot</Label>
              <Select
                value={watchedValues.dominant_foot}
                onValueChange={(value) => setValue('dominant_foot', value as DominantFootType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select foot" />
                </SelectTrigger>
                <SelectContent>
                  {DOMINANT_FEET.map((foot) => (
                    <SelectItem key={foot.value} value={foot.value}>
                      {foot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dominant_foot && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.dominant_foot.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height_cm">Height (cm)</Label>
              <Input
                id="height_cm"
                type="number"
                min="150"
                max="220"
                {...register('height_cm', { valueAsNumber: true })}
                placeholder="e.g., 180"
              />
              {errors.height_cm && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.height_cm.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                {...register('date_of_birth')}
              />
              {errors.date_of_birth && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.date_of_birth.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Team Selection */}
            <div className="space-y-2">
              <Label htmlFor="team_id">Team</Label>
              <Select
                value={watchedValues.team_id}
                onValueChange={(value) => setValue('team_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name} ({team.team_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.team_id && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.team_id.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Player Photo</Label>
            <div className="flex items-center space-x-4">
              {photoPreview && (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Player photo preview"
                    className="h-20 w-20 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={handleRemovePhoto}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                {isUploading && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Uploading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Player
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
