import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function ChallengeCard() {
  const [isEditing, setIsEditing] = useState(false)
  const [titleText, setTitleText] = useState("Current Challenge")
  const [enemy, setEnemy] = useState("Market saturation and fierce competition")
  const [importance, setImportance] = useState(
    "Overcoming this challenge will set us apart and secure our position as industry leaders.",
  )
  const [fightingAgainstTitle, setFightingAgainstTitle] = useState("What we're fighting against:")
  const [importanceTitle, setImportanceTitle] = useState("Why it matters:")

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
              value={fightingAgainstTitle}
              onChange={(e) => setFightingAgainstTitle(e.target.value)}
              className="font-semibold mb-4 text-lg text-[#fbb350]"
            />
          ) : (
            <h3 className="font-semibold mb-4 text-lg text-[#fbb350]">{fightingAgainstTitle}</h3>
          )}
          {isEditing ? (
            <Textarea value={enemy} onChange={(e) => setEnemy(e.target.value)} className="text-base" />
          ) : (
            <p className="text-base">{enemy}</p>
          )}
        </div>
        <div>
          {isEditing ? (
            <Input
              value={importanceTitle}
              onChange={(e) => setImportanceTitle(e.target.value)}
              className="font-semibold mb-4 text-lg text-[#fbb350]"
            />
          ) : (
            <h3 className="font-semibold mb-4 text-lg text-[#fbb350]">{importanceTitle}</h3>
          )}
          {isEditing ? (
            <Textarea value={importance} onChange={(e) => setImportance(e.target.value)} className="text-base" />
          ) : (
            <p className="text-base">{importance}</p>
          )}
        </div>
        {isEditing && (
          <div className="px-6 pb-6">
            <Button
              onClick={() => setIsEditing(false)}
              className="w-full rounded-full bg-[#fbb350] hover:bg-[#fbb350]/80 text-white transition-colors duration-200"
            >
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
