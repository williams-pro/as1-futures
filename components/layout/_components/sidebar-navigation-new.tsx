import { cn } from "@/lib/utils"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"
import Link from "next/link"
import type { NavigationItem } from "../_types"

interface SidebarNavigationProps {
  navigationItems: NavigationItem[]
  isActiveRoute: (href: string) => boolean
  favoritesCount: number
}

export function SidebarNavigationNew({ navigationItems, isActiveRoute, favoritesCount }: SidebarNavigationProps) {
  return (
    <SidebarContent className="px-3 py-2">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = isActiveRoute(item.href)
              const badge = item.name === "My Favorites" ? favoritesCount : undefined

              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.name}
                    className={cn(
                      "h-10 px-3 transition-all duration-200 rounded-lg",
                      "hover:bg-as1-gold/10 hover:text-as1-charcoal hover:shadow-sm",
                      "group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:justify-center",
                      isActive && "bg-as1-gold/15 text-as1-gold font-semibold shadow-sm border border-as1-gold/30",
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3 w-full">
                      <Icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-colors duration-200",
                          "group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5",
                          isActive ? "text-as1-gold" : "text-slate-500 group-hover:text-as1-charcoal",
                        )}
                      />
                      <span className="truncate group-data-[collapsible=icon]:hidden font-medium">{item.name}</span>
                      {badge !== undefined && badge > 0 && (
                        <SidebarMenuBadge
                          className={cn(
                            "bg-as1-gold text-white text-xs font-bold rounded-full",
                            "group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:-top-1 group-data-[collapsible=icon]:-right-1 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:text-[10px] group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center",
                          )}
                        >
                          {badge}
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}
