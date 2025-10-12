import { Users, Star, Video, Settings, Shield } from "lucide-react"
import type { NavigationItem } from "../_types"

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: "Teams",
    href: "/teams",
    icon: Shield,
    roles: ["scout", "admin"],
    visible: true,
  },
  {
    name: "Players",
    href: "/players",
    icon: Users,
    roles: ["scout", "admin"],
    visible: false, // Hidden for now, may be enabled in future
  },
  {
    name: "My Favorites",
    href: "/favorites",
    icon: Star,
    roles: ["scout"],
    visible: true,
  },
  {
    name: "Matches",
    href: "/matches",
    icon: Video,
    roles: ["scout", "admin"],
    visible: true,
  },
  {
    name: "Admin",
    href: "/admin",
    icon: Settings,
    roles: ["admin"],
    visible: true,
  },
]
