'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const CreateTournamentSchema = z.object({
  name: z.string().min(3).max(100),
  year: z.number().int().min(2024).max(2100),
  season: z.enum(['Spring', 'Summer', 'Fall', 'Winter', 'Annual']).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().max(500).optional(),
  maxGroups: z.number().int().min(1).max(10).default(2),
  teamsPerGroup: z.number().int().min(3).max(10).default(5)
})

export async function createTournament(formData: FormData) {
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

  const validatedFields = CreateTournamentSchema.safeParse({
    name: formData.get('name'),
    year: Number(formData.get('year')),
    season: formData.get('season') || undefined,
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    description: formData.get('description') || undefined,
    maxGroups: Number(formData.get('maxGroups')) || 2,
    teamsPerGroup: Number(formData.get('teamsPerGroup')) || 5
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input',
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  const data = validatedFields.data

  try {
    const { data: tournament, error } = await supabase
      .from('tournaments')
      .insert({
        name: data.name,
        year: data.year,
        season: data.season,
        start_date: data.startDate,
        end_date: data.endDate,
        description: data.description,
        max_groups: data.maxGroups,
        teams_per_group: data.teamsPerGroup,
        status: 'draft',
        created_by: user.id
      })
      .select()
      .single()

    if (error) throw error

    const groupsToCreate = []
    for (let i = 0; i < data.maxGroups; i++) {
      const code = String.fromCharCode(65 + i) // A, B, C, D...
      groupsToCreate.push({
        tournament_id: tournament.id,
        code,
        name: `Group ${code}`,
        display_order: i + 1
      })
    }

    const { error: groupsError } = await supabase
      .from('tournament_groups')
      .insert(groupsToCreate)

    if (groupsError) throw groupsError

    revalidatePath('/admin/tournaments')
    return { success: true, tournament }
  } catch (error) {
    console.error('[v0] Error creating tournament:', error)
    return { success: false, error: 'Failed to create tournament' }
  }
}



