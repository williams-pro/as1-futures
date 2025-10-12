import { Logo } from "@/components/shared/logo"
import { LogoCollapsed } from "@/components/shared/logo-collapsed"

interface SidebarLogoHeaderProps {
  isCollapsed: boolean
}

export function SidebarLogoHeader({ isCollapsed }: SidebarLogoHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-center px-4 flex-shrink-0">
      {isCollapsed ? (
        <LogoCollapsed size="sm" className="h-10 w-10" />
      ) : (
        <Logo size="sm" className="h-12 w-24" />
      )}
    </div>
  )
}
