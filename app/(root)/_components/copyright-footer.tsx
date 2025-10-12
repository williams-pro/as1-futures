import { LOGIN_TEXTS } from '../_constants'

export function CopyrightFooter() {
  return (
    <p className="mt-6 text-center text-xs text-muted-foreground/50">
      &copy; {LOGIN_TEXTS.COPYRIGHT.YEAR}{' '}
      <span className="text-as1-charcoal font-medium">{LOGIN_TEXTS.COPYRIGHT.COMPANY_PART_1}</span>
      <span className="text-as1-gold font-medium">{LOGIN_TEXTS.COPYRIGHT.COMPANY_PART_2}</span>
      <span className="text-as1-charcoal font-medium">{LOGIN_TEXTS.COPYRIGHT.COMPANY_PART_3}</span>. {LOGIN_TEXTS.COPYRIGHT.TAGLINE}
    </p>
  )
}
