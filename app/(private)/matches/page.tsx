"use client"

import { MatchCard } from "./_components/match-card"
import { MatchesFilter } from "./_components/matches-filter"
import { useMatchesFilter } from "./_hooks/use-matches-filter"
import { Video, Loader2, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MATCHES_TEXTS } from "./_constants/matches"

export default function MatchesPage() {
  const { selectedGroup, setSelectedGroup, filteredMatches, loading, error } = useMatchesFilter()

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">{MATCHES_TEXTS.UI.PAGE_TITLE}</h1>
          <p className="mt-2 text-muted-foreground">{MATCHES_TEXTS.UI.PAGE_DESCRIPTION}</p>
        </div>

        <Skeleton className="h-16 w-full" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">{MATCHES_TEXTS.UI.PAGE_TITLE}</h1>
          <p className="mt-2 text-muted-foreground">{MATCHES_TEXTS.UI.PAGE_DESCRIPTION}</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load matches: {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">{MATCHES_TEXTS.UI.PAGE_TITLE}</h1>
          <p className="mt-2 text-muted-foreground">{MATCHES_TEXTS.UI.PAGE_DESCRIPTION}</p>
        </div>

        <MatchesFilter
          selectedGroup={selectedGroup}
          onGroupChange={setSelectedGroup}
          resultCount={filteredMatches.length}
        />

        {filteredMatches.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-start">
            {filteredMatches.map((match) => (
              <div key={match.id} className="w-full xl:w-[calc(50%-0.5rem)] sm:min-w-[320px] max-w-[800px]">
                <MatchCard match={match} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-6">
              <Video className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">{MATCHES_TEXTS.UI.NO_MATCHES_TITLE}</h3>
            <p className="text-muted-foreground">{MATCHES_TEXTS.UI.NO_MATCHES_DESCRIPTION}</p>
          </div>
        )}
      </div>
  )
}
