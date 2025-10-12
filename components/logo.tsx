import Image from "next/image"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  collapsed?: boolean // Added collapsed prop for sidebar state
}

export function Logo({ className = "", size = "md", collapsed = false }: LogoProps) {
  const sizes = {
    sm: { logo: 48, text: "text-[10px]" },
    md: { logo: 60, text: "text-xs" },
    lg: { logo: 72, text: "text-sm" },
  }

  const { logo, text } = sizes[size]

  if (collapsed) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative" style={{ width: 40, height: 40 }}>
          <Image src="/as1-logo-collapsed.png" alt="AS1" fill className="object-contain" priority />
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-0.5 ${className}`}>
      <div className="relative" style={{ width: logo, height: logo * 0.6 }}>
        <Image src="/as1-logo.svg" alt="AS1" fill className="object-contain" priority />
      </div>
      <span className={`${text} font-bold text-as1-charcoal tracking-tight uppercase`}>Futures</span>
    </div>
  )
}
