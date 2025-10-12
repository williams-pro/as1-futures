"use client"

import { SidebarProvider as ShadcnSidebarProvider } from "@/components/ui/sidebar"

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SidebarProvider({ 
  children, 
  defaultOpen = true, 
  open, 
  onOpenChange 
}: SidebarProviderProps) {
  return (
    <ShadcnSidebarProvider
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </ShadcnSidebarProvider>
  )
}
