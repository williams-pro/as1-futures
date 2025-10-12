import { cn } from "@/lib/utils"

export function BackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className={cn(
        "absolute -top-20 -right-20 w-60 h-60 bg-as1-gold/3 rounded-full blur-2xl"
      )} />
      <div className={cn(
        "absolute -bottom-20 -left-20 w-60 h-60 bg-as1-gold/3 rounded-full blur-2xl"
      )} />
    </div>
  )
}
