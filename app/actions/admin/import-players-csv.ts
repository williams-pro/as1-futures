'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const PlayerCSVSchema = z.object({
  dni: z.string().optional().or(z.literal('')),
  team_code: z.string().min(3).max(8).regex(/^[A-Za-z0-9_]+$/),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  jersey_number: z.string().regex(/^\d+$/).transform(Number).refine(n => n >= 1 && n <= 99),
  position: z.enum(['Forward', 'Midfielder', 'Defender', 'Goalkeeper']),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  height_cm: z.string().regex(/^\d+$/).transform(Number).refine(n => n >= 120 && n <= 220),
  dominant_foot: z.enum(['Left', 'Right', 'Both']),
  video_url_1: z.string().url().optional().or(z.literal('')),
  video_url_2: z.string().url().optional().or(z.literal('')),
  video_url_3: z.string().url().optional().or(z.literal('')),
  comments: z.string().optional().or(z.literal(''))
})

export async function importPlayersCSV(formData: FormData) {
  const supabase = await createServerClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data: scout } = await supabase
    .from('scouts')
    .select('role')
    .eq('id', user.id)
    .single()

  if (scout?.role !== 'admin') {
    return { success: false, error: 'Forbidden - Admin access required' }
  }

  try {
    const file = formData.get('file') as File
    const tournamentId = formData.get('tournamentId') as string

    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    if (!tournamentId) {
      return { success: false, error: 'Tournament ID required' }
    }

    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('id, status')
      .eq('id', tournamentId)
      .single()

    if (tournamentError || !tournament) {
      return { success: false, error: 'Tournament not found' }
    }

    if (tournament.status === 'completed' || tournament.status === 'archived') {
      return {
        success: false,
        error: 'Cannot import players to completed or archived tournament'
      }
    }

    // Parse CSV using a simple approach (you might want to add papaparse later)
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
      const row: Record<string, string> = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      return row
    })

    const errors: Array<{ line: number; field: string; error: string }> = []
    const validRows: z.infer<typeof PlayerCSVSchema>[] = []

    rows.forEach((row: any, index: number) => {
      const result = PlayerCSVSchema.safeParse(row)

      if (!result.success) {
        result.error.errors.forEach(err => {
          errors.push({
            line: index + 2,
            field: err.path.join('.'),
            error: err.message
          })
        })
      } else {
        validRows.push(result.data)
      }
    })

    if (errors.length > 0) {
      return {
        success: false,
        error: 'Validation failed',
        errors,
        totalRows: rows.length,
        validRows: validRows.length,
        invalidRows: errors.length
      }
    }

    const playersToInsert = await Promise.all(
      validRows.map(async (row) => {
        // Find team by team_code within this tournament
        const { data: team } = await supabase
          .from('teams')
          .select('id')
          .eq('team_code', row.team_code)
          .eq('tournament_id', tournamentId)
          .single()

        if (!team) {
          throw new Error(`Team code ${row.team_code} not found in tournament`)
        }

        return {
          tournament_id: tournamentId,
          team_id: team.id,
          first_name: row.first_name,
          last_name: row.last_name,
          jersey_number: row.jersey_number,
          position: row.position,
          date_of_birth: row.birth_date,
          height_cm: row.height_cm,
          dominant_foot: row.dominant_foot,
          dni: row.dni || null,
          comments: row.comments || null
        }
      })
    )

    // Insert players
    const { data: insertedPlayers, error: insertError } = await supabase
      .from('players')
      .insert(playersToInsert)
      .select()

    if (insertError) throw insertError

    const videosToInsert: Array<{
      player_id: string
      video_url: string
      video_type: string
      display_order: number
    }> = []
    
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i]
      const player = insertedPlayers[i]

      const videoUrls = [row.video_url_1, row.video_url_2, row.video_url_3]
        .filter((url): url is string => url !== undefined && url.trim() !== '')

      videoUrls.forEach((url, index) => {
        videosToInsert.push({
          player_id: player.id,
          video_url: url,
          video_type: url.includes('youtube') ? 'youtube' : 'veo',
          display_order: index
        })
      })
    }

    if (videosToInsert.length > 0) {
      const { error: videosError } = await supabase
        .from('player_videos')
        .insert(videosToInsert)

      if (videosError) throw videosError
    }

    revalidatePath('/admin/players')
    revalidatePath('/players')

    return {
      success: true,
      message: `Successfully imported ${validRows.length} players`,
      count: validRows.length
    }

  } catch (error: any) {
    console.error('[v0] Error importing players:', error)
    return {
      success: false,
      error: 'Import failed',
      details: error.message
    }
  }
}
