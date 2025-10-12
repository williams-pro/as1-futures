"use client"

import { Logo } from "@/components/logo"
import { SidebarHeader as SidebarHeaderUI } from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"

export function SidebarHeader() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarHeaderUI className="border-b border-slate-200 h-16 flex items-center justify-center px-4">
      <Logo size="sm" collapsed={isCollapsed} />
    </SidebarHeaderUI>
  )
}
