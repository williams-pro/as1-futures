"use client"

import { useState, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { signInWithPin } from '@/app/actions/auth/sign-in-with-pin'
import { 
  LoginErrorMessage,
  LoginEmailInput,
  LoginPinInput,
  LoginSubmitButton,
  LoginFormHeader,
  LoginFormFooter
} from './index'

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !pin) return
    
    setError(null)
    
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('email', email)
        formData.append('pin', pin)
        
        const result = await signInWithPin(formData)
        // Si llegamos aquí, significa que hubo un error
        // porque si fue exitoso, redirect() habría terminado la ejecución
        if (result && !result.success) {
          setError(result.error || 'Error al iniciar sesión')
        }
      } catch (error) {
        // Manejar errores de redirección o otros errores
        console.error('Login error:', error)
        setError('Error al iniciar sesión')
      }
    })
  }

  return (
    <Card className={cn(
      "space-y-6 w-full sm:w-[446px] sm:max-w-none sm:mx-auto lg:max-w-lg",
      "border-as1-gold/20 bg-white/80 backdrop-blur-sm shadow-lg",
      "rounded-xl md:rounded-2xl overflow-hidden"
    )}>
      <LoginFormHeader />

      <CardContent className={cn(
        "space-y-5 md:space-y-6 px-4 sm:px-6 pb-6 sm:pb-8"
      )}>
        <form onSubmit={handleSubmit} className={cn(
          "space-y-5 md:space-y-6"
        )}>
                 <LoginEmailInput
                   email={email}
                   onEmailChange={setEmail}
                   isPending={isPending}
                   hasError={!!error}
                 />

                 <LoginPinInput
                   pin={pin}
                   onPinChange={setPin}
                   isPending={isPending}
                   hasError={!!error}
                 />

                 <div className={cn("space-y-2")}>
                   {error && (
                     <LoginErrorMessage message={error} />
                   )}
                 </div>

                 <LoginFormFooter />

                 <div className={cn("pt-2")}>
                   <LoginSubmitButton
                     isPending={isPending}
                     isSuccess={false}
                     disabled={!email || !pin || pin.length !== 4}
                   />
                 </div>
        </form>
      </CardContent>
    </Card>
  )
}