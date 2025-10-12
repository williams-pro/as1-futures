import { cn } from "@/lib/utils"

interface PlayerCardAvatarProps {
  photoUrl?: string
  firstName: string
  lastName: string
  className?: string
}

export function PlayerCardAvatar({ 
  photoUrl, 
  firstName, 
  lastName, 
  className 
}: PlayerCardAvatarProps) {
  const initials = `${firstName[0]}${lastName[0]}`

  return (
    <div className={cn(
      "h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg",
      "bg-gradient-to-br from-slate-50 to-slate-100/80",
      className
    )}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName} photo`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className={cn(
          "h-full w-full flex items-center justify-center",
          "bg-gradient-to-br from-slate-100 to-slate-200",
          "text-slate-600 font-semibold text-lg"
        )}>
          {initials}
        </div>
      )}
    </div>
  )
}
