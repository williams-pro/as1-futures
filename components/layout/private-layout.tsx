"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AppSidebar } from "@/components/sidebar"
import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { SidebarToggleButton } from "@/components/sidebar"

interface PrivateLayoutWrapperProps {
  children: React.ReactNode
}

export function PrivateLayoutWrapper({ children }: PrivateLayoutWrapperProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { state, toggleSidebar } = useSidebar()

  const isCollapsed = state === "collapsed"

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-as1-primary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen w-full bg-gradient-as1-primary overflow-hidden">
      <AppSidebar />
      
      <SidebarInset className="flex-1 bg-gradient-as1-primary overflow-y-auto">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden -ml-1"
          >
            <Menu className="!h-9 !w-9" />
          </Button>
        </header>
        <main className="flex-1 p-4">
          {children}
        </main>
      </SidebarInset>

      {/* Custom Toggle Button - positioned outside the Sidebar component - Hidden on mobile */}
      <SidebarToggleButton 
        isCollapsed={isCollapsed} 
        onToggle={toggleSidebar} 
      />

    </div>
  )
}
