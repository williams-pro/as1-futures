"use client"

import { useState } from "react"
import { Plus, Mail, Power, PowerOff, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AddScoutDialog } from "./add-scout-dialog"
import { CSVImportCard } from "./csv-import-card"
import type { Scout, CSVImportResult } from "@/lib/types"

interface ScoutManagementProps {
  scouts: Scout[]
  onAddScout: (scout: Omit<Scout, "id" | "fullName" | "createdAt" | "favoritesCount" | "exclusivesCount">) => void
  onToggleActive: (scoutId: string) => void
  onResendWelcome: (scoutId: string) => void
  onImportScouts: (file: File) => Promise<CSVImportResult>
}

export function ScoutManagement({
  scouts,
  onAddScout,
  onToggleActive,
  onResendWelcome,
  onImportScouts,
}: ScoutManagementProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showImport, setShowImport] = useState(false)

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Scout Management</CardTitle>
              <CardDescription>Manage scout access and permissions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowImport(!showImport)} variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Scout
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scout</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Favorites</TableHead>
                <TableHead>Exclusives</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scouts.map((scout) => (
                <TableRow key={scout.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {getInitials(scout.firstName, scout.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{scout.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{scout.email}</TableCell>
                  <TableCell>
                    <Badge variant={scout.isActive ? "default" : "secondary"}>
                      {scout.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{scout.lastLogin || "Never"}</TableCell>
                  <TableCell>{scout.favoritesCount}</TableCell>
                  <TableCell>{scout.exclusivesCount}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => onResendWelcome(scout.id)}>
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onToggleActive(scout.id)}>
                        {scout.isActive ? (
                          <PowerOff className="h-4 w-4 text-destructive" />
                        ) : (
                          <Power className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showImport && (
        <CSVImportCard
          title="Import Scouts"
          description="Upload a CSV file with scout information"
          templateName="scouts_template.csv"
          onImport={onImportScouts}
        />
      )}

      <AddScoutDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={onAddScout} />
    </div>
  )
}
