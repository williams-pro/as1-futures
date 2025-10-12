"use client"

interface VideoPlayerProps {
  videoUrl: string
  videoProvider: "youtube" | "veo"
}

export function VideoPlayer({ videoUrl, videoProvider }: VideoPlayerProps) {
  // Extract video ID from URL
  const getVideoId = () => {
    if (videoProvider === "youtube") {
      const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
      return match ? match[1] : null
    }
    // For VEO, we'd need their specific embed format
    return videoUrl
  }

  const videoId = getVideoId()

  if (videoProvider === "youtube" && videoId) {
    return (
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Match Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (videoProvider === "veo") {
    return (
      <div
        className="relative w-full rounded-xl bg-as1-charcoal flex items-center justify-center"
        style={{ paddingBottom: "56.25%" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
          <p className="text-lg font-semibold mb-2">VEO Video Player</p>
          <p className="text-sm text-gray-400">VEO video integration would be implemented here</p>
          <p className="text-xs text-gray-500 mt-4">Video URL: {videoUrl}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-secondary p-8 text-center">
      <p className="text-muted-foreground">Video player not available</p>
    </div>
  )
}
