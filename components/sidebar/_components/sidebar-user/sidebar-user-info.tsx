"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SkeletonCounter } from "@/components/ui/skeleton-counter"
import { cn } from "@/lib/utils"
import { Star, Gem, LogOut } from "lucide-react"
import { useState } from "react"
import { ConfirmDialog } from "@/app/(private)/favorites/_components/confirm-dialog"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import type { User } from '@supabase/supabase-js'

interface SidebarUserInfoProps {
  user: User | null
  userInitials: string
  isCollapsed: boolean
  favoritesCount?: number
  exclusivesCount?: number
  favoritesLoading?: boolean
}

export function SidebarUserInfo({
  user,
  userInitials,
  isCollapsed,
  favoritesCount = 0,
  exclusivesCount = 0,
  favoritesLoading = false,
}: SidebarUserInfoProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { logout } = useSupabaseAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      <div className="space-y-3">
        {/* User Info */}
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg bg-white border border-border/40 px-3 py-2.5",
            isCollapsed && "justify-center px-0",
          )}
        >
          <Avatar className="h-9 w-9 border-2 border-slate-200 flex-shrink-0">
            <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.email?.split('@')[0] || 'Usuario'}
              </p>
              <p className="truncate text-xs text-muted-foreground capitalize">scout</p>
            </div>
          )}
        </div>

        {/* Stats for Scouts */}
        {!isCollapsed && user && (
          <div className="rounded-lg border border-border/40 bg-white p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Star className="h-3 w-3 text-amber-500" />
                <span className="font-medium">Favorites</span>
              </div>
              {favoritesLoading ? (
                <SkeletonCounter className="h-4 w-6" />
              ) : (
                <span className="font-mono font-semibold text-foreground">{favoritesCount}</span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Gem className="h-3 w-3 text-as1-purple-500" />
                <span className="font-medium">Exclusives</span>
              </div>
              {favoritesLoading ? (
                <SkeletonCounter className="h-4 w-8" />
              ) : (
                <span className="font-mono font-semibold text-as1-purple-600">{exclusivesCount} / 3</span>
              )}
            </div>
          </div>
        )}

        {/* Logout Button - Always visible */}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all duration-200 mt-3 px-3 py-2",
            isCollapsed && "justify-center px-2",
          )}
          onClick={() => setShowLogoutDialog(true)}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Logout"}
        </Button>
      </div>

      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
        title="Logout"
        description="Are you sure you want to logout? Any unsaved changes will be lost."
        confirmText="Logout"
        cancelText="Cancel"
        variant="default"
      />
    </>
  )
}
