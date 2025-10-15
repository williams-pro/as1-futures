import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/teams'

  console.log('🔍 Auth callback called with:', {
    code: code ? 'present' : 'missing',
    next,
    fullUrl: requestUrl.toString()
  })

  if (code) {
    const supabase = await getSupabaseServerClient()
    
    try {
      console.log('🔄 Exchanging code for session...')
      
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Auth callback error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=auth_callback_error`)
      }

      if (data.session) {
        console.log('✅ Auth callback success:', data.session.user.email)
        console.log('🔍 Session details:', {
          user_id: data.session.user.id,
          email: data.session.user.email,
          expires_at: data.session.expires_at
        })
        
        // Get user role and status from our database
        console.log('🔍 Getting user role from database...')
        const { data: user, error: userError } = await supabase
          .from('scouts')
          .select('role, is_active')
          .eq('email', data.session.user.email)
          .single()

        if (userError || !user) {
          console.error('❌ User not found in scouts table:', userError)
          return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=user_not_found`)
        }

        // Check if user account is active
        if (!user.is_active) {
          console.log('❌ User account is inactive')
          return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=account_inactive`)
        }

        // Redirect based on user role or next parameter
        const redirectUrl = user.role === 'admin' 
          ? `${requestUrl.origin}/admin`
          : `${requestUrl.origin}/${next}`

        console.log('🔄 Redirecting to:', redirectUrl)
        
        // Simple redirect - middleware will handle session management
        return NextResponse.redirect(redirectUrl)
      } else {
        console.log('❌ No session after code exchange')
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=no_session`)
      }
    } catch (error) {
      console.error('❌ Unexpected error in auth callback:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=unexpected_error`)
    }
  }

  // If no code, redirect to home
  console.log('❌ No code provided, redirecting to home')
  return NextResponse.redirect(`${requestUrl.origin}/`)
}
