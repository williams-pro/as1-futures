import Image from "next/image"
import { cn } from "@/lib/utils"
import { LOGO_CONSTANTS, BRAND_CONSTANTS } from "@/lib/constants/logo"

interface LogoProps {
  className?: string
  showText?: boolean
  textClassName?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ 
  className, 
  showText = true, 
  textClassName,
  size = "md" 
}: LogoProps) {
  const sizes = {
    sm: { logo: 48, text: "text-[10px]" },
    md: { logo: 60, text: "text-xs" },
    lg: { logo: 72, text: "text-sm" },
  }

  const { logo, text } = sizes[size]

  return (
    <div className={cn('flex flex-col items-center space-y-1', className)}>
      <Image
        src={LOGO_CONSTANTS.URL}
        alt={LOGO_CONSTANTS.ALT_TEXT}
        width={logo}
        height={logo * 0.6}
        priority
        className="w-auto h-auto object-contain"
      />
      {showText && (
        <div className="text-center">
          <span className={cn(
            'font-bold tracking-wider uppercase block text-neutral-400',
            textClassName || text
          )}>
            {BRAND_CONSTANTS.NAME}
          </span>
        </div>
      )}
    </div>
  )
}
