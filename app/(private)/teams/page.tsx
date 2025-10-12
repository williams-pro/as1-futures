import { TeamGroup } from "./_components/team-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { TEAMS_TEXTS, TABS_DATA } from "./_constants"

export default function TeamsPage() {
  return (
    <>
      <div className={cn("space-y-8")}>
        {/* Header Section - Centrado y limpio */}
        <div className={cn("text-left space-y-4")}>
          <div className={cn("space-y-3")}>
            <h1 className={cn("text-4xl font-light tracking-tight text-foreground")}>
              {TEAMS_TEXTS.PAGE.TITLE}
            </h1>
            <p className={cn("text-lg text-muted-foreground font-light max-w-2xl")}>
              {TEAMS_TEXTS.PAGE.DESCRIPTION}
            </p>
          </div>
        </div>

        {/* Divider Sutil */}
        <div className={cn("h-px bg-gradient-to-r from-transparent via-border/30 to-transparent")} />

        {/* Tabs Section - Centrado */}
        <div className={cn("flex justify-center")}>
          <Tabs defaultValue="all" className={cn("w-full")}>
            <div className={cn("flex justify-center")}>
              <TabsList className={cn(
                "inline-flex h-11 items-center gap-2 p-1.5 bg-muted/30 rounded-xl border border-border/30"
              )}>
                {TABS_DATA.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "px-6 py-2 text-sm font-medium rounded-lg transition-all",
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
              {TABS_DATA.map((tab) => (
                <TabsContent 
                  key={tab.value}
                  value={tab.value} 
                  className={cn("m-0", tab.value === "all" && "space-y-8")}
                >
                  {tab.group ? (
                    <TeamGroup group={tab.group} />
                  ) : (
                    <div className={cn("space-y-8")}>
                      <TeamGroup group="A" />
                      <div className={cn("h-px bg-gradient-to-r from-transparent via-border/20 to-transparent")} />
                      <TeamGroup group="B" />
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>

        {/* Stats Footer Minimalista */}
        <div className={cn("flex items-center justify-center pt-8")}>
          <div className={cn("flex items-center gap-4 text-sm text-muted-foreground")}>
            <div className={cn("flex items-center gap-2")}>
              <div className={cn("w-1.5 h-1.5 bg-as1-gold rounded-full")} />
              <span>{TEAMS_TEXTS.STATS.TOURNAMENT_GROUPS}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
