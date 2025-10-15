'use server'

import { createServerClient } from '@/lib/supabase/server'

export async function getCurrentUser() {
  const supabase = await createServerClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return { success: false, user: null }
  }

  const { data: scout } = await supabase
    .from('scouts')
    .select('id, email, first_name, last_name, full_name, role, is_active')
    .eq('id', user.id)
    .single()

  return { success: true, user: scout }
}
