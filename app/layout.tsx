import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SidebarProvider as CustomSidebarProvider } from "@/contexts/sidebar-context"
import { AppLoading } from "@/components/shared/app-loading"
import { Toaster } from "@/components/ui/toaster"
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
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={<AppLoading />}>
          <CustomSidebarProvider>
            {children}
          </CustomSidebarProvider>
        </Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
