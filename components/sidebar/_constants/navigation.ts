import { Users, Star, Video, Settings, Shield, Home } from "lucide-react"
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
    visible: false,
  },
  {
    name: "Matches",
    href: "/matches",
    icon: Video,
    roles: ["scout", "admin"],
    visible: true,
  },
  {
    name: "My Favorites",
    href: "/favorites",
    icon: Star,
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
