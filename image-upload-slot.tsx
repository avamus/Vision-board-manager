"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { GalleryImage } from "./image-gallery"

interface ImageUploadSlotProps {
  onUpload: (image: GalleryImage) => void
}

export function ImageUploadSlot({ onUpload }: ImageUploadSlotProps) {
  const handleClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/png'
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          const newImage: GalleryImage = {
            id: Date.now().toString(),
            url: reader.result as string,
            caption: "",
            altText: "",
          }
          onUpload(newImage)
        }
        reader.readAsDataURL(file)
      }
    }
    
    input.click()
  }

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ease-in-out cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-300 hover:border-blue-300"
    >
      <Image
        src="https://res.cloudinary.com/drkudvyog/image/upload/v1733750646/upload_icon_bjsfxf.png"
        alt="Upload Icon"
        width={48}
        height={48}
        className="mb-4"
      />
      <p className="text-sm text-gray-600 text-center mb-4">
        Click to select an image
      </p>
      <Button
        variant="outline"
        className="bg-[#fbb350] hover:bg-[#fcc470] text-white rounded-full transition-colors duration-200"
      >
        Upload Image
      </Button>
    </div>
  )
}
