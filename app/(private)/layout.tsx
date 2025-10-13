import { PrivateLayoutWrapper } from "@/components/layout/private-layout"
import { SidebarProvider as ShadcnSidebarProvider } from "@/components/ui/sidebar"

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ShadcnSidebarProvider>
      <PrivateLayoutWrapper>{children}</PrivateLayoutWrapper>
    </ShadcnSidebarProvider>
  )
}
