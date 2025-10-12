"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { LOGIN_TEXTS } from '../_constants'

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const email = watch("email")

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)

    try {
      await login(data.email)
      router.push("/teams")
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={cn(
      "space-y-6 w-full  sm:w-[446px] sm:max-w-none sm:mx-auto lg:max-w-lg",
      "border-as1-gold/20 bg-white/80 backdrop-blur-sm shadow-lg",
      "rounded-xl md:rounded-2xl overflow-hidden"
    )}>
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

      <CardContent className={cn(
        "space-y-5 md:space-y-6 px-4 sm:px-6 pb-6 sm:pb-8"
      )}>
        <form onSubmit={handleSubmit(onSubmit)} className={cn(
          "space-y-5 md:space-y-6"
        )}>
          <div className={cn(
            "space-y-3 md:space-y-4"
          )}>
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
                id="email"
                type="email"
                placeholder={LOGIN_TEXTS.FORM.EMAIL_PLACEHOLDER}
                {...register("email")}
                disabled={isSubmitting}
                className={cn(
                  "pl-10 sm:pl-12 pr-4 py-3 text-sm sm:text-base border-2 transition-all duration-200",
                  "bg-white/90 focus:bg-white rounded-lg",
                  errors.email
                    ? 'border-destructive/50 focus:border-destructive focus:ring-2 focus:ring-destructive/20'
                    : 'border-as1-gold/20 hover:border-as1-gold/40 focus:border-as1-gold focus:ring-2 focus:ring-as1-gold/20'
                )}
              />
            </div>

            <div className={cn("space-y-2")}>
              {errors.email && (
                <p className={cn(
                  "text-xs sm:text-sm text-destructive flex items-start gap-2"
                )}>
                  <span className={cn(
                    "inline-block w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0"
                  )} />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className={cn("mt-4")}>
              <p className={cn(
                "text-xs sm:text-sm text-muted-foreground/80 text-left"
              )}>
                {LOGIN_TEXTS.FORM.TRY_EMAIL}{' '}
                <span className={cn(
                  "font-mono text-xs sm:text-sm text-foreground bg-as1-gold/10 px-2 py-1 rounded-md border border-as1-gold/20"
                )}>
                  {LOGIN_TEXTS.FORM.EMAIL_PLACEHOLDER}
                </span>
              </p>
            </div>
          </div>

          <div className={cn("pt-2")}>
            <Button
              type="submit"
              className={cn(
                "w-full py-3 px-6 text-base font-medium",
                "bg-as1-gold hover:bg-as1-gold/90 text-white",
                "transition-all duration-200 rounded-lg",
                "shadow-md hover:shadow-lg",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className={cn(
                    "mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin"
                  )} />
                  {LOGIN_TEXTS.FORM.SUBMITTING_BUTTON}
                </>
              ) : (
                <>
                  <Mail className={cn(
                    "mr-2 h-4 w-4 sm:h-5 sm:w-5"
                  )} />
                  {LOGIN_TEXTS.FORM.SUBMIT_BUTTON}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
