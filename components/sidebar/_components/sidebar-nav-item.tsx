"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"
import type { NavigationItem } from "../_types"

interface SidebarNavItemProps {
  item: NavigationItem
  isActive: boolean
  isCollapsed: boolean
  badge?: number | React.ReactNode
}

export function SidebarNavItem({ item, isActive, isCollapsed, badge }: SidebarNavItemProps) {
  const Icon = item.icon
  const { setOpenMobile, isMobile } = useSidebar()

  const handleClick = () => {
    // Cerrar sidebar móvil al hacer clic en un enlace
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
        isCollapsed && "justify-center",
      )}
      title={isCollapsed ? item.name : undefined}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
      {!isCollapsed && (
        <>
          <span className="flex-1">{item.name}</span>
          {badge !== undefined && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
              {badge}
            </span>
          )}
        </>
      )}
      {isCollapsed && badge !== undefined && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {badge}
        </span>
      )}
    </Link>
  )
}
