"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Trash2, Edit2, Video, ExternalLink, GripVertical } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createPlayerVideo } from '@/app/actions/admin/players/create-player-video'
import { updatePlayerVideo } from '@/app/actions/admin/players/update-player-video'
import { deletePlayerVideo } from '@/app/actions/admin/players/delete-player-video'
import { PlayerVideo } from '@/lib/types/admin.types'
import { logger } from '@/lib/logger'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'

const VideoFormSchema = z.object({
  video_url: z.string().url('Invalid video URL'),
  video_type: z.string().min(1, 'Video type is required'),
})

type VideoFormData = z.infer<typeof VideoFormSchema>

interface PlayerVideosManagerProps {
  playerId: string
  playerName: string
  initialVideos?: PlayerVideo[]
  onVideosChange?: (videos: PlayerVideo[]) => void
}

const VIDEO_TYPES = [
  { value: 'highlight', label: 'Highlight' },
  { value: 'interview', label: 'Interview' },
  { value: 'training', label: 'Training' },
  { value: 'match', label: 'Match' },
  { value: 'other', label: 'Other' },
]

export function PlayerVideosManager({ 
  playerId, 
  playerName, 
  initialVideos = [],
  onVideosChange 
}: PlayerVideosManagerProps) {
  const [videos, setVideos] = useState<PlayerVideo[]>(initialVideos)
  const [editingVideo, setEditingVideo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VideoFormData>({
    resolver: zodResolver(VideoFormSchema),
    defaultValues: {
      video_url: '',
      video_type: 'highlight',
    },
  })

  // Actualizar videos cuando cambien las props
  useEffect(() => {
    setVideos(initialVideos)
  }, [initialVideos])

  // Notificar cambios a componente padre
  useEffect(() => {
    onVideosChange?.(videos)
  }, [videos, onVideosChange])

  const onSubmit = async (data: VideoFormData) => {
    try {
      setIsSubmitting(true)
      
      const formData = new FormData()
      formData.append('player_id', playerId)
      formData.append('video_url', data.video_url)
      formData.append('video_type', data.video_type)

      const result = await createPlayerVideo(formData)
      
      if (result.success && result.data) {
        const newVideo: PlayerVideo = {
          id: (result.data as any).id,
          player_id: playerId,
          video_url: (result.data as any).video_url,
          video_type: (result.data as any).video_type,
          display_order: (result.data as any).display_order,
          created_at: (result.data as any).created_at,
        }
        
        setVideos(prev => [...prev, newVideo])
        reset()
        
        toast({
          title: "Video added successfully",
          description: `Video added for ${playerName}`,
        })
        
        logger.database('PLAYER_VIDEOS_MANAGER', 'Video created successfully', undefined)
      } else {
        throw new Error(result.error || 'Failed to create video')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create video'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      
      logger.error('Failed to create video', { operation: 'PLAYER_VIDEOS_MANAGER' }, error as Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (video: PlayerVideo) => {
    setEditingVideo(video.id)
    setValue('video_url', video.video_url)
    setValue('video_type', video.video_type)
  }

  const handleUpdate = async (data: VideoFormData) => {
    if (!editingVideo) return

    try {
      setIsSubmitting(true)
      
      const formData = new FormData()
      formData.append('video_id', editingVideo)
      formData.append('video_url', data.video_url)
      formData.append('video_type', data.video_type)

      const result = await updatePlayerVideo(formData)
      
      if (result.success && result.data) {
        setVideos(prev => prev.map(video => 
          video.id === editingVideo 
            ? { ...video, video_url: data.video_url, video_type: data.video_type }
            : video
        ))
        
        setEditingVideo(null)
        reset()
        
        toast({
          title: "Video updated successfully",
          description: `Video updated for ${playerName}`,
        })
      } else {
        throw new Error(result.error || 'Failed to update video')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update video'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (videoId: string) => {
    setVideoToDelete(videoId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!videoToDelete) return

    try {
      setIsSubmitting(true)
      
      const formData = new FormData()
      formData.append('video_id', videoToDelete)

      const result = await deletePlayerVideo(formData)
      
      if (result.success) {
        setVideos(prev => prev.filter(video => video.id !== videoToDelete))
        
        toast({
          title: "Video deleted successfully",
          description: `Video deleted for ${playerName}`,
        })
      } else {
        throw new Error(result.error || 'Failed to delete video')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete video'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setDeleteDialogOpen(false)
      setVideoToDelete(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingVideo(null)
    reset()
  }

  const sortedVideos = [...videos].sort((a, b) => a.display_order - b.display_order)

  return (
    <>
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Player Videos
        </CardTitle>
        <CardDescription>
          Manage highlight videos and other media for {playerName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulario para agregar/editar video */}
        <form 
          onSubmit={handleSubmit(editingVideo ? handleUpdate : onSubmit)} 
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input
                id="video_url"
                {...register('video_url')}
                placeholder="https://youtube.com/watch?v=..."
                disabled={isSubmitting}
              />
              {errors.video_url && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.video_url.message}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_type">Video Type</Label>
              <Select
                onValueChange={(value) => setValue('video_type', value)}
                defaultValue={editingVideo ? videos.find(v => v.id === editingVideo)?.video_type : 'highlight'}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select video type" />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.video_type && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.video_type.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editingVideo ? (
                <Edit2 className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {editingVideo ? 'Update Video' : 'Add Video'}
            </Button>
            
            {editingVideo && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* Lista de videos existentes */}
        {sortedVideos.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Current Videos ({sortedVideos.length})
            </h4>
            
            <div className="space-y-2">
              {sortedVideos.map((video, index) => (
                <div 
                  key={video.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {video.video_type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        #{index + 1}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Video className="h-3 w-3 text-muted-foreground" />
                      <a 
                        href={video.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 truncate"
                      >
                        {video.video_url}
                      </a>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(video)}
                      disabled={isSubmitting}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(video.id)}
                      disabled={isSubmitting}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sortedVideos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No videos added yet</p>
            <p className="text-xs">Add a video using the form above</p>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Delete Confirmation Dialog */}
    <ConfirmDialog
      open={deleteDialogOpen}
      onOpenChange={setDeleteDialogOpen}
      onConfirm={confirmDelete}
      title="Delete Video"
      description="Are you sure you want to delete this video? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      variant="destructive"
      isLoading={isSubmitting}
    />
  </>
  )
}
