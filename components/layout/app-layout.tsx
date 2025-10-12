"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useSidebarContext } from "@/contexts/sidebar-context"
import { AppSidebar } from "./app-sidebar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoading } = useAuth()
  const { isCollapsed } = useSidebarContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/") // La página de login está en la ruta raíz
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      <AppSidebar />
      <main className={cn("flex-1", isCollapsed ? "ml-20" : "ml-64")}>
        <div className="container mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
