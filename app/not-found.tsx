import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-pearl-white px-4">
      <div className="text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-as1-gold-100">
          <span className="text-4xl font-bold text-as1-gold">404</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Page Not Found</h1>
        <p className="mb-6 text-muted-foreground">The page you're looking for doesn't exist</p>
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
