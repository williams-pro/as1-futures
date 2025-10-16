import { AdminDashboard } from './_components/admin-dashboard'
import { getTournaments } from '@/app/actions/admin/tournaments/get-tournaments'
import { getTeams } from '@/app/actions/admin/teams/get-teams'
import { getPlayers } from '@/app/actions/admin/players/get-players'
import { getMatches } from '@/app/actions/admin/matches/get-matches'
import { getScouts } from '@/app/actions/admin/scouts/get-scouts'

export default async function AdminPage() {
  // Fetch initial data server-side
  const [tournamentsResult, teamsResult, playersResult, matchesResult, scoutsResult] = await Promise.all([
    getTournaments(),
    getTeams(),
    getPlayers(),
    getMatches(),
    getScouts()
  ])

  return (
    <AdminDashboard
      initialTournaments={tournamentsResult.success ? tournamentsResult.data || [] : []}
      initialTeams={teamsResult.success ? teamsResult.data || [] : []}
      initialPlayers={playersResult.success ? playersResult.data || [] : []}
      initialMatches={matchesResult.success ? matchesResult.data || [] : []}
      initialScouts={scoutsResult.success ? scoutsResult.data || [] : []}
    />
  )
}