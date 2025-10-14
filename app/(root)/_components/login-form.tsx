"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { usePinAuth } from '../_hooks/use-pin-auth'
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
  const router = useRouter()
  
  const { 
    isLoading, 
    isSuccess, 
    error, 
    signInWithPin
  } = usePinAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !pin) return
    
    await signInWithPin({ email, pin })
  }

  useEffect(() => {
    if (isSuccess) {
      router.push('/teams')
    }
  }, [isSuccess, router])

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
            isPending={isLoading}
            hasError={!!error}
          />

          <LoginPinInput
            pin={pin}
            onPinChange={setPin}
            isPending={isLoading}
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
              isPending={isLoading}
              isSuccess={isSuccess}
              disabled={!email || !pin || pin.length !== 4}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}