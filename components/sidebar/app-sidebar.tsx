"use client"

import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/contexts/favorites-context"
import { useSidebar } from "./_hooks/use-sidebar"
import { useSidebar as useShadcnSidebar } from "@/components/ui/sidebar"
import { SidebarLogoHeader } from "./_components/sidebar-logo-header"
import { SidebarNavigation } from "./_components/sidebar-navigation"
import { SidebarFooter } from "./_components/sidebar-footer"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter as ShadcnSidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const { user } = useAuth()
  const { favorites, exclusives } = useFavorites()
  const { userNavigation, userInitials, isActiveRoute } = useSidebar()
  const { state } = useShadcnSidebar()

  const isCollapsed = state === "collapsed"

  if (!user) return null

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="bg-gradient-as1-primary border-r border-border sidebar-custom-width"
    >
      <SidebarHeader className="border-b border-border">
        <SidebarLogoHeader isCollapsed={isCollapsed} />
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarNavigation
          navigation={userNavigation}
          isActiveRoute={isActiveRoute}
          isCollapsed={isCollapsed}
          favoritesCount={favorites.length}
        />
      </SidebarContent>

      <ShadcnSidebarFooter className="border-t border-border flex-shrink-0">
        <SidebarFooter
          user={user}
          userInitials={userInitials}
          isCollapsed={isCollapsed}
          favoritesCount={favorites.length}
          exclusivesCount={exclusives.length}
        />
      </ShadcnSidebarFooter>
    </Sidebar>
  )
}
