import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonCounterProps {
  className?: string
}

export function SkeletonCounter({ className }: SkeletonCounterProps) {
  return (
    <Skeleton 
      className={`h-5 w-6 rounded-full ${className}`}
    />
  )
}



