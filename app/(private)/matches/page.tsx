"use client"

import { MatchCard } from "./_components/match-card"
import { MatchesFilter } from "./_components/matches-filter"
import { useMatchesFilter } from "./_hooks/use-matches-filter"
import { Video } from "lucide-react"
import { MATCHES_TEXTS } from "./_constants/matches"

export default function MatchesPage() {
  const { selectedStatus, setSelectedStatus, filteredMatches } = useMatchesFilter()

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">{MATCHES_TEXTS.UI.PAGE_TITLE}</h1>
          <p className="mt-2 text-muted-foreground">{MATCHES_TEXTS.UI.PAGE_DESCRIPTION}</p>
        </div>

        <MatchesFilter
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          resultCount={filteredMatches.length}
        />

        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
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
