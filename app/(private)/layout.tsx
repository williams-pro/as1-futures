import { PrivateLayoutWrapper } from "@/components/layout/private-layout"
import { SidebarProvider as ShadcnSidebarProvider } from "@/components/ui/sidebar"
import { AuthLoadingWrapper } from "@/components/auth/auth-loading-wrapper"
import { FavoritesProvider } from "@/contexts/favorites-context"

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthLoadingWrapper>
      <FavoritesProvider>
        <ShadcnSidebarProvider>
          <PrivateLayoutWrapper>{children}</PrivateLayoutWrapper>
        </ShadcnSidebarProvider>
      </FavoritesProvider>
    </AuthLoadingWrapper>
  )
}
