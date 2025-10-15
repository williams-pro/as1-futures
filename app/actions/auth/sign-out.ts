'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { logger } from '@/lib/logger'

export async function signOut() {
  try {
    const supabase = await createServerClient()
    
    // Obtener usuario actual para logging
    const { data: { user } } = await supabase.auth.getUser()
    
    // Cerrar sesión
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      logger.authError('SIGN_OUT', 'Failed to sign out', user?.id, error)
      return { success: false, error: 'Failed to sign out' }
    }

    // Log exitoso
    logger.auth('SIGN_OUT', 'User signed out successfully', user?.id)
    
  } catch (error) {
    logger.authError('SIGN_OUT', 'Unexpected error during sign out', undefined, error instanceof Error ? error : new Error(String(error)))
    return { success: false, error: 'Unexpected error during sign out' }
  }

  console.log("[SignOut] Revalidating paths and redirecting to /")
  revalidatePath('/', 'layout')
  revalidatePath('/teams', 'layout')
  revalidatePath('/players', 'layout')
  revalidatePath('/matches', 'layout')
  revalidatePath('/favorites', 'layout')
  redirect('/')
}
