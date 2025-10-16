'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { TeamGroup } from "./team-group"
import { useTournamentGroups } from "../_hooks/use-tournament-groups"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import type { GroupType } from "@/lib/types"

interface TeamsPageWrapperProps {
  title: string
  statsText: string
}

export function TeamsPageWrapper({ title, statsText }: TeamsPageWrapperProps) {
  const { groups, loading, error } = useTournamentGroups()

  // Generar tabs dinámicamente basado en los grupos de la base de datos
  const generateTabsData = () => {
    if (!groups.length) return []

    const allTab = {
      value: "all",
      label: "All Groups",
      group: null,
    }

    const groupTabs = groups.map(group => ({
      value: group.code.toLowerCase(),
      label: group.name,
      group: group.code,
    }))

    return [allTab, ...groupTabs]
  }

  const tabsData = generateTabsData()

  if (loading) {
    return (
      <div className={cn("space-y-8")}>
        {/* Header Section */}
        <div className={cn("text-left space-y-4")}>
          <div className={cn("space-y-3")}>
            <h1 className={cn("text-4xl font-light tracking-tight text-foreground")}>
              {title}
            </h1>
          </div>
        </div>

        {/* Divider */}
        <div className={cn("h-px bg-gradient-to-r from-transparent via-border/30 to-transparent")} />

        {/* Loading Tabs */}
        <div className={cn("flex justify-center")}>
          <div className={cn("inline-flex h-11 items-center gap-2 p-1.5 bg-muted/30 rounded-xl border border-border/30")}>
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>

        {/* Loading Content */}
        <div className={cn("mt-8 space-y-8")}>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Loading Groups</h2>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm text-muted-foreground">Loading tournament groups...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("space-y-8")}>
        {/* Header Section */}
        <div className={cn("text-left space-y-4")}>
          <div className={cn("space-y-3")}>
            <h1 className={cn("text-4xl font-light tracking-tight text-foreground")}>
              {title}
            </h1>
          </div>
        </div>

        {/* Divider */}
        <div className={cn("h-px bg-gradient-to-r from-transparent via-border/30 to-transparent")} />

        {/* Error Content */}
        <div className={cn("mt-8")}>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load tournament groups: {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-8")}>
      {/* Header Section */}
      <div className={cn("text-left space-y-4")}>
        <div className={cn("space-y-3")}>
          <h1 className={cn("text-4xl font-light tracking-tight text-foreground")}>
            {title}
          </h1>
        </div>
      </div>

      {/* Divider */}
      <div className={cn("h-px bg-gradient-to-r from-transparent via-border/30 to-transparent")} />

      {/* Tabs Section */}
      <div className={cn("flex justify-center")}>
        <Tabs defaultValue="all" className={cn("w-full")}>
          <div className={cn("flex justify-center")}>
            <TabsList className={cn(
              "inline-flex h-11 items-center gap-2 p-1.5 bg-muted/30 rounded-xl border border-border/30"
            )}>
              {tabsData.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "px-6 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer",
                    "data-[state=active]:bg-white data-[state=active]:shadow-sm",
                    "data-[state=active]:text-as1-charcoal data-[state=active]:border",
                    "data-[state=active]:border-as1-gold/20"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className={cn("mt-8")}>
            {tabsData.map((tab) => (
              <TabsContent 
                key={tab.value}
                value={tab.value} 
                className={cn("m-0", tab.value === "all" && "space-y-8")}
              >
                {tab.group ? (
                  <TeamGroup group={tab.group as GroupType} />
                ) : (
                  <TeamGroup group="all" />
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>

      {/* Stats Footer */}
      <div className={cn("flex items-center justify-center pt-8")}>
        <div className={cn("flex items-center gap-4 text-sm text-muted-foreground")}>
          <div className={cn("flex items-center gap-2")}>
            <div className={cn("w-1.5 h-1.5 bg-as1-gold rounded-full")} />
            <span>{statsText}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
