import { AdminDashboard } from './_components/admin-dashboard'
import { getTournaments } from '@/app/actions/admin/tournaments/get-tournaments'
import { getTeams } from '@/app/actions/admin/teams/get-teams'
import { getPlayers } from '@/app/actions/admin/players/get-players'

export default async function AdminPage() {
  // Fetch initial data server-side
  const [tournamentsResult, teamsResult, playersResult] = await Promise.all([
    getTournaments(),
    getTeams(),
    getPlayers()
  ])

  return (
    <AdminDashboard
      initialTournaments={tournamentsResult.success ? tournamentsResult.data || [] : []}
      initialTeams={teamsResult.success ? teamsResult.data || [] : []}
      initialPlayers={playersResult.success ? playersResult.data || [] : []}
    />
  )
}