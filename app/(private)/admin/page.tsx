"use client"

import { useState } from "react"
import { ScoutManagement } from "./_components/scout-management"
import { DataManagementTabs } from "./_components/data-management-tabs"
import { MetricsDashboard } from "./_components/metrics-dashboard"
import { ReportsGenerator } from "./_components/reports-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, FileText, Database, Users } from "lucide-react"
import type { Scout, CSVImportResult, PlayerMetric, TeamMetric, ScoutActivityMetric } from "@/lib/types"

const mockScouts: Scout[] = [
  {
    id: "1",
    firstName: "Ana",
    lastName: "García",
    fullName: "Ana García",
    email: "ana.garcia@scout.com",
    isActive: true,
    lastLogin: "2025-01-09",
    favoritesCount: 12,
    exclusivesCount: 3,
    createdAt: "2025-01-01",
  },
  {
    id: "2",
    firstName: "Carlos",
    lastName: "López",
    fullName: "Carlos López",
    email: "carlos.lopez@talent.com",
    isActive: true,
    lastLogin: "2025-01-08",
    favoritesCount: 8,
    exclusivesCount: 2,
    createdAt: "2025-01-02",
  },
  {
    id: "3",
    firstName: "María",
    lastName: "Rodríguez",
    fullName: "María Rodríguez",
    email: "maria.rodriguez@scouting.com",
    isActive: false,
    lastLogin: undefined,
    favoritesCount: 0,
    exclusivesCount: 0,
    createdAt: "2025-01-03",
  },
]

const mockPlayerMetrics: PlayerMetric[] = [
  {
    playerId: "1",
    playerName: "Lucas Silva",
    teamName: "Great Farcos FC",
    favoritesCount: 5,
    exclusivesCount: 2,
    totalMarks: 7,
    scoutCount: 3,
    scouts: ["Ana García", "Carlos López", "María Rodríguez"],
    avgTimeOnPage: 145,
  },
  {
    playerId: "2",
    playerName: "Miguel Santos",
    teamName: "YAP FC",
    favoritesCount: 4,
    exclusivesCount: 1,
    totalMarks: 5,
    scoutCount: 2,
    scouts: ["Ana García", "Carlos López"],
    avgTimeOnPage: 132,
  },
  {
    playerId: "3",
    playerName: "Diego Fernández",
    teamName: "Águilas FC",
    favoritesCount: 3,
    exclusivesCount: 1,
    totalMarks: 4,
    scoutCount: 2,
    scouts: ["Carlos López", "María Rodríguez"],
    avgTimeOnPage: 98,
  },
  {
    playerId: "4",
    playerName: "João Costa",
    teamName: "Dragones Rojos",
    favoritesCount: 3,
    exclusivesCount: 0,
    totalMarks: 3,
    scoutCount: 1,
    scouts: ["Ana García"],
    avgTimeOnPage: 87,
  },
  {
    playerId: "5",
    playerName: "Rafael Gomes",
    teamName: "Great Farcos FC",
    favoritesCount: 2,
    exclusivesCount: 1,
    totalMarks: 3,
    scoutCount: 2,
    scouts: ["Ana García", "Carlos López"],
    avgTimeOnPage: 156,
  },
]

const mockTeamMetrics: TeamMetric[] = [
  {
    teamId: "1",
    teamName: "Great Farcos FC",
    group: "A",
    totalPlayers: 20,
    markedPlayers: 15,
    discoveryRate: 75.0,
  },
  {
    teamId: "2",
    teamName: "YAP FC",
    group: "B",
    totalPlayers: 22,
    markedPlayers: 14,
    discoveryRate: 63.6,
  },
  {
    teamId: "3",
    teamName: "Águilas FC",
    group: "B",
    totalPlayers: 21,
    markedPlayers: 12,
    discoveryRate: 57.1,
  },
  {
    teamId: "4",
    teamName: "Dragones Rojos",
    group: "A",
    totalPlayers: 19,
    markedPlayers: 10,
    discoveryRate: 52.6,
  },
]

const mockScoutActivityMetrics: ScoutActivityMetric[] = [
  {
    scoutId: "1",
    scoutName: "Ana García",
    email: "ana.garcia@scout.com",
    loginCount: 15,
    lastLogin: "2025-01-09",
    playersViewed: 45,
    favoritesAdded: 12,
    exclusivesAdded: 3,
    timeOnPlatform: 8.5,
  },
  {
    scoutId: "2",
    scoutName: "Carlos López",
    email: "carlos.lopez@talent.com",
    loginCount: 12,
    lastLogin: "2025-01-08",
    playersViewed: 38,
    favoritesAdded: 8,
    exclusivesAdded: 2,
    timeOnPlatform: 6.2,
  },
  {
    scoutId: "3",
    scoutName: "María Rodríguez",
    email: "maria.rodriguez@scouting.com",
    loginCount: 8,
    lastLogin: "2025-01-07",
    playersViewed: 25,
    favoritesAdded: 5,
    exclusivesAdded: 1,
    timeOnPlatform: 4.1,
  },
]

export default function AdminPage() {
  const [scouts, setScouts] = useState<Scout[]>(mockScouts)

  const handleAddScout = (
    newScout: Omit<Scout, "id" | "fullName" | "createdAt" | "favoritesCount" | "exclusivesCount">,
  ) => {
    const scout: Scout = {
      ...newScout,
      id: String(scouts.length + 1),
      fullName: `${newScout.firstName} ${newScout.lastName}`,
      createdAt: new Date().toISOString(),
      favoritesCount: 0,
      exclusivesCount: 0,
    }
    setScouts([...scouts, scout])
  }

  const handleToggleActive = (scoutId: string) => {
    setScouts(scouts.map((scout) => (scout.id === scoutId ? { ...scout, isActive: !scout.isActive } : scout)))
  }

  const handleResendWelcome = (scoutId: string) => {
    console.log("[v0] Resending welcome email to scout:", scoutId)
  }

  const handleImportScouts = async (file: File): Promise<CSVImportResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          recordsImported: 5,
        })
      }, 1500)
    })
  }

  const handleImportTeams = async (file: File): Promise<CSVImportResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          recordsImported: 10,
        })
      }, 1500)
    })
  }

  const handleImportPlayers = async (file: File): Promise<CSVImportResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          recordsImported: 50,
        })
      }, 1500)
    })
  }

  const handleImportMatches = async (file: File): Promise<CSVImportResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          recordsImported: 15,
        })
      }, 1500)
    })
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Manage tournament data, scouts, and view analytics</p>
        </div>

        <Tabs defaultValue="scouts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-border">
            <TabsTrigger value="scouts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Scouts
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scouts" className="space-y-6">
            <ScoutManagement
              scouts={scouts}
              onAddScout={handleAddScout}
              onToggleActive={handleToggleActive}
              onResendWelcome={handleResendWelcome}
              onImportScouts={handleImportScouts}
            />
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card className="border-border bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Data Management</CardTitle>
                <CardDescription>Import or manually add teams, players, and matches</CardDescription>
              </CardHeader>
              <CardContent>
                <DataManagementTabs
                  onImportTeams={handleImportTeams}
                  onImportPlayers={handleImportPlayers}
                  onImportMatches={handleImportMatches}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <MetricsDashboard
              playerMetrics={mockPlayerMetrics}
              teamMetrics={mockTeamMetrics}
              scoutMetrics={mockScoutActivityMetrics}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsGenerator />
          </TabsContent>
        </Tabs>
      </div>
  )
}
