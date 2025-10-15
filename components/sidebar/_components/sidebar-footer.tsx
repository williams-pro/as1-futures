import { SidebarUserInfo } from "./sidebar-user"
import type { User } from '@supabase/supabase-js'

interface SidebarFooterProps {
  user: User | null
  userInitials: string
  isCollapsed: boolean
  favoritesCount?: number
  exclusivesCount?: number
  favoritesLoading?: boolean
}

export function SidebarFooter({ 
  user, 
  userInitials, 
  isCollapsed, 
  favoritesCount, 
  exclusivesCount,
  favoritesLoading = false
}: SidebarFooterProps) {
  return (
    <div className="p-3">
      <SidebarUserInfo
        user={user}
        userInitials={userInitials}
        isCollapsed={isCollapsed}
        favoritesCount={favoritesCount}
        exclusivesCount={exclusivesCount}
        favoritesLoading={favoritesLoading}
      />
    </div>
  )
}
