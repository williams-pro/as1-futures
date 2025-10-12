"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useSidebarContext } from "@/contexts/sidebar-context"
import { NAVIGATION_ITEMS } from "../_constants/navigation"

export function useSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { isCollapsed, toggleCollapse } = useSidebarContext()

  const userNavigation = user
    ? NAVIGATION_ITEMS.filter((item) => item.roles.includes(user.role) && item.visible !== false)
    : []

  const userInitials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
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
