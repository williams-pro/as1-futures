"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { updateTeam } from '@/app/actions/admin/teams/update-team'
import { uploadTeamLogo } from '@/app/actions/admin/upload/upload-team-logo'
import { Team, TournamentGroup } from '@/lib/types/admin.types'
import { logger } from '@/lib/logger'

const TeamEditSchema = z.object({
  team_code: z.string().min(2, 'Team code must be at least 2 characters'),
  name: z.string().min(3, 'Team name must be at least 3 characters'),
  group_id: z.string().uuid('Please select a group'),
  is_as1_team: z.boolean(),
})

type TeamEditFormData = z.infer<typeof TeamEditSchema>

interface TeamEditFormProps {
  team: Team
  groups: TournamentGroup[]
  onSuccess?: () => void
  onCancel?: () => void
}

export function TeamEditForm({ team, groups, onSuccess, onCancel }: TeamEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(team.logo_url || null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TeamEditFormData>({
    resolver: zodResolver(TeamEditSchema),
    defaultValues: {
      team_code: team.team_code,
      name: team.name,
      group_id: team.group_id,
      is_as1_team: team.is_as1_team,
    },
  })

  const watchedValues = watch()

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    try {
      logger.database('TEAM_EDIT_FORM', 'Uploading team logo', undefined, { teamId: team.id })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('team_id', team.id)

      const result = await uploadTeamLogo(formData)

      if (result.success && result.data?.url) {
        setLogoPreview(result.data.url)
        toast({
          title: "Success",
          description: "Logo uploaded successfully",
        })
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      logger.error('TEAM_EDIT_FORM', 'Failed to upload logo', { teamId: team.id }, error)
      toast({
        title: "Error",
        description: "Failed to upload logo",
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

  const handleRemoveLogo = () => {
    setLogoPreview(null)
  }

  const onSubmit = async (data: TeamEditFormData) => {
    setIsLoading(true)
    try {
      logger.database('TEAM_EDIT_FORM', 'Updating team', undefined, { teamId: team.id })

      const formData = new FormData()
      formData.append('id', team.id)
      formData.append('team_code', data.team_code)
      formData.append('name', data.name)
      formData.append('group_id', data.group_id)
      formData.append('is_as1_team', data.is_as1_team.toString())
      // Enviar logo_url como string vacío si no hay preview, o null si se eliminó
      formData.append('logo_url', logoPreview || '')

      const result = await updateTeam(formData)

      if (result.success) {
        logger.database('TEAM_EDIT_FORM', 'Team updated successfully', undefined, { teamId: team.id })
        toast({
          title: "Success",
          description: "Team updated successfully",
        })
        onSuccess?.()
      } else {
        throw new Error(result.error || 'Update failed')
      }
    } catch (error) {
      logger.error('TEAM_EDIT_FORM', 'Failed to update team', { teamId: team.id }, error)
      toast({
        title: "Error",
        description: result.error || "Failed to update team",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Team</CardTitle>
        <CardDescription>
          Update team information and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Team Code */}
          <div className="space-y-2">
            <Label htmlFor="team_code">Team Code</Label>
            <Input
              id="team_code"
              {...register('team_code')}
              placeholder="e.g., FARCOS"
            />
            {errors.team_code && (
              <Alert variant="destructive">
                <AlertDescription>{errors.team_code.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Great Farcos FC"
            />
            {errors.name && (
              <Alert variant="destructive">
                <AlertDescription>{errors.name.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Group Selection */}
          <div className="space-y-2">
            <Label htmlFor="group_id">Group</Label>
            <Select
              value={watchedValues.group_id}
              onValueChange={(value) => setValue('group_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name} ({group.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.group_id && (
              <Alert variant="destructive">
                <AlertDescription>{errors.group_id.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* AS1 Team Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_as1_team"
              checked={watchedValues.is_as1_team}
              onCheckedChange={(checked) => setValue('is_as1_team', checked as boolean)}
            />
            <Label htmlFor="is_as1_team">AS1 Team</Label>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Team Logo</Label>
            <div className="flex items-center space-x-4">
              {logoPreview && (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="Team logo preview"
                    className="h-16 w-16 object-contain rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={handleRemoveLogo}
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
              Update Team
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
