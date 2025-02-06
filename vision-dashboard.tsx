import { useState } from "react"
import { MainVisionPanel } from "./main-vision-panel"
import { ChallengeCard } from "./challenge-card"
import { ProgressWinsSection } from "./progress-wins-section"
import { ImageGallery } from "./image-gallery"
import { TeamGoalsVision } from "./team-goals-vision"
import { Switch } from "@/components/ui/switch"

export function VisionDashboard() {
  const [isEditMode, setIsEditMode] = useState(false)

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-end space-x-3 mb-6">
        <span className={`text-base font-medium ${!isEditMode ? "text-gray-500" : "text-[#fbb350]"}`}>Editing</span>
        <Switch
          checked={!isEditMode}
          onCheckedChange={(checked) => setIsEditMode(!checked)}
          className={`h-7 w-14 rounded-full data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200
            [&_span[data-state]]:h-6 [&_span[data-state]]:w-6 [&_span[data-state]]:rounded-full
            [&_span[data-state=checked]]:translate-x-7 [&_span[data-state=unchecked]]:translate-x-1
            [&_span[data-state]]:bg-white`}
        />
        <span className={`text-base font-medium ${isEditMode ? "text-gray-500" : "text-green-600"}`}>Live</span>
      </div>
      <div className="flex flex-col gap-6 rounded-xl">
        <TeamGoalsVision isEditing={isEditMode} />
        <MainVisionPanel isEditing={isEditMode} />
        <div className="grid gap-6 md:grid-cols-2">
          <ChallengeCard isEditing={isEditMode} />
          <ProgressWinsSection isEditing={isEditMode} />
        </div>
        <ImageGallery isEditing={isEditMode} />
      </div>
    </div>
  )
}
