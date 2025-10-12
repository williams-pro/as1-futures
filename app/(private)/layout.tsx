import { AppLayout } from "@/components/layout/app-layout"

// Este layout se aplica a todas las rutas del grupo (private)
// Incluye la navegación y verificación de autenticación
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
