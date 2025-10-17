"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Trophy, 
  Users, 
  User, 
  Calendar, 
  Plus,
  BarChart3,
  Settings,
  Star
} from 'lucide-react'
import { Tournament, Team, Player, TournamentGroup } from '@/lib/types/admin.types'
import { getTournaments } from '@/app/actions/admin/tournaments/get-tournaments'
import { getTeams } from '@/app/actions/admin/teams/get-teams'
import { getPlayers } from '@/app/actions/admin/players/get-players'
import { getMatches } from '@/app/actions/admin/matches/get-matches'
import { getScouts } from '@/app/actions/admin/scouts/get-scouts'
import { getSpecialMatches } from '@/app/actions/admin/special-matches'
import { TeamActions } from './team-actions'
import { PlayerActions } from './player-actions'
import { TeamEditForm } from './team-edit-form'
import { PlayerEditForm } from './player-edit-form'
import { PlayerCreateForm } from './player-create-form'
import { MatchCreateForm } from './match-create-form'
import { MatchEditForm } from './match-edit-form'
import { MatchActions } from './match-actions'
import { ScoutCreateForm } from './scout-create-form'
import { ScoutEditForm } from './scout-edit-form'
import { ScoutActions } from './scout-actions'
import { PlayersSearch } from './players-search'
import { SpecialMatchCard } from './special-match-card'
import { SpecialMatchForm } from './special-match-form'
import type { SpecialMatchWithTeams } from '@/lib/types/special-matches.types'
import { logger } from '@/lib/logger'
import { useToast } from '@/hooks/use-toast'
import { formatDateForDisplay } from '@/lib/utils/date-utils'

interface AdminMatch {
  id: string
  match_code: string
  tournament: { id: string; name: string; year: number }
  group: { id: string; name: string; code: string }
  home_team: { id: string; name: string; team_code: string; logo_url?: string; is_as1_team: boolean }
  away_team: { id: string; name: string; team_code: string; logo_url?: string; is_as1_team: boolean }
  match_date: string
  match_time: string
  video_url?: string
  created_at: string
  updated_at: string
}

interface AdminScout {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  role: 'scout' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
  last_login?: string
}

interface AdminDashboardProps {
  initialTournaments?: Tournament[]
  initialTeams?: Team[]
  initialPlayers?: Player[]
  initialMatches?: AdminMatch[]
  initialScouts?: AdminScout[]
  initialSpecialMatches?: SpecialMatchWithTeams[]
}

export function AdminDashboard({ 
  initialTournaments = [], 
  initialTeams = [], 
  initialPlayers = [],
  initialMatches = [],
  initialScouts = [],
  initialSpecialMatches = []
}: AdminDashboardProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments)
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>(initialPlayers)
  const [matches, setMatches] = useState<AdminMatch[]>(initialMatches)
  const [scouts, setScouts] = useState<AdminScout[]>(initialScouts)
  const [specialMatches, setSpecialMatches] = useState<SpecialMatchWithTeams[]>(initialSpecialMatches)
  const [loading, setLoading] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [creatingPlayer, setCreatingPlayer] = useState(false)
  const [creatingMatch, setCreatingMatch] = useState(false)
  const [creatingScout, setCreatingScout] = useState(false)
  const [editingMatch, setEditingMatch] = useState<AdminMatch | null>(null)
  const [editingScout, setEditingScout] = useState<AdminScout | null>(null)
  const [creatingSpecialMatch, setCreatingSpecialMatch] = useState(false)
  const [editingSpecialMatch, setEditingSpecialMatch] = useState<SpecialMatchWithTeams | null>(null)
  const [groups, setGroups] = useState<TournamentGroup[]>([])
  const { toast } = useToast()

  const fetchData = async () => {
    setLoading(true)
    try {
      logger.database('ADMIN_DASHBOARD', 'Fetching dashboard data')
      
      const [tournamentsResult, teamsResult, playersResult, matchesResult, scoutsResult, specialMatchesResult] = await Promise.all([
        getTournaments(),
        getTeams(),
        getPlayers(),
        getMatches(),
        getScouts(),
        getSpecialMatches()
      ])

      if (tournamentsResult.success) {
        setTournaments(tournamentsResult.data || [])
      }

      if (teamsResult.success) {
        setTeams(teamsResult.data || [])
      }

      if (playersResult.success) {
        const playersData = playersResult.data || []
        setPlayers(playersData)
        setFilteredPlayers(playersData)
      }

      if (matchesResult.success) {
        setMatches(matchesResult.data || [])
      }

      if (scoutsResult.success) {
        setScouts(scoutsResult.data || [])
      }

      if (specialMatchesResult.success) {
        setSpecialMatches(specialMatchesResult.matches || [])
      }

      logger.database('ADMIN_DASHBOARD', 'Dashboard data fetched successfully')
    } catch (error) {
      logger.error('Failed to fetch dashboard data', { operation: 'ADMIN_DASHBOARD' }, error as Error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialTournaments.length === 0 && initialTeams.length === 0 && initialPlayers.length === 0 && initialMatches.length === 0 && initialScouts.length === 0) {
      fetchData()
    }
  }, [])

  // Extraer grupos de los torneos
  useEffect(() => {
    const allGroups: TournamentGroup[] = []
    tournaments.forEach(tournament => {
      // Aquí podrías hacer una llamada para obtener los grupos del torneo
      // Por ahora, asumimos que los grupos están en los equipos
    })
    setGroups(allGroups)
  }, [tournaments])

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team)
  }

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player)
  }

  const handleTeamUpdated = () => {
    setEditingTeam(null)
    fetchData()
  }

  const handlePlayerUpdated = () => {
    setEditingPlayer(null)
    fetchData()
  }

  const handleFilteredPlayers = (filtered: Player[]) => {
    setFilteredPlayers(filtered)
  }

  const handleTeamDeleted = () => {
    fetchData()
  }

  const handlePlayerDeleted = () => {
    fetchData()
  }

  const handleCreatePlayer = () => {
    setCreatingPlayer(true)
  }

  const handlePlayerCreated = () => {
    setCreatingPlayer(false)
    fetchData()
  }

  const handleCreateMatch = () => {
    setCreatingMatch(true)
  }

  const handleMatchCreated = () => {
    setCreatingMatch(false)
    fetchData()
  }

  const handleCreateScout = () => {
    setCreatingScout(true)
  }

  const handleScoutCreated = () => {
    setCreatingScout(false)
    fetchData()
  }

  const handleEditMatch = (match: AdminMatch) => {
    setEditingMatch(match)
  }

  const handleMatchUpdated = () => {
    setEditingMatch(null)
    fetchData()
  }

  const handleMatchDeleted = () => {
    fetchData()
  }

  // Special Matches handlers
  const handleCreateSpecialMatch = () => {
    setCreatingSpecialMatch(true)
  }

  const handleSpecialMatchCreated = () => {
    setCreatingSpecialMatch(false)
    fetchData()
  }

  const handleEditSpecialMatch = (match: SpecialMatchWithTeams) => {
    setEditingSpecialMatch(match)
  }

  const handleSpecialMatchUpdated = () => {
    setEditingSpecialMatch(null)
    fetchData()
  }

  const handleSpecialMatchDeleted = () => {
    fetchData()
  }

  const handleEditScout = (scout: AdminScout) => {
    setEditingScout(scout)
  }

  const handleScoutUpdated = () => {
    setEditingScout(null)
    fetchData()
  }

  const handleScoutDeleted = () => {
    fetchData()
  }

  const activeTournaments = tournaments.filter(t => t.status === 'active')
  const totalTeams = teams.length
  const totalPlayers = players.length
  const totalMatches = matches.length + specialMatches.length
  const totalScouts = scouts.length
  const activeScouts = scouts.filter(s => s.is_active).length
  const as1Teams = teams.filter(t => t.is_as1_team).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage tournaments, teams, and players
          </p>
        </div>
        <Button onClick={fetchData} disabled={loading}>
          <BarChart3 className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTournaments.length}</div>
            <p className="text-xs text-muted-foreground">
              {tournaments.length} total tournaments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeams}</div>
            <p className="text-xs text-muted-foreground">
              {as1Teams} AS1 teams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlayers}</div>
            <p className="text-xs text-muted-foreground">
              Across all teams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMatches}</div>
            <p className="text-xs text-muted-foreground">
              Across all tournaments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scouts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeScouts}</div>
            <p className="text-xs text-muted-foreground">
              {totalScouts} total scouts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tournaments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tournaments" className="cursor-pointer">Tournaments</TabsTrigger>
          <TabsTrigger value="teams" className="cursor-pointer">Teams</TabsTrigger>
          <TabsTrigger value="players" className="cursor-pointer">Players</TabsTrigger>
          <TabsTrigger value="matches" className="cursor-pointer">Matches</TabsTrigger>
          <TabsTrigger value="special-matches" className="cursor-pointer">Special Matches</TabsTrigger>
          <TabsTrigger value="scouts" className="cursor-pointer">Scouts</TabsTrigger>
          <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tournaments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Tournaments</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Tournament
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <Card key={tournament.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tournament.name}</CardTitle>
                    <Badge variant={tournament.status === 'active' ? 'default' : 'secondary'}>
                      {tournament.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {tournament.season} {tournament.year}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {tournament.start_date} - {tournament.end_date}
                    </div>
                    <div className="text-sm">
                      {tournament.max_groups} groups • {tournament.teams_per_group} teams per group
                    </div>
                    {tournament.description && (
                      <p className="text-sm text-muted-foreground">
                        {tournament.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Teams</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Team
            </Button>
          </div>
          
          {editingTeam ? (
            <TeamEditForm
              team={editingTeam}
              groups={groups}
              onSuccess={handleTeamUpdated}
              onCancel={() => setEditingTeam(null)}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <Card key={team.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {team.is_as1_team && (
                          <Badge variant="default">AS1</Badge>
                        )}
                        <TeamActions
                          team={team}
                          onEdit={() => handleEditTeam(team)}
                          onDeleted={handleTeamDeleted}
                        />
                      </div>
                    </div>
                    <CardDescription>
                      {team.team_code} • {team.group?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {team.logo_url && (
                      <div className="mb-4">
                        <img 
                          src={team.logo_url} 
                          alt={`${team.name} logo`}
                          className="h-16 w-16 object-contain rounded"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="players" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Players</h2>
            <Button onClick={handleCreatePlayer} disabled={creatingPlayer}>
              <Plus className="mr-2 h-4 w-4" />
              New Player
            </Button>
          </div>
          
          {creatingPlayer ? (
            <PlayerCreateForm
              teams={teams}
              onSuccess={handlePlayerCreated}
              onCancel={() => setCreatingPlayer(false)}
            />
          ) : editingPlayer ? (
            <PlayerEditForm
              player={editingPlayer}
              onSuccess={handlePlayerUpdated}
              onCancel={() => setEditingPlayer(null)}
            />
          ) : (
            <>
              <PlayersSearch
                players={players}
                onFilteredPlayers={handleFilteredPlayers}
              />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlayers.map((player) => (
                <Card key={player.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {player.first_name} {player.last_name}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">#{player.jersey_number}</Badge>
                        <PlayerActions
                          player={player}
                          onEdit={() => handleEditPlayer(player)}
                          onDeleted={handlePlayerDeleted}
                        />
                      </div>
                    </div>
                    <CardDescription>
                      {player.position} • {player.team?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        {player.dominant_foot} foot • {player.height_cm}cm
                      </div>
                      <div className="text-sm">
                        Born: {formatDateForDisplay(player.date_of_birth)}
                      </div>
                      {player.photo_url && (
                        <div className="mt-4">
                          <img 
                            src={player.photo_url} 
                            alt={`${player.first_name} ${player.last_name}`}
                            className="h-20 w-20 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Matches</h2>
            <Button onClick={handleCreateMatch} disabled={creatingMatch}>
              <Plus className="mr-2 h-4 w-4" />
              New Match
            </Button>
          </div>
          
          {creatingMatch ? (
            <MatchCreateForm
              onSuccess={handleMatchCreated}
              onCancel={() => setCreatingMatch(false)}
            />
          ) : editingMatch ? (
            <MatchEditForm
              match={editingMatch}
              onSuccess={handleMatchUpdated}
              onCancel={() => setEditingMatch(null)}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {matches.map((match) => (
                <Card key={match.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{match.match_code}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {match.group.code}
                        </Badge>
                        <MatchActions
                          match={match}
                          onEdit={() => handleEditMatch(match)}
                          onDeleted={handleMatchDeleted}
                        />
                      </div>
                    </div>
                    <CardDescription>
                      {match.tournament.name} ({match.tournament.year})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium">{match.home_team.name}</div>
                          {match.home_team.is_as1_team && (
                            <Badge variant="default" className="text-xs">AS1</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">vs</div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium">{match.away_team.name}</div>
                          {match.away_team.is_as1_team && (
                            <Badge variant="default" className="text-xs">AS1</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateForDisplay(match.match_date)} at {match.match_time}
                      </div>
                      {match.video_url && (
                        <div className="text-sm text-blue-600">
                          Video available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="special-matches" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Special Matches</h2>
            <Button onClick={handleCreateSpecialMatch} disabled={creatingSpecialMatch}>
              <Plus className="mr-2 h-4 w-4" />
              New Special Match
            </Button>
          </div>
          
          {creatingSpecialMatch ? (
            <SpecialMatchForm
              tournamentId={tournaments[0]?.id || ''}
              onSuccess={handleSpecialMatchCreated}
              onCancel={() => setCreatingSpecialMatch(false)}
            />
          ) : editingSpecialMatch ? (
            <SpecialMatchForm
              tournamentId={editingSpecialMatch.tournament_id}
              match={editingSpecialMatch}
              onSuccess={handleSpecialMatchUpdated}
              onCancel={() => setEditingSpecialMatch(null)}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {specialMatches.map((match) => (
                <SpecialMatchCard
                  key={match.id}
                  match={match}
                  onEdit={handleEditSpecialMatch}
                  onDelete={handleSpecialMatchDeleted}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="scouts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Scouts</h2>
            <Button onClick={handleCreateScout} disabled={creatingScout}>
              <Plus className="mr-2 h-4 w-4" />
              New Scout
            </Button>
          </div>
          
          {creatingScout ? (
            <ScoutCreateForm
              onSuccess={handleScoutCreated}
              onCancel={() => setCreatingScout(false)}
            />
          ) : editingScout ? (
            <ScoutEditForm
              scout={editingScout}
              onSuccess={handleScoutUpdated}
              onCancel={() => setEditingScout(null)}
            />
          ) : scouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No scouts found. Create your first scout to get started.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {scouts.map((scout) => (
                <Card key={scout.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{scout.full_name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant={scout.role === 'admin' ? 'default' : 'secondary'}>
                          {scout.role}
                        </Badge>
                        <Badge variant={scout.is_active ? 'default' : 'destructive'}>
                          {scout.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <ScoutActions
                          scout={scout}
                          onEdit={() => handleEditScout(scout)}
                          onDeleted={handleScoutDeleted}
                        />
                      </div>
                    </div>
                    <CardDescription>
                      {scout.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Created: {formatDateForDisplay(scout.created_at)}
                      </div>
                      {scout.last_login && (
                        <div className="text-sm text-muted-foreground">
                          Last login: {formatDateForDisplay(scout.last_login)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Settings</h2>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Settings panel coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
