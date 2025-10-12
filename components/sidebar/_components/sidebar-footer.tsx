import { SidebarUserInfo } from "./sidebar-user"
import type { User } from "@/lib/types"

interface SidebarFooterProps {
  user: User
  userInitials: string
  isCollapsed: boolean
  favoritesCount: number
  exclusivesCount: number
}

export function SidebarFooter({ 
  user, 
  userInitials, 
  isCollapsed, 
  favoritesCount, 
  exclusivesCount 
}: SidebarFooterProps) {
  return (
    <div className="p-3">
      <SidebarUserInfo
        user={user}
        userInitials={userInitials}
        isCollapsed={isCollapsed}
        favoritesCount={favoritesCount}
        exclusivesCount={exclusivesCount}
      />
    </div>
  )
}
