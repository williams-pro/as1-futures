import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlayerHighlightsProps {
  videoUrls?: string[]
}

export function PlayerHighlights({ videoUrls }: PlayerHighlightsProps) {
  if (!videoUrls || videoUrls.length === 0) {
    return (
      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 rounded-full bg-primary/10 p-4">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">No highlight videos available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Highlights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {videoUrls.map((url, index) => (
          <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="block">
            <Button
              variant="outline"
              className="w-full justify-between hover:bg-primary/5 hover:border-primary/50 bg-transparent"
            >
              <span className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Highlight Video {index + 1}
              </span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        ))}
      </CardContent>
    </Card>
  )
}
