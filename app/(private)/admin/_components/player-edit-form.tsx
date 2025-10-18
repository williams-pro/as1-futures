"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DatePicker } from '@/components/ui/date-picker'
import { Loader2, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { updatePlayer } from '@/app/actions/admin/players/update-player'
import { uploadPlayerPhoto } from '@/app/actions/admin/upload/upload-player-photo'
import { Player, Team, PlayerPositionType, DominantFootType, PlayerVideo } from '@/lib/types/admin.types'
import { PLAYER_POSITIONS, POSITION_DISPLAY_NAMES } from '@/lib/constants/player-positions'
import { logger } from '@/lib/logger'
import { PlayerVideosManager } from './player-videos-manager'

const PlayerEditSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  jersey_number: z.number().int().min(1).max(99),
  position: z.enum(PLAYER_POSITIONS),
  dominant_foot: z.enum(['Left', 'Right', 'Both']),
  height_cm: z.number().int().min(150).max(220),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
})

type PlayerEditFormData = z.infer<typeof PlayerEditSchema>

const POSITIONS: { value: PlayerPositionType; label: string }[] = PLAYER_POSITIONS.map(position => ({
  value: position,
  label: POSITION_DISPLAY_NAMES[position]
}))

const DOMINANT_FEET: { value: DominantFootType; label: string }[] = [
  { value: 'Left', label: 'Left' },
  { value: 'Right', label: 'Right' },
  { value: 'Both', label: 'Both' },
]

interface PlayerEditFormProps {
  player: Player & { player_videos?: PlayerVideo[] }
  onSuccess?: () => void
  onCancel?: () => void
}

export function PlayerEditForm({ player, onSuccess, onCancel }: PlayerEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(player.photo_url || null)
  const [playerVideos, setPlayerVideos] = useState<PlayerVideo[]>(player.player_videos || [])
  const { toast } = useToast()

  // Helper function to ensure date format is YYYY-MM-DD for input
  const formatDateForInput = (dateString: string) => {
    try {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString
      }
      // Otherwise, convert to YYYY-MM-DD format
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    } catch {
      return dateString
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PlayerEditFormData>({
    resolver: zodResolver(PlayerEditSchema),
    defaultValues: {
      first_name: player.first_name,
      last_name: player.last_name,
      jersey_number: player.jersey_number,
      position: player.position,
      dominant_foot: player.dominant_foot,
      height_cm: player.height_cm,
      date_of_birth: formatDateForInput(player.date_of_birth),
    },
  })

  const watchedValues = watch()

  // Force the date format to YYYY-MM-DD when component mounts
  useEffect(() => {
    if (player.date_of_birth) {
      const formattedDate = formatDateForInput(player.date_of_birth)
      setValue('date_of_birth', formattedDate)
    }
  }, [player.date_of_birth, setValue])

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    try {
      logger.database('PLAYER_EDIT_FORM', 'Uploading player photo', player.id)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('player_id', player.id)

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
      logger.error('Failed to upload photo', { operation: 'PLAYER_EDIT_FORM', metadata: { playerId: player.id } }, error as Error)
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

  const onSubmit = async (data: PlayerEditFormData) => {
    setIsLoading(true)
    try {
      logger.database('PLAYER_EDIT_FORM', 'Updating player', player.id)

      const formData = new FormData()
      formData.append('id', player.id)
      formData.append('first_name', data.first_name)
      formData.append('last_name', data.last_name)
      formData.append('jersey_number', data.jersey_number.toString())
      formData.append('position', data.position)
      formData.append('dominant_foot', data.dominant_foot)
      formData.append('height_cm', data.height_cm.toString())
      formData.append('date_of_birth', data.date_of_birth)
      // Enviar photo_url como string vacío si no hay preview, o null si se eliminó
      formData.append('photo_url', photoPreview || '')

      const result = await updatePlayer(formData)

      if (result.success) {
        logger.database('PLAYER_EDIT_FORM', 'Player updated successfully', player.id)
        toast({
          title: "Success",
          description: "Player updated successfully",
        })
        onSuccess?.()
      } else {
        throw new Error(result.error || 'Update failed')
      }
    } catch (error) {
      logger.error('Failed to update player', { operation: 'PLAYER_EDIT_FORM', metadata: { playerId: player.id } }, error as Error)
      toast({
        title: "Error",
        description: "Failed to update player",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Player</CardTitle>
        <CardDescription>
          Update player information and settings
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

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <DatePicker
              value={watch('date_of_birth')}
              onChange={(value) => setValue('date_of_birth', value)}
              placeholder="Select date of birth"
            />
            {errors.date_of_birth && (
              <Alert variant="destructive">
                <AlertDescription>{errors.date_of_birth.message}</AlertDescription>
              </Alert>
            )}
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
              Update Player
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    {/* Player Videos Manager */}
    <PlayerVideosManager
      playerId={player.id}
      playerName={`${player.first_name} ${player.last_name}`}
      initialVideos={playerVideos}
      onVideosChange={setPlayerVideos}
    />
  </>
  )
}
