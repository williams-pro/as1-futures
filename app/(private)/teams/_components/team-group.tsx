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

      <div className="flex flex-wrap gap-4 mx-auto">
        {teams.map((team) => (
          <div key={team.id} className="min-w-[280px] flex-1 max-w-[320px]">
            <TeamCard team={team} />
          </div>
        ))}
      </div>
    </div>
  )
}
