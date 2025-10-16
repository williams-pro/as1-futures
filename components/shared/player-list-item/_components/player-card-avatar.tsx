import { cn } from "@/lib/utils"
import { useState } from "react"

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
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const initials = `${firstName[0]}${lastName[0]}`

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  return (
    <div className={cn(
      "h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg",
      "bg-gradient-to-br from-slate-50 to-slate-100/80",
      "flex items-center justify-center", // Alineación vertical
      className
    )}>
      {photoUrl && !imageError ? (
        <>
          {imageLoading && (
            <div className={cn(
              "absolute inset-0 flex items-center justify-center",
              "bg-gradient-to-br from-slate-100 to-slate-200",
              "text-slate-600 font-semibold text-lg"
            )}>
              {initials}
            </div>
          )}
          <img
            src={photoUrl}
            alt={`${firstName} ${lastName} photo`}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-200",
              imageLoading ? "opacity-0" : "opacity-100"
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </>
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
