import { Card, CardContent } from "@/components/ui/card"
import { PerformanceBar } from "./performance-bar"
import { formatCategoryName, getCategoryBackgroundColor } from "@/lib/utils/stat-formatters"
import { CategoryIcon } from "./category-icon"
import { PLAYER_STATS_TEXTS } from "../_constants/player-stats"

interface StatsCategoryContentProps {
  category: {
    name: string
    displayName: string
    color: string
    backgroundColor: string
    stats: Array<{
      metric: string
      value_absolute: number
      value_relative: number
    }>
  }
  stats: Array<{
    metric: string
    value_absolute: number
    value_relative: number
  }>
}

export function StatsCategoryContent({ category, stats }: StatsCategoryContentProps) {
  return (
    <div className={PLAYER_STATS_TEXTS.UI.CATEGORY_CONTENT.GRID_CLASSES}>
      {stats.map((stat) => (
        <Card key={stat.metric} className={PLAYER_STATS_TEXTS.UI.CATEGORY_CONTENT.CARD_CLASSES}>
          <CardContent className={PLAYER_STATS_TEXTS.UI.CATEGORY_CONTENT.CARD_CONTENT_CLASSES}>
            <div>
              <div className={PLAYER_STATS_TEXTS.UI.CATEGORY_CONTENT.METRIC_HEADER}>
                <CategoryIcon category={category.name} className={PLAYER_STATS_TEXTS.UI.CATEGORY_CONTENT.METRIC_ICON_CLASSES} />
                <h4 className={PLAYER_STATS_TEXTS.UI.CATEGORY_CONTENT.METRIC_NAME}>{formatCategoryName(category.name)}</h4>
              </div>
              <p className={PLAYER_STATS_TEXTS.UI.CATEGORY_CONTENT.METRIC_VALUE}>{PLAYER_STATS_TEXTS.METRIC_FORMATTER.REPLACE_UNDERSCORES(stat.metric)}</p>
            </div>
            <div className={PLAYER_STATS_TEXTS.UI.CATEGORY_CONTENT.METRIC_DISPLAY}>
              <p className={PLAYER_STATS_TEXTS.UI.CATEGORY_CONTENT.METRIC_NUMBER}>{stat.value_absolute}</p>
              <PerformanceBar percentile={stat.value_relative} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}