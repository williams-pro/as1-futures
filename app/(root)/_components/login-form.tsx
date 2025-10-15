"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useLogin } from "@/hooks/use-login"
import {
  LoginErrorMessage,
  LoginEmailInput,
  LoginPinInput,
  LoginSubmitButton,
  LoginFormHeader,
  LoginFormFooter
} from './index'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    isSubmitting,
    error,
    onSubmit,
    clearError
  } = useLogin()

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
        <form onSubmit={handleSubmit(onSubmit)} className={cn(
          "space-y-5 md:space-y-6"
        )}>
          <LoginEmailInput
            {...register("email")}
            error={errors.email?.message}
            isPending={isSubmitting}
          />

          <LoginPinInput
            {...register("pin")}
            error={errors.pin?.message}
            isPending={isSubmitting}
          />

          <div className={cn("space-y-2")}>
            {error && (
              <LoginErrorMessage message={error} />
            )}
          </div>

          <LoginFormFooter />

          <div className={cn("pt-2")}>
            <LoginSubmitButton
              isPending={isSubmitting}
              isSuccess={false}
              disabled={!isValid || isSubmitting}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}