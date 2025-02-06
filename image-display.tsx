"use client"

import { useState } from "react"
import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { GalleryImage } from "./image-gallery"

interface ImageDisplayProps {
  image: GalleryImage
  onUpdate: (image: GalleryImage) => void
  onDelete: (imageId: string) => void
  index: number
}

export function ImageDisplay({ image, onUpdate, onDelete, index }: ImageDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [caption, setCaption] = useState(image.caption)

  const handleSave = () => {
    onUpdate({ ...image, caption })
    setIsEditing(false)
  }

  return (
    <div className="relative group rounded-xl overflow-hidden shadow-md">
      <img src={image.url || "/placeholder.svg"} alt={image.altText} className="w-full h-48 object-cover" />
      {!isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="text-white hover:text-primary"
          >
            <Edit2 className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(image.id)}
            className="text-white hover:text-primary ml-2"
          >
            <Trash2 className="h-6 w-6" />
          </Button>
        </div>
      )}
      {isEditing ? (
        <div className="p-2 space-y-2">
          <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Add a caption..." />
          <Button onClick={handleSave}>Save</Button>
        </div>
      ) : (
        <p className="p-2 text-sm">{image.caption}</p>
      )}
    </div>
  )
}
