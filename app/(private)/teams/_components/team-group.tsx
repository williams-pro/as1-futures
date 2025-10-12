import type { GroupType } from "@/lib/types"
import { TeamCard } from "./team-card"
import { useTeamData } from "../_hooks/use-team-data"

interface TeamGroupProps {
  group: GroupType
}

export function TeamGroup({ group }: TeamGroupProps) {
  const { teams } = useTeamData(group)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Group {group}</h2>
          <p className="text-sm text-muted-foreground">{teams.length} teams</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  )
}
