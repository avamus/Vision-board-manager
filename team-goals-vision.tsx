import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function TeamGoalsVision() {
  const [isEditing, setIsEditing] = useState(false)
  const [titleText, setTitleText] = useState("Team Goals & Vision")
  const [goalsTitle, setGoalsTitle] = useState("Our Goals:")
  const [visionTitle, setVisionTitle] = useState("Our Vision:")
  const [goals, setGoals] = useState(
    "1. Increase market share by 15%\n2. Launch 2 innovative products\n3. Achieve 99% customer satisfaction",
  )
  const [vision, setVision] = useState(
    "To become the industry leader in innovative solutions, setting new standards for excellence and customer satisfaction.",
  )

  return (
    <Card className="shadow-md rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        {isEditing ? (
          <Input
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            className="text-2xl font-bold text-[#5b06be] w-full max-w-[300px]"
          />
        ) : (
          <span className="text-2xl font-bold text-[#5b06be]">{titleText}</span>
        )}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] transition-shadow duration-300"
          >
            <Image
              src="https://res.cloudinary.com/drkudvyog/image/upload/v1734443082/Edit_icon_duha_g7r8lk.png"
              alt="Edit Icon"
              width={20}
              height={20}
            />
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          {isEditing ? (
            <Input
              value={goalsTitle}
              onChange={(e) => setGoalsTitle(e.target.value)}
              className="font-semibold mb-4 text-lg text-[#fbb350]"
            />
          ) : (
            <h3 className="font-semibold mb-4 text-lg text-[#fbb350]">{goalsTitle}</h3>
          )}
          {isEditing ? (
            <Textarea value={goals} onChange={(e) => setGoals(e.target.value)} className="text-base min-h-[100px]" />
          ) : (
            <p className="text-base whitespace-pre-line">{goals}</p>
          )}
        </div>
        <div>
          {isEditing ? (
            <Input
              value={visionTitle}
              onChange={(e) => setVisionTitle(e.target.value)}
              className="font-semibold mb-4 text-lg text-[#fbb350]"
            />
          ) : (
            <h3 className="font-semibold mb-4 text-lg text-[#fbb350]">{visionTitle}</h3>
          )}
          {isEditing ? (
            <Textarea value={vision} onChange={(e) => setVision(e.target.value)} className="text-base min-h-[100px]" />
          ) : (
            <p className="text-base">{vision}</p>
          )}
        </div>
        {isEditing && (
          <Button
            onClick={() => setIsEditing(false)}
            className="w-full rounded-full bg-[#fbb350] hover:bg-[#fbb350]/80 text-white transition-colors duration-200"
          >
            Save Changes
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
