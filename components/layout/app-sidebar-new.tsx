"use client"

import { cn } from "@/lib/utils"
import { Sidebar, SidebarRail, useSidebar } from "@/components/ui/sidebar"
import { SidebarHeader } from "./_components/sidebar-header"
import { SidebarNavigationNew } from "./_components/sidebar-navigation-new"
import { SidebarUserInfo } from "./_components/sidebar-user-info"
import { SidebarToggleButton } from "./_components/sidebar-toggle-button"
import { useSidebar as useAS1Sidebar } from "./_hooks/use-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/contexts/favorites-context"

export function AppSidebarNew() {
  const { user } = useAuth()
  const { favorites, exclusives } = useFavorites()
  const { state, toggleSidebar } = useSidebar()
  const { userNavigation, userInitials, isActiveRoute } = useAS1Sidebar()

  const isCollapsed = state === "collapsed"

  if (!user) return null

  return (
    <div className="relative">
      <Sidebar
        collapsible="icon"
        className={cn("border-r border-slate-200 bg-white shadow-sm", isCollapsed ? "w-20" : "w-64")}
      >
        {/* Header with Logo */}
        <SidebarHeader />

        {/* Navigation */}
        <SidebarNavigationNew
          navigationItems={userNavigation}
          isActiveRoute={isActiveRoute}
          favoritesCount={favorites.length}
        />

        {/* User Info and Logout - Footer */}
        <div className="mt-auto border-t border-slate-200 p-3">
          <SidebarUserInfo
            user={user}
            userInitials={userInitials}
            isCollapsed={isCollapsed}
            favoritesCount={favorites.length}
            exclusivesCount={exclusives.length}
          />
        </div>

        {/* Sidebar Rail for expand/collapse */}
        <SidebarRail />
      </Sidebar>

      {/* Custom Toggle Button */}
      <SidebarToggleButton isCollapsed={isCollapsed} onToggle={toggleSidebar} />
    </div>
  )
}
