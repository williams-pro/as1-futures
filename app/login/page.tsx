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
import { Logo } from "@/components/logo"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
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
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-as1-gold-50/10 px-4 overflow-hidden">
      {/* Background Elements Sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-as1-gold/3 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-as1-gold/3 rounded-full blur-2xl" />
      </div>

      <div className="absolute top-12 left-12 z-10">
        <Logo size="md" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        {/* Login Card */}
        <Card className="border-as1-gold/15 bg-white/60 backdrop-blur-sm shadow-sm rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-as1-gold to-as1-gold/60" />

          <CardHeader className="space-y-2 pb-5 pt-7">
            <CardTitle className="text-xl font-semibold text-as1-charcoal text-center">Enter your email</CardTitle>
            <CardDescription className="text-center text-muted-foreground text-sm">
              We'll send you a magic link for secure access
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium text-as1-charcoal">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="scout@as1futures.com"
                    {...register("email")}
                    disabled={isSubmitting}
                    className={`pl-10 h-11 text-sm border transition-all duration-200 bg-white/70 ${
                      errors.email
                        ? "border-destructive/50 focus:border-destructive"
                        : "border-as1-gold/15 hover:border-as1-gold/30 focus:border-as1-gold"
                    } rounded-lg`}
                  />
                </div>

                {errors.email && (
                  <p className="text-sm text-destructive font-medium mt-1.5 flex items-center gap-1.5">
                    <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                    {errors.email.message}
                  </p>
                )}

                <div className="pt-1">
                  <p className="text-xs text-muted-foreground">
                    Try:{" "}
                    <span className="font-mono text-foreground bg-as1-gold/5 px-1.5 py-0.5 rounded">
                      scout@as1futures.com
                    </span>{" "}
                    {" "}
                    {/*<span className="font-mono text-foreground bg-as1-gold/5 px-1.5 py-0.5 rounded">
                      admin@as1futures.com
                    </span>*/}
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-semibold bg-as1-gold hover:bg-as1-gold/90 text-white transition-all duration-200 rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Magic Link
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground/50">
          &copy; 2025 <span className="text-as1-charcoal font-medium">AS</span>
          <span className="text-as1-gold font-medium">1</span>
          <span className="text-as1-charcoal font-medium"> Futures</span>. Elite Sports Scouting.
        </p>
      </div>
    </div>
  )
}
