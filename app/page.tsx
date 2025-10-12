"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/teams")
      } else {
        router.push("/login")
      }
    }
  }, [user, isLoading, router])

  return <div className="flex min-h-screen items-center justify-center bg-white" />
}
