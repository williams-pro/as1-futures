import { 
  Target, 
  Zap, 
  Shield, 
  Activity, 
  Crosshair, 
  Wind, 
  ArrowRight, 
  Move, 
  Circle, 
  Swords, 
  BarChart3,
  Sword,
  Goal,
  Flag
} from "lucide-react"
import { getCategoryIcon, getCategoryIconColor } from "@/lib/utils/stat-formatters"
import { cn } from "@/lib/utils"
import { CATEGORY_ICON_CONSTANTS, IconName } from "../_constants/category-icon"

interface CategoryIconProps {
  category: string
  className?: string
  colored?: boolean
}

const iconMap = {
  'Target': Target,
  'Zap': Zap,
  'Shield': Shield,
  'Activity': Activity,
  'Crosshair': Crosshair,
  'Wind': Wind,
  'ArrowRight': ArrowRight,
  'Move': Move,
  'Circle': Circle,
  'Swords': Swords,
  'BarChart3': BarChart3,
  'Sword': Sword, // Para ATTACKING
  'Goal': Goal, // Para GOALKEEPING
  'Flag': Flag // Para SET PIECES
} as const

export function CategoryIcon({ 
  category, 
  className = CATEGORY_ICON_CONSTANTS.DEFAULTS.CLASS_NAME, 
  colored = CATEGORY_ICON_CONSTANTS.DEFAULTS.COLORED 
}: CategoryIconProps) {
  const iconName = getCategoryIcon(category) as IconName
  const IconComponent = iconMap[iconName] || BarChart3
  const iconColor = colored ? getCategoryIconColor(category) : ""

  return <IconComponent className={cn(className, iconColor)} />
}
