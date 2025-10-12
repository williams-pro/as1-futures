import Image from "next/image"
import { cn } from "@/lib/utils"
import { LOGO_CONSTANTS } from "@/lib/constants/logo"

interface LogoCollapsedProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LogoCollapsed({ className, size = "md" }: LogoCollapsedProps) {
  const sizes = {
    sm: 32,
    md: 40,
    lg: 48,
  }

  const logoSize = sizes[size]

  return (
    <div className={cn(
      'flex items-center justify-center',
      className
    )}>
      <Image
        src={LOGO_CONSTANTS.COLLAPSED_URL}
        alt={LOGO_CONSTANTS.ALT_TEXT}
        width={logoSize}
        height={logoSize}
        className="h-auto w-auto object-contain drop-shadow-sm"
        priority
      />
    </div>
  )
}
