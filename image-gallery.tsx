import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploadSlot } from "./image-upload-slot"
import { ImageDisplay } from "./image-display"

export interface GalleryImage {
  id: string
  url: string
  caption: string
  altText: string
}

export function ImageGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])

  const handleImageUpload = (newImage: GalleryImage) => {
    setImages((prevImages) => [...prevImages, newImage])
  }

  const handleImageUpdate = (updatedImage: GalleryImage) => {
    setImages((prevImages) => prevImages.map((img) => (img.id === updatedImage.id ? updatedImage : img)))
  }

  const handleImageDelete = (imageId: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== imageId))
  }

  const handleReorder = (startIndex: number, endIndex: number) => {
    setImages((prevImages) => {
      const result = Array.from(prevImages)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }

  return (
    <Card className="shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#5b06be]">Vision in Action</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {images.map((image, index) => (
            <ImageDisplay
              key={image.id}
              image={image}
              onUpdate={handleImageUpdate}
              onDelete={handleImageDelete}
              onReorder={(dragIndex, hoverIndex) => handleReorder(dragIndex, hoverIndex)}
              index={index}
            />
          ))}
          {images.length < 3 && <ImageUploadSlot onUpload={handleImageUpload} />}
        </div>
      </CardContent>
    </Card>
  )
}
