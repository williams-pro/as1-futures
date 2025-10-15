"use client"

import { usePathname } from "next/navigation"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { useSidebarContext } from "@/contexts/sidebar-context"
import { NAVIGATION_ITEMS } from "../_constants/navigation"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function useSidebar() {
  const pathname = usePathname()
  const { user } = useSupabaseAuth()
  const { isCollapsed, toggleCollapse } = useSidebarContext()
  const [userRole, setUserRole] = useState<string | null>(null)

  // Obtener el rol del usuario desde la base de datos
  useEffect(() => {
    if (user) {
      const supabase = getSupabaseBrowserClient()
      supabase
        .from('scouts')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data, error }: { data: any; error: any }) => {
          if (data && !error) {
            setUserRole(data.role)
          } else {
            // Fallback a scout si no se puede obtener el rol
            setUserRole('scout')
          }
        })
        .catch(() => {
          // Fallback a scout en caso de error
          setUserRole('scout')
        })
    } else {
      setUserRole(null)
    }
  }, [user])

  const userNavigation = userRole
    ? NAVIGATION_ITEMS.filter((item) => item.roles.includes(userRole as 'admin' | 'scout') && item.visible !== false)
    : []

  // Generar iniciales del email si no hay nombre disponible
  const userInitials = user
    ? user.email
        ?.split('@')[0]
        .split('.')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || "U"
    : ""

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return {
    isCollapsed,
    userNavigation,
    userInitials,
    isActiveRoute,
    toggleCollapse,
  }
}
