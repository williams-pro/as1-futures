"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SidebarToggleButtonProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function SidebarToggleButton({ isCollapsed, onToggle }: SidebarToggleButtonProps) {
  return (
    <div className="hidden md:block fixed -right-3.5 top-14 z-50 pointer-events-auto" 
         style={{ left: isCollapsed ? 'calc(5rem - 14px)' : 'calc(16rem - 14px)' }}>
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className="h-7 w-7 rounded-full border-2 border-border bg-background shadow-sm hover:bg-accent hover:border-primary transition-all duration-200"
      >
        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </Button>
    </div>
  )
}