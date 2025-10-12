"use client"

import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/contexts/favorites-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { Logo } from "@/components/logo"
import { useSidebar } from "./_hooks/use-sidebar"
import { SidebarNavItem } from "./_components/sidebar-nav-item"
import { SidebarUserInfo } from "./_components/sidebar-user-info"

export function AppSidebar() {
  const { user, logout } = useAuth()
  const { favorites, exclusives } = useFavorites()
  const { isCollapsed, userNavigation, userInitials, isActiveRoute, toggleCollapse } = useSidebar()

  if (!user) return null

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen border-r border-border bg-background transition-all duration-300 ease-in-out z-40 flex flex-col",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-border px-4 flex-shrink-0">
        <Logo size="sm" collapsed={isCollapsed} />
      </div>

      <div className="absolute -right-3.5 top-14 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleCollapse}
          className="h-7 w-7 rounded-full border-2 border-border bg-background shadow-sm hover:bg-accent hover:border-primary transition-all duration-200"
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-3 mt-2 overflow-y-auto">
        {userNavigation.map((item) => (
          <SidebarNavItem
            key={item.name}
            item={item}
            isActive={isActiveRoute(item.href)}
            isCollapsed={isCollapsed}
            badge={item.name === "My Favorites" ? favorites.length : undefined}
          />
        ))}
      </nav>

      <div className="border-t border-border p-3 flex-shrink-0">
        <SidebarUserInfo
          user={user}
          userInitials={userInitials}
          isCollapsed={isCollapsed}
          favoritesCount={favorites.length}
          exclusivesCount={exclusives.length}
        />

        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 mt-3",
            isCollapsed && "justify-center px-0",
          )}
          onClick={logout}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Sign Out"}
        </Button>
      </div>
    </aside>
  )
}
