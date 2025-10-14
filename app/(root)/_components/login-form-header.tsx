import { CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LOGIN_TEXTS } from '../_constants'

export function LoginFormHeader() {
  return (
    <>
      <div className={cn(
        "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-as1-gold to-as1-gold/60"
      )} />
      
      <CardHeader className={cn(
        "space-y-4 md:space-y-6 px-4 sm:px-6 pt-6 sm:pt-8"
      )}>
        <CardTitle className={cn(
          "text-lg my-0 sm:text-xl md:text-2xl text-as1-charcoal text-left font-semibold leading-tight"
        )}>
          {LOGIN_TEXTS.FORM.TITLE}
        </CardTitle>
        <CardDescription className={cn(
          "text-left text-sm sm:text-base text-muted-foreground/80 leading-relaxed"
        )}>
          {LOGIN_TEXTS.FORM.DESCRIPTION}
        </CardDescription>
      </CardHeader>
    </>
  )
}
