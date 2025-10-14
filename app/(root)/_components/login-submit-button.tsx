import { Button } from "@/components/ui/button"
import { Key, Loader2, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoginSubmitButtonProps {
  isPending: boolean
  isSuccess: boolean
  disabled?: boolean
}

export function LoginSubmitButton({ isPending, isSuccess, disabled }: LoginSubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn(
        "w-full py-3 px-6 text-base font-medium",
        isSuccess 
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-as1-gold hover:bg-as1-gold/90 text-white",
        "transition-all duration-200 rounded-lg",
        "shadow-md hover:shadow-lg",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
      disabled={isPending || isSuccess || disabled}
    >
      {isPending ? (
        <>
          <Loader2 className={cn(
            "mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin"
          )} />
          Signing In...
        </>
      ) : isSuccess ? (
        <>
          <CheckCircle className={cn(
            "mr-2 h-4 w-4 sm:h-5 sm:w-5"
          )} />
          Success!
        </>
      ) : (
        <>
          <Key className={cn(
            "mr-2 h-4 w-4 sm:h-5 sm:w-5"
          )} />
          Sign In
        </>
      )}
    </Button>
  )
}
