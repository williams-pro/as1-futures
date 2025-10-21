import { cn } from "@/lib/utils"
import { getPerformanceColor } from "@/lib/utils/performance-colors"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PLAYER_STATS_TEXTS } from "../_constants/player-stats"

interface PerformanceBarProps {
  percentile: number
}

export function PerformanceBar({ percentile }: PerformanceBarProps) {
  const { bg, text } = getPerformanceColor(percentile)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`${PLAYER_STATS_TEXTS.PERFORMANCE.BAR.CONTAINER_CLASSES} ${PLAYER_STATS_TEXTS.PERFORMANCE.BAR.BACKGROUND_COLOR} ${PLAYER_STATS_TEXTS.PERFORMANCE.BAR.HEIGHT_MOBILE} ${PLAYER_STATS_TEXTS.PERFORMANCE.BAR.HEIGHT_DESKTOP} ${PLAYER_STATS_TEXTS.PERFORMANCE.BAR.SHADOW}`}>
            <div
              className={cn(`${PLAYER_STATS_TEXTS.PERFORMANCE.BAR.HEIGHT_MOBILE} ${PLAYER_STATS_TEXTS.PERFORMANCE.BAR.HEIGHT_DESKTOP} ${PLAYER_STATS_TEXTS.PERFORMANCE.BAR.BAR_CLASSES} ${PLAYER_STATS_TEXTS.PERFORMANCE.BAR.TRANSITION} ${PLAYER_STATS_TEXTS.PERFORMANCE.BAR.SHADOW_SM}`, bg)}
              style={{ width: `${percentile}%` }}
            ></div>
            <span className={cn(`${PLAYER_STATS_TEXTS.PERFORMANCE.BAR.TEXT_CLASSES} ${PLAYER_STATS_TEXTS.PERFORMANCE.BAR.TEXT_SHADOW}`, text)}>
              {percentile}%
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{PLAYER_STATS_TEXTS.PERFORMANCE.TOOLTIP(percentile)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}