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
import { Loader2, X, AlertCircle } from 'lucide-react'
import { createMatch } from '@/app/actions/admin/matches/create-match'
import { getTournaments } from '@/app/actions/admin/tournaments/get-tournaments'
import { getTeams } from '@/app/actions/admin/teams/get-teams'
import { logger } from '@/lib/logger'
import { useToast } from '@/hooks/use-toast'

const CreateMatchSchema = z.object({
  match_code: z.string().min(3, 'Match code must be at least 3 characters'),
  tournament_id: z.string().uuid('Please select a tournament'),
  group_id: z.string().uuid('Please select a group'),
  home_team_id: z.string().uuid('Please select home team'),
  away_team_id: z.string().uuid('Please select away team'),
  match_date: z.string().min(1, 'Match date is required'),
  match_time: z.string().min(1, 'Match time is required'),
  video_url: z.string().url('Invalid video URL').optional().or(z.literal(''))
})

type CreateMatchFormData = z.infer<typeof CreateMatchSchema>

interface Tournament {
  id: string
  name: string
  year: number
}

interface TournamentGroup {
  id: string
  name: string
  code: string
  tournament_id: string
}

interface Team {
  id: string
  name: string
  team_code: string
  group_id: string
}

interface MatchCreateFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function MatchCreateForm({ onSuccess, onCancel }: MatchCreateFormProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [groups, setGroups] = useState<TournamentGroup[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<CreateMatchFormData>({
    resolver: zodResolver(CreateMatchSchema)
  })

  const selectedTournamentId = watch('tournament_id')
  const selectedGroupId = watch('group_id')

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true)
        
        const [tournamentsResult, teamsResult] = await Promise.all([
          getTournaments(),
          getTeams()
        ])

        if (tournamentsResult.success) {
          setTournaments(tournamentsResult.data || [])
        }

        if (teamsResult.success) {
          setTeams(teamsResult.data || [])
        }

        // Extraer grupos únicos de los equipos
        const uniqueGroups = teamsResult.data?.reduce((acc: TournamentGroup[], team) => {
          if (team.group && !acc.find(g => g.id === team.group.id)) {
            acc.push({
              id: team.group.id,
              name: team.group.name,
              code: team.group.code,
              tournament_id: team.tournament_id
            })
          }
          return acc
        }, []) || []
        
        setGroups(uniqueGroups)
      } catch (error) {
        logger.error('MATCH_CREATE_FORM', 'Failed to load data', { operation: 'MATCH_CREATE_FORM' }, error)
        toast({
          title: "Error",
          description: "Failed to load form data",
          variant: "destructive",
        })
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [])

  // Filtrar grupos por torneo seleccionado
  const filteredGroups = groups.filter(group => group.tournament_id === selectedTournamentId)

  // Filtrar equipos por grupo seleccionado
  const filteredTeams = teams.filter(team => team.group_id === selectedGroupId)

  const onSubmit = async (data: CreateMatchFormData) => {
    try {
      setLoading(true)
      
      // Validar que home_team_id y away_team_id sean diferentes
      if (data.home_team_id === data.away_team_id) {
        toast({
          title: "Error",
          description: "Home team and away team must be different",
          variant: "destructive",
        })
        return
      }

      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value.toString())
        }
      })

      const result = await createMatch(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Match created successfully",
        })
        reset()
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
            description: result.error || "Failed to create match",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      logger.error('MATCH_CREATE_FORM', 'Failed to create match', { operation: 'MATCH_CREATE_FORM' }, error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create New Match</CardTitle>
          <CardDescription>Loading form data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Create New Match</CardTitle>
            <CardDescription>Add a new match to the tournament</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Match Code */}
            <div className="space-y-2">
              <Label htmlFor="match_code">Match Code *</Label>
              <Input
                id="match_code"
                {...register('match_code')}
                placeholder="e.g., MATCH_001"
              />
              {errors.match_code && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.match_code.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Tournament */}
            <div className="space-y-2">
              <Label htmlFor="tournament_id">Tournament *</Label>
              <Select onValueChange={(value) => setValue('tournament_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tournament" />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      {tournament.name} ({tournament.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tournament_id && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.tournament_id.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Group */}
            <div className="space-y-2">
              <Label htmlFor="group_id">Group *</Label>
              <Select 
                onValueChange={(value) => setValue('group_id', value)}
                disabled={!selectedTournamentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {filteredGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name} ({group.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.group_id && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.group_id.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Home Team */}
            <div className="space-y-2">
              <Label htmlFor="home_team_id">Home Team *</Label>
              <Select 
                onValueChange={(value) => setValue('home_team_id', value)}
                disabled={!selectedGroupId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select home team" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name} ({team.team_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.home_team_id && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.home_team_id.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Away Team */}
            <div className="space-y-2">
              <Label htmlFor="away_team_id">Away Team *</Label>
              <Select 
                onValueChange={(value) => setValue('away_team_id', value)}
                disabled={!selectedGroupId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select away team" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name} ({team.team_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.away_team_id && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.away_team_id.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Match Date */}
            <div className="space-y-2">
              <Label htmlFor="match_date">Match Date *</Label>
              <Input
                id="match_date"
                type="date"
                {...register('match_date')}
              />
              {errors.match_date && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.match_date.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Match Time */}
            <div className="space-y-2">
              <Label htmlFor="match_time">Match Time *</Label>
              <Input
                id="match_time"
                type="time"
                {...register('match_time')}
              />
              {errors.match_time && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.match_time.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Video URL */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="video_url">Video URL (Optional)</Label>
              <Input
                id="video_url"
                {...register('video_url')}
                placeholder="https://example.com/video"
              />
              {errors.video_url && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.video_url.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

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
                'Create Match'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
