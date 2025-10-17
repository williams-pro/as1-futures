"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerEnhanced } from "@/components/ui/date-picker-enhanced"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { createSpecialMatch } from "@/app/actions/admin/special-matches/create-special-match"
import { updateSpecialMatch } from "@/app/actions/admin/special-matches/update-special-match"
import { useToast } from "@/hooks/use-toast"
import type { SpecialMatchWithTeams, CreateSpecialMatchData, UpdateSpecialMatchData } from "@/lib/types/special-matches.types"
import { COMMON_MATCH_TYPES } from "@/lib/types/special-matches.types"

const specialMatchSchema = z.object({
  match_type: z.string().min(1, "Match type is required"),
  match_date: z.string().min(1, "Match date is required"),
  match_time: z.string().min(1, "Match time is required"),
  video_url: z.string().url().optional().or(z.literal("")),
  home_team_display: z.string().optional(),
  away_team_display: z.string().optional(),
})

type SpecialMatchFormData = z.infer<typeof specialMatchSchema>

interface SpecialMatchFormProps {
  tournamentId: string
  match?: SpecialMatchWithTeams
  onSuccess: () => void
  onCancel: () => void
}

// Function to generate match code based on match type
const generateMatchCode = (matchType: string, existingMatches: SpecialMatchWithTeams[] = []): string => {
  // Create a mapping for better prefixes
  const typePrefixes: Record<string, string> = {
    'Semifinal': 'SF',
    'Final': 'FIN',
    'Quarterfinal': 'QF',
    'Round of 16': 'R16',
    'Third Place': '3RD',
    'Friendly': 'FRD',
    'Exhibition': 'EXH',
  }
  
  const typePrefix = typePrefixes[matchType] || matchType.toUpperCase().substring(0, 3)
  
  // Count existing matches of the same type
  const sameTypeMatches = existingMatches.filter(m => m.match_type === matchType)
  const count = sameTypeMatches.length + 1
  
  return `${typePrefix}${count.toString().padStart(2, '0')}`
}

export function SpecialMatchForm({ tournamentId, match, onSuccess, onCancel }: SpecialMatchFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const isEditing = !!match

  const form = useForm<SpecialMatchFormData>({
    resolver: zodResolver(specialMatchSchema),
    defaultValues: {
      match_type: match?.match_type || "",
      match_date: match?.match_date || "",
      match_time: match?.match_time || "",
      video_url: match?.video_url || "",
      home_team_display: match?.home_team_display || "",
      away_team_display: match?.away_team_display || "",
    }
  })

  const onSubmit = async (data: SpecialMatchFormData) => {
    setIsSubmitting(true)
    
    try {
      // Generate match code automatically
      const matchCode = isEditing 
        ? match?.match_code || generateMatchCode(data.match_type)
        : generateMatchCode(data.match_type)
      
      const matchData = {
        ...data,
        match_code: matchCode,
        tournament_id: tournamentId,
        video_url: data.video_url || undefined,
        home_team_display: data.home_team_display || undefined,
        away_team_display: data.away_team_display || undefined,
      }

      let result
      if (isEditing) {
        result = await updateSpecialMatch({ id: match.id, ...matchData } as UpdateSpecialMatchData)
      } else {
        result = await createSpecialMatch(matchData as CreateSpecialMatchData)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Special match ${isEditing ? 'updated' : 'created'} successfully`,
        })
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save special match",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Special Match" : "Create Special Match"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="match_type">Match Type</Label>
            <Select
              value={form.watch("match_type")}
              onValueChange={(value) => form.setValue("match_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select match type" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_MATCH_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.match_type && (
              <p className="text-sm text-red-600">
                {form.formState.errors.match_type.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Match code will be generated automatically (e.g., SF01, FIN01, QF01, R1601)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="match_date">Match Date</Label>
              <DatePickerEnhanced
                value={form.watch("match_date")}
                onChange={(value) => form.setValue("match_date", value)}
                placeholder="Select match date"
                className="w-full"
              />
              {form.formState.errors.match_date && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.match_date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="match_time">Match Time</Label>
              <Input
                id="match_time"
                type="time"
                {...form.register("match_time")}
              />
              {form.formState.errors.match_time && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.match_time.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_url">Video URL (Optional)</Label>
            <Input
              id="video_url"
              {...form.register("video_url")}
              placeholder="https://example.com/video"
            />
            {form.formState.errors.video_url && (
              <p className="text-sm text-red-600">
                {form.formState.errors.video_url.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="home_team_display">Home Team Display (Optional)</Label>
              <Input
                id="home_team_display"
                {...form.register("home_team_display")}
                placeholder="e.g., Winner of SF1, TBD"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="away_team_display">Away Team Display (Optional)</Label>
              <Input
                id="away_team_display"
                {...form.register("away_team_display")}
                placeholder="e.g., Winner of SF2, TBD"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? "Update Match" : "Create Match"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
