import { TeamGroup } from "./_components/team-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageContent } from "@/components/layout/page-content"

export default function TeamsPage() {
  return (
    <PageContent>
      <div className="space-y-8">
        {/* Header Section - Centrado y limpio */}
        <div className="text-left space-y-4">
          <div className="space-y-3">
            <h1 className="text-4xl font-light tracking-tight text-foreground">Teams</h1>
            <p className="text-lg text-muted-foreground font-light max-w-2xl">
              Browse teams organized by tournament groups
            </p>
          </div>
        </div>

        {/* Divider Sutil */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

        {/* Tabs Section - Centrado */}
        <div className="flex justify-center">
          <Tabs defaultValue="all" className="w-full max-w-4xl">
            <div className="flex justify-center">
              <TabsList className="inline-flex h-11 items-center gap-2 p-1.5 bg-muted/30 rounded-xl border border-border/30">
                <TabsTrigger
                  value="all"
                  className="px-6 py-2 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-as1-charcoal data-[state=active]:border data-[state=active]:border-as1-gold/20"
                >
                  All Groups
                </TabsTrigger>
                <TabsTrigger
                  value="a"
                  className="px-6 py-2 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-as1-charcoal data-[state=active]:border data-[state=active]:border-as1-gold/20"
                >
                  Group A
                </TabsTrigger>
                <TabsTrigger
                  value="b"
                  className="px-6 py-2 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-as1-charcoal data-[state=active]:border data-[state=active]:border-as1-gold/20"
                >
                  Group B
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Contents */}
            <div className="mt-8">
              <TabsContent value="all" className="space-y-8 m-0">
                <div className="space-y-8">
                  <TeamGroup group="A" />
                  <div className="h-px bg-gradient-to-r from-transparent via-border/20 to-transparent" />
                  <TeamGroup group="B" />
                </div>
              </TabsContent>

              <TabsContent value="a" className="m-0">
                <TeamGroup group="A" />
              </TabsContent>

              <TabsContent value="b" className="m-0">
                <TeamGroup group="B" />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Stats Footer Minimalista */}
        <div className="flex items-center justify-center pt-8">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-as1-gold rounded-full" />
              <span>2 Tournament Groups</span>
            </div>
          </div>
        </div>
      </div>
    </PageContent>
  )
}
