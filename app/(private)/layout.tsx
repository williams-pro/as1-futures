import { PrivateLayoutWrapper } from "@/components/layout/private-layout"

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PrivateLayoutWrapper>{children}</PrivateLayoutWrapper>
}
