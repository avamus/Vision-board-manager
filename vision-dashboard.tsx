import { MainVisionPanel } from "./main-vision-panel"
import { ChallengeCard } from "./challenge-card"
import { ProgressWinsSection } from "./progress-wins-section-manager"
import { ImageGallery } from "./image-gallery"
import { TeamGoalsVision } from "./team-goals-vision"

export function VisionDashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6 rounded-xl">
        <TeamGoalsVision />
        <MainVisionPanel />
        <div className="grid gap-6 md:grid-cols-2">
          <ChallengeCard />
          <ProgressWinsSection />
        </div>
        <ImageGallery />
      </div>
    </div>
  )
}

