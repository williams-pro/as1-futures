import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { SidebarProvider as CustomSidebarProvider } from "@/contexts/sidebar-context"
import { SidebarProvider as ShadcnSidebarProvider } from "@/components/ui/sidebar"
import "./globals.css"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AS1 Futures - Sports Scouting Platform",
  description: "Elite-level sports scouting and player management platform",
  generator: "AS1 Futures",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <FavoritesProvider>
              <CustomSidebarProvider>
                <ShadcnSidebarProvider>
                  {children}
                </ShadcnSidebarProvider>
              </CustomSidebarProvider>
            </FavoritesProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
