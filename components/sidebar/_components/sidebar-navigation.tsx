import { SidebarNavItem } from "./sidebar-nav-item"
import type { NavigationItem } from "../_types"

interface SidebarNavigationProps {
  navigation: NavigationItem[]
  isActiveRoute: (href: string) => boolean
  isCollapsed: boolean
  favoritesCount: number
}

export function SidebarNavigation({ 
  navigation, 
  isActiveRoute, 
  isCollapsed, 
  favoritesCount 
}: SidebarNavigationProps) {
  return (
    <nav className="space-y-1 p-3">
      {navigation.map((item) => (
        <SidebarNavItem
          key={item.name}
          item={item}
          isActive={isActiveRoute(item.href)}
          isCollapsed={isCollapsed}
          badge={item.name === "My Favorites" ? favoritesCount : undefined}
        />
      ))}
    </nav>
  )
}
