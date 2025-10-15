import { Button, ButtonProps } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
}

export function LoadingButton({
  children,
  isLoading = false,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={isLoading || disabled}
      className={cn("relative", className)}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
      {children}
    </Button>
  )
}
