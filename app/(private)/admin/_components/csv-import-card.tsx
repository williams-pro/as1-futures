"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, Download, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CSVImportResult } from "@/lib/types"

interface CSVImportCardProps {
  title: string
  description: string
  templateName: string
  onImport: (file: File) => Promise<CSVImportResult>
}

export function CSVImportCard({ title, description, templateName, onImport }: CSVImportCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<CSVImportResult | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith(".csv")) {
      await processFile(file)
    }
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }, [])

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setResult(null)

    try {
      const importResult = await onImport(file)
      setResult(importResult)
    } catch (error) {
      setResult({
        success: false,
        recordsImported: 0,
        errors: [{ line: 0, column: "general", value: "", error: "Error processing file" }],
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadTemplate = () => {
    // Mock template download
    const blob = new Blob([`Template for ${templateName}`], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = templateName
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" onClick={downloadTemplate} className="w-full bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          Download CSV Template
        </Button>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all
            ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
            ${isProcessing ? "opacity-50 pointer-events-none" : ""}
          `}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            {isProcessing ? "Processing..." : "Drag & drop CSV file or click to browse"}
          </p>
        </div>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>
              {result.success ? (
                `Successfully imported ${result.recordsImported} records`
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">Import failed with {result.errors?.length} errors:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {result.errors?.slice(0, 5).map((error, idx) => (
                      <li key={idx}>
                        Line {error.line}, Column "{error.column}": {error.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
