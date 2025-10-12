"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileText, Download, CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { ReportType } from "@/lib/types"

export function ReportsGenerator() {
  const [reportType, setReportType] = useState<ReportType>("daily-activity")
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("excel")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    console.log("[v0] Generating report:", {
      reportType,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      exportFormat,
    })

    // Mock report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock download
    const link = document.createElement("a")
    link.setAttribute("href", "#")
    link.setAttribute("download", `${reportType}-${format(startDate, "yyyy-MM-dd")}.${exportFormat}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsGenerating(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Reports
        </CardTitle>
        <CardDescription>Create detailed reports for analysis and export</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Report Type */}
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily-activity">Daily Activity Summary</SelectItem>
                <SelectItem value="scout-activity">Scout Activity Report</SelectItem>
                <SelectItem value="player-popularity">Player Popularity Report</SelectItem>
                <SelectItem value="team-discovery">Team Discovery Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Format */}
          <div className="space-y-2">
            <Label htmlFor="export-format">Export Format</Label>
            <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as "csv" | "excel" | "pdf")}>
              <SelectTrigger id="export-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={(date) => date && setStartDate(date)} />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={(date) => date && setEndDate(date)} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Report Description */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <h4 className="mb-2 text-sm font-medium">Report Contents:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {reportType === "daily-activity" && (
              <>
                <li>• Total active scouts and login activity</li>
                <li>• Players viewed, favorites and exclusives added/removed</li>
                <li>• Top 10 most viewed players</li>
                <li>• Most active scouts by platform time</li>
              </>
            )}
            {reportType === "scout-activity" && (
              <>
                <li>• Detailed breakdown per scout</li>
                <li>• Login times and session duration</li>
                <li>• Pages viewed and navigation patterns</li>
                <li>• Players marked as favorites/exclusives</li>
              </>
            )}
            {reportType === "player-popularity" && (
              <>
                <li>• Players ranked by total views</li>
                <li>• Players ranked by favorites count</li>
                <li>• Players ranked by exclusives count</li>
                <li>• Players with multiple scout interest</li>
              </>
            )}
            {reportType === "team-discovery" && (
              <>
                <li>• Teams ranked by player views</li>
                <li>• Teams ranked by favorites count</li>
                <li>• Discovery rate per team (marked/total players)</li>
                <li>• Group comparison analysis</li>
              </>
            )}
          </ul>
        </div>

        {/* Generate Button */}
        <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full" size="lg">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate & Download Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
