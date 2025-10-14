import { cn } from "@/lib/utils"
import { Mail } from "lucide-react"
import { CONTACT_INFO } from "../_constants/auth.constants"

export function LoginFormFooter() {
  return (
    <div className={cn("mt-4")}>
      <div className={cn("space-y-2")}>
        <p className={cn(
          "text-xs sm:text-sm text-muted-foreground/80 text-left"
        )}>
          Only pre-registered scouts can access this platform.
        </p>
        <p className={cn(
          "text-xs sm:text-sm text-muted-foreground/80 text-left"
        )}>
          {CONTACT_INFO.SUPPORT_MESSAGE}
        </p>
        <a 
          href={`mailto:${CONTACT_INFO.ADMIN_EMAIL}`}
          className={cn(
            "inline-flex items-center gap-1.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-700/80 dark:hover:text-neutral-300/80",
            "font-medium transition-colors duration-200",
            "hover:underline group"
          )}
        >
          <Mail className={cn(
            "w-3 h-3 group-hover:scale-110 transition-transform duration-200"
          )} />
          {CONTACT_INFO.ADMIN_EMAIL}
        </a>
      </div>
    </div>
  )
}
