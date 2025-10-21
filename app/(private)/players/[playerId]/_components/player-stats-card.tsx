"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePlayerStats } from "../_hooks/use-player-stats"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react"
import { formatCategoryName, getCategoryColor, getCategoryBackgroundColor } from "@/lib/utils/stat-formatters"
import { StatsCategoryContent } from "./stats-category-content"
import { PlayerStatsCardMobile } from "./player-stats-card-mobile"
import { CategoryIcon } from "./category-icon"
import { PLAYER_STATS_TEXTS } from "../_constants/player-stats"

interface PlayerStatsCardProps {
  playerId: string
}

export function PlayerStatsCard({ playerId }: PlayerStatsCardProps) {
  const { stats, loading, error } = usePlayerStats(playerId)

  const categories = useMemo(() => {
    if (!stats) return []
    
    const categoryMap = new Map()
    stats.forEach(stat => {
      if (!categoryMap.has(stat.category)) {
        categoryMap.set(stat.category, {
          name: stat.category,
          displayName: formatCategoryName(stat.category),
          color: getCategoryColor(stat.category),
          backgroundColor: getCategoryBackgroundColor(stat.category),
          stats: []
        })
      }
      categoryMap.get(stat.category).stats.push(stat)
    })
    
    return Array.from(categoryMap.values())
  }, [stats])


  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className={`${PLAYER_STATS_TEXTS.LOADING.SKELETON_TITLE_HEIGHT} ${PLAYER_STATS_TEXTS.LOADING.SKELETON_TITLE_WIDTH}`} />
        </CardHeader>
        <CardContent>
          <div className={PLAYER_STATS_TEXTS.LOADING.SKELETON_CONTAINER}>
            {Array.from({ length: PLAYER_STATS_TEXTS.LOADING.SKELETON_COUNT }).map((_, i) => (
              <Skeleton key={i} className={`${PLAYER_STATS_TEXTS.LOADING.SKELETON_HEIGHT} ${PLAYER_STATS_TEXTS.LOADING.SKELETON_WIDTH}`} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className={PLAYER_STATS_TEXTS.ERRORS.CONTAINER_CLASSES}>
          <p className={PLAYER_STATS_TEXTS.ERRORS.MESSAGE_CLASSES}>{PLAYER_STATS_TEXTS.UI.ERROR_MESSAGE} {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className={PLAYER_STATS_TEXTS.UI.NO_STATS_CONTAINER}>
          <p className={PLAYER_STATS_TEXTS.UI.NO_STATS_MESSAGE_CLASSES}>
            {PLAYER_STATS_TEXTS.UI.NO_STATS_MESSAGE}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Mobile Version - Hidden on larger screens */}
      <div className={PLAYER_STATS_TEXTS.UI.RESPONSIVE.DESKTOP_HIDDEN}>
        <PlayerStatsCardMobile playerId={playerId} />
      </div>
      
      {/* Desktop Version - Hidden on mobile */}
      <div className={PLAYER_STATS_TEXTS.UI.RESPONSIVE.MOBILE_HIDDEN}>
               <Card>
                 <CardHeader>
                   <CardTitle className={PLAYER_STATS_TEXTS.UI.CARD.TITLE_CLASSES}>
                     {PLAYER_STATS_TEXTS.UI.CARD.ICON} {PLAYER_STATS_TEXTS.UI.TITLE}
                   </CardTitle>
                 </CardHeader>
          <CardContent>
            <Tabs defaultValue={categories[0]?.name} className="w-full">
              <div className={PLAYER_STATS_TEXTS.UI.TABS.CONTAINER_CLASSES}>
                <TabsList className={PLAYER_STATS_TEXTS.UI.TABS.LIST_CLASSES}>
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.name} 
                      value={category.name} 
                      className={PLAYER_STATS_TEXTS.UI.TABS.TRIGGER_CLASSES}
                    >
                      <CategoryIcon category={category.name} className={PLAYER_STATS_TEXTS.UI.TABS.TRIGGER_ICON_CLASSES} />
                      <span className={PLAYER_STATS_TEXTS.UI.TABS.TRIGGER_TEXT_CLASSES}>{category.displayName}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {categories.map((category) => (
                <TabsContent key={category.name} value={category.name} className={PLAYER_STATS_TEXTS.UI.TABS.CONTENT_CLASSES}>
                  <StatsCategoryContent 
                    category={category} 
                    stats={category.stats} 
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  )
}