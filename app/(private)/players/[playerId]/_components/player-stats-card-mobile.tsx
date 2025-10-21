"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePlayerStats } from "../_hooks/use-player-stats"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useMemo } from "react"
import { formatCategoryName, getCategoryColor, getCategoryBackgroundColor } from "@/lib/utils/stat-formatters"
import { StatsCategoryContent } from "./stats-category-content"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CategoryIcon } from "./category-icon"
import { PLAYER_STATS_TEXTS } from "../_constants/player-stats"

interface PlayerStatsCardMobileProps {
  playerId: string
}

export function PlayerStatsCardMobile({ playerId }: PlayerStatsCardMobileProps) {
  const { stats, loading, error } = usePlayerStats(playerId)
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)

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


  const nextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1)
    }
  }

  const prevCategory = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1)
    }
  }

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

  const currentCategory = categories[currentCategoryIndex]

  return (
    <Card>
      <CardHeader>
        <CardTitle className={PLAYER_STATS_TEXTS.UI.CARD.TITLE_CLASSES}>
          {PLAYER_STATS_TEXTS.UI.CARD.ICON} {PLAYER_STATS_TEXTS.UI.TITLE}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile Category Navigation */}
        <div className={PLAYER_STATS_TEXTS.UI.MOBILE.NAVIGATION_CONTAINER}>
          <Button
            variant="outline"
            size="sm"
            onClick={prevCategory}
            disabled={currentCategoryIndex === 0}
            className={PLAYER_STATS_TEXTS.UI.MOBILE.BUTTON_CLASSES}
            aria-label={PLAYER_STATS_TEXTS.UI.MOBILE_NAVIGATION.PREVIOUS}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className={PLAYER_STATS_TEXTS.UI.MOBILE.CATEGORY_DISPLAY}>
            <div className={PLAYER_STATS_TEXTS.UI.MOBILE.CATEGORY_CARD}>
              <div className={PLAYER_STATS_TEXTS.UI.MOBILE.CATEGORY_HEADER}>
                <div className={PLAYER_STATS_TEXTS.UI.MOBILE.CATEGORY_ICON_CONTAINER}>
                  <CategoryIcon category={currentCategory.name} className={PLAYER_STATS_TEXTS.UI.MOBILE.CATEGORY_ICON_CLASSES} />
                </div>
                <span className={PLAYER_STATS_TEXTS.UI.MOBILE.CATEGORY_NAME}>{currentCategory.displayName}</span>
              </div>
              <div className={PLAYER_STATS_TEXTS.UI.MOBILE.CATEGORY_COUNTER}>
                {PLAYER_STATS_TEXTS.UI.MOBILE_NAVIGATION.CATEGORY_COUNTER(currentCategoryIndex + 1, categories.length)}
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextCategory}
            disabled={currentCategoryIndex === categories.length - 1}
            className={PLAYER_STATS_TEXTS.UI.MOBILE.BUTTON_CLASSES}
            aria-label={PLAYER_STATS_TEXTS.UI.MOBILE_NAVIGATION.NEXT}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Category Indicators */}
        <div className={PLAYER_STATS_TEXTS.UI.MOBILE.INDICATORS_CONTAINER}>
          {categories.map((_, index) => (
            <div
              key={index}
              className={`${PLAYER_STATS_TEXTS.UI.MOBILE.INDICATOR_BUTTON} ${
                index === currentCategoryIndex 
                  ? PLAYER_STATS_TEXTS.UI.MOBILE.INDICATOR_ACTIVE
                  : PLAYER_STATS_TEXTS.UI.MOBILE.INDICATOR_INACTIVE
              }`}
            />
          ))}
        </div>
        
        {/* Current Category Content */}
        <StatsCategoryContent 
          category={currentCategory} 
          stats={currentCategory.stats} 
        />
      </CardContent>
    </Card>
  )
}
