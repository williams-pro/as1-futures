import { TeamsPageWrapper } from "./_components/teams-page-wrapper"
import { TEAMS_TEXTS } from "./_constants"

export default function TeamsPage() {
  return (
    <TeamsPageWrapper 
      title={TEAMS_TEXTS.PAGE.TITLE}
      statsText={TEAMS_TEXTS.STATS.TOURNAMENT_GROUPS}
    />
  )
}
