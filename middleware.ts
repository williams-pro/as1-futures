import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Rutas públicas - solo redirigir si hay usuario autenticado
  if (pathname === '/' || pathname.startsWith('/auth/')) {
    if (user) {
      // Verificar que el usuario existe y está activo
      const { data: scout } = await supabase
        .from('scouts')
        .select('role, is_active')
        .eq('id', user.id)
        .single()
      
      if (scout && scout.is_active) {
        const redirectPath = scout.role === 'admin' ? '/admin' : '/teams'
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }
    }
    return supabaseResponse
  }

  if (!user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Verificar que el usuario existe y está activo en la tabla scouts
  const { data: scout } = await supabase
    .from('scouts')
    .select('id, role, is_active')
    .eq('id', user.id)
    .single()

  if (!scout || !scout.is_active) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Proteger rutas de administración - solo admins
  if (pathname.startsWith('/admin')) {
    if (scout.role !== 'admin') {
      return NextResponse.redirect(new URL('/teams', request.url))
    }
  }

  // Proteger la página de lista de jugadores - solo detalles individuales permitidos
  if (pathname === '/players') {
    // Redirigir a teams si intentan acceder a la lista de jugadores
    return NextResponse.redirect(new URL('/teams', request.url))
  }
  
  // Las rutas de detalles de jugadores (/players/[playerId]) son accesibles para scouts y admins

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}