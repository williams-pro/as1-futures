import { Logo } from "@/components/shared/logo"
import { CopyrightFooter } from './_components/copyright-footer'
import { cn } from "@/lib/utils"

export default function RootLayout({  
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={cn(
      "relative flex min-h-screen items-center justify-center",
      "bg-gradient-to-br from-slate-50 via-white to-as1-gold-50/10"
    )}>
      <div className="absolute top-12 left-12 z-10">
        <Logo className="h-12 w-24" textClassName="text-lg lg:text-xl"/>
      </div>

      <div className="relative z-10 w-full" >
        {children}
        <CopyrightFooter />
      </div>
    </div>
  )
}
