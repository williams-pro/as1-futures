import { Logo } from "@/components/shared/logo"
import { LogoCollapsed } from "@/components/shared/logo-collapsed"

export function SidebarHeader() {
  return (
    <div className="border-b border-as1-gold/20 px-2 py-4">
      <div className="flex items-center justify-center relative overflow-hidden h-16">
        {/* Logo completo - visible cuando está expandido */}
        <div className="w-auto group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:scale-95 group-data-[collapsible=icon]:-translate-x-4 transition-all duration-300 ease-in-out opacity-100 scale-100 translate-x-0">
          <Logo 
            className="h-12 w-24 items-center justify-center"
            textClassName="text-xs font-bold text-as1-charcoal"
            showText={true}
            size="md"
          />
        </div>
        
        {/* Logo colapsado - visible cuando está colapsado */}
        <div className="absolute inset-0 flex items-center justify-center group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:scale-100 group-data-[collapsible=icon]:translate-x-0 opacity-0 scale-95 translate-x-4 transition-all duration-300 ease-in-out">
          <LogoCollapsed className="h-10 w-10" size="md" />
        </div>
      </div>
    </div>
  )
}
