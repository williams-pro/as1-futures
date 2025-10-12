import type React from "react"

export interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: ("scout" | "admin")[]
  visible?: boolean // Optional property to hide menu items while keeping them in code
}
