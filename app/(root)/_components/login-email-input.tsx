import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { LOGIN_TEXTS } from '../_constants'
import { forwardRef } from "react"

interface LoginEmailInputProps {
  error?: string
  isPending: boolean
}

export const LoginEmailInput = forwardRef<HTMLInputElement, LoginEmailInputProps>(({ 
  error, 
  isPending, 
  ...props 
}, ref) => {
  return (
    <div className={cn("space-y-3 md:space-y-4")}>
      <Label htmlFor="email" className={cn(
        "text-base text-as1-charcoal font-medium block"
      )}>
        {LOGIN_TEXTS.FORM.EMAIL_LABEL}
      </Label>
      
      <div className="relative">
        <Mail className={cn(
          "absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground/60 pointer-events-none"
        )} />
        <Input
          ref={ref}
          id="email"
          type="email"
          placeholder={LOGIN_TEXTS.FORM.EMAIL_PLACEHOLDER}
          disabled={isPending}
          className={cn(
            "pl-10 sm:pl-12 pr-4 py-3 text-sm sm:text-base border-2 transition-all duration-200",
            "bg-white/90 focus:bg-white rounded-lg",
            error
              ? 'border-destructive/50 focus:border-destructive focus:ring-2 focus:ring-destructive/20'
              : 'border-as1-gold/20 hover:border-as1-gold/40 focus:border-as1-gold focus:ring-2 focus:ring-as1-gold/20'
          )}
          {...props}
        />
      </div>
    </div>
  )
})

LoginEmailInput.displayName = "LoginEmailInput"
