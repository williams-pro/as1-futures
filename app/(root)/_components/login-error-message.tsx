import { cn } from "@/lib/utils"

interface LoginErrorMessageProps {
  message: string
}

export function LoginErrorMessage({ message }: LoginErrorMessageProps) {
  return (
    <p className={cn(
      "text-xs sm:text-sm text-destructive flex items-start gap-2"
    )}>
      <span className={cn(
        "inline-block w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0"
      )} />
      {message}
    </p>
  )
}



