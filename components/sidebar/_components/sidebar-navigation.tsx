import { SidebarNavItem } from "./sidebar-nav-item"
import { SkeletonCounter } from "@/components/ui/skeleton-counter"
import type { NavigationItem } from "../_types"

interface SidebarNavigationProps {
  navigation: NavigationItem[]
  isActiveRoute: (href: string) => boolean
  isCollapsed: boolean
  favoritesCount?: number
  favoritesLoading?: boolean
}

export function SidebarNavigation({ 
  navigation, 
  isActiveRoute, 
  isCollapsed, 
  favoritesCount,
  favoritesLoading = false
}: SidebarNavigationProps) {
  return (
    <nav className="space-y-1 p-3">
      {navigation.map((item) => {
        const isFavoritesItem = item.name === "My Favorites"
        const badge = isFavoritesItem && favoritesLoading 
          ? <SkeletonCounter />
          : isFavoritesItem 
            ? favoritesCount 
            : undefined

        // Debug logging
        if (isFavoritesItem) {
          console.log('Favorites item found:', {
            itemName: item.name,
            favoritesCount,
            favoritesLoading,
            badge
          })
        }

        return (
          <SidebarNavItem
            key={item.name}
            item={item}
            isActive={isActiveRoute(item.href)}
            isCollapsed={isCollapsed}
            badge={badge}
          />
        )
      })}
    </nav>
  )
}
