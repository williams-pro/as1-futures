"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarToggleButtonProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function SidebarToggleButton({ isCollapsed, onToggle }: SidebarToggleButtonProps) {
  return (
    <div className="absolute -right-3.5 top-14 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className={cn(
          "h-7 w-7 rounded-full border-2 border-slate-200 bg-white shadow-md",
          "hover:bg-as1-gold/10 hover:border-as1-gold transition-all duration-200",
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
        )}
      </Button>
    </div>
  )
}
