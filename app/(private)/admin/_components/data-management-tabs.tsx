"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CSVImportCard } from "./csv-import-card"
import { ManualDataForms } from "./manual-data-forms"
import type { CSVImportResult } from "@/lib/types"

interface DataManagementTabsProps {
  onImportTeams: (file: File) => Promise<CSVImportResult>
  onImportPlayers: (file: File) => Promise<CSVImportResult>
  onImportMatches: (file: File) => Promise<CSVImportResult>
}

export function DataManagementTabs({ onImportTeams, onImportPlayers, onImportMatches }: DataManagementTabsProps) {
  const [activeTab, setActiveTab] = useState("teams")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="teams">Teams</TabsTrigger>
        <TabsTrigger value="players">Players</TabsTrigger>
        <TabsTrigger value="matches">Matches</TabsTrigger>
      </TabsList>

      <TabsContent value="teams" className="space-y-6">
        <CSVImportCard
          title="Import Teams"
          description="Upload a CSV file with team information"
          templateName="teams_template.csv"
          onImport={onImportTeams}
        />
        <ManualDataForms type="team" />
      </TabsContent>

      <TabsContent value="players" className="space-y-6">
        <CSVImportCard
          title="Import Players"
          description="Upload a CSV file with player information"
          templateName="players_template.csv"
          onImport={onImportPlayers}
        />
        <ManualDataForms type="player" />
      </TabsContent>

      <TabsContent value="matches" className="space-y-6">
        <CSVImportCard
          title="Import Matches"
          description="Upload a CSV file with match information"
          templateName="matches_template.csv"
          onImport={onImportMatches}
        />
        <ManualDataForms type="match" />
      </TabsContent>
    </Tabs>
  )
}
