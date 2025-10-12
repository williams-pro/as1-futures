import { PrivateLayoutWrapper } from "@/components/layout/private-layout"
import { SidebarProvider } from "@/components/sidebar"
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <PrivateLayoutWrapper>{children}</PrivateLayoutWrapper>
    </SidebarProvider>
  )
}
