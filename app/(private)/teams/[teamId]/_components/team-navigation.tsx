import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TEAM_DETAIL_TEXTS } from "../_constants/team-detail"

export function TeamNavigation() {
  return (
    <div>
      <Link href="/teams">
        <Button variant="ghost" className="gap-2 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {TEAM_DETAIL_TEXTS.UI.BACK_TO_TEAMS}
        </Button>
      </Link>
    </div>
  )
}
