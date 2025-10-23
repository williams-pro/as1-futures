import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'

interface AppLoadingProps {
  message?: string
}

export function AppLoading({ message = 'Loading AS1 Futures...' }: AppLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-as1-gold-50/10">
      <div className="text-center space-y-4">
        <Image
          src="/as1-logo-collapsed.png"
          alt="AS1 Futures"
          width={80}
          height={80}
          className="mx-auto animate-pulse"
        />
        <Spinner className="h-8 w-8 text-as1-gold mx-auto" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}


