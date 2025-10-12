interface PageContentProps {
  children: React.ReactNode
  className?: string
}

export function PageContent({ children, className }: PageContentProps) {
  return (
    <div className={`container mx-auto px-6 py-8 ${className || ""}`}>
      {children}
    </div>
  )
}
