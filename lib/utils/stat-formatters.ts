import { STAT_FORMATTER_CONSTANTS } from '@/app/(private)/players/[playerId]/_constants/stat-formatters'

export function formatCategoryName(category: string): string {
  return STAT_FORMATTER_CONSTANTS.CATEGORY_TRANSLATIONS[category as keyof typeof STAT_FORMATTER_CONSTANTS.CATEGORY_TRANSLATIONS] || category
}

export function getCategoryIcon(category: string): string {
  return STAT_FORMATTER_CONSTANTS.CATEGORY_ICONS[category as keyof typeof STAT_FORMATTER_CONSTANTS.CATEGORY_ICONS] || STAT_FORMATTER_CONSTANTS.DEFAULTS.ICON
}

export function getCategoryColor(category: string): string {
  return STAT_FORMATTER_CONSTANTS.CATEGORY_COLORS[category as keyof typeof STAT_FORMATTER_CONSTANTS.CATEGORY_COLORS] || STAT_FORMATTER_CONSTANTS.DEFAULTS.COLOR
}

export function getCategoryIconColor(category: string): string {
  return STAT_FORMATTER_CONSTANTS.CATEGORY_ICON_COLORS[category as keyof typeof STAT_FORMATTER_CONSTANTS.CATEGORY_ICON_COLORS] || STAT_FORMATTER_CONSTANTS.DEFAULTS.ICON_COLOR
}

export function getCategoryBackgroundColor(category: string): string {
  return STAT_FORMATTER_CONSTANTS.CATEGORY_BACKGROUND_COLORS[category as keyof typeof STAT_FORMATTER_CONSTANTS.CATEGORY_BACKGROUND_COLORS] || STAT_FORMATTER_CONSTANTS.DEFAULTS.BACKGROUND_COLOR
}