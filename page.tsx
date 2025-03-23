"use client"

import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { VisionDashboardManager } from '@/components/ui/vision-dashboard-manager'

export default function TeamVisionManagerPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <main className="min-h-screen bg-white">
  <div className="max-w-[1200px] mx-auto px-2 pt-2 pb-4">
    <VisionDashboardManager />
  </div>
</main>
    </DndProvider>
  )
}
