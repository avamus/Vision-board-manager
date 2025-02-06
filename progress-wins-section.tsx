import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format, differenceInDays, startOfToday } from "date-fns"
import Image from "next/image"
import { DatePicker } from "./date-picker"

export function ProgressWinsSection() {
  const [isEditing, setIsEditing] = useState(false)
  const [titleText, setTitleText] = useState("Progress & Wins")
  const [progressTitleText, setProgressTitleText] = useState("Team Progress:")
  const [victoriesTitleText, setVictoriesTitleText] = useState("Recent Victories:")
  const [deadline, setDeadline] = useState<Date | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [wins, setWins] = useState([
    "Secured 3 major client contracts",
    "Launched innovative product feature",
    "Achieved 98% customer satisfaction rate",
  ])

  const handleSave = () => {
    if (deadline && isNaN(deadline.getTime())) {
      setDeadline(null)
    }
    setIsEditing(false)
  }

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
              value={progressTitleText}
              onChange={(e) => setProgressTitleText(e.target.value)}
              className="font-semibold mb-4 text-lg text-[#fbb350]"
            />
          ) : (
            <h3 className="font-semibold mb-4 text-lg text-[#fbb350]">{progressTitleText}</h3>
          )}
          <div className="space-y-4">
            {isEditing ? (
              <div className="relative">
                <Input
                  type="text"
                  readOnly
                  value={deadline ? format(deadline, "MM/dd/yyyy") : ""}
                  onClick={() => setIsCalendarOpen(true)}
                  className="text-base w-full pl-3 pr-10 py-2 border-2 border-gray-300 rounded-md focus:border-[#5b06be] focus:ring focus:ring-[#5b06be] focus:ring-opacity-50 transition-all duration-200 cursor-pointer"
                  placeholder="Click to select date"
                />
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <Image
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1734437402/calendar_icon_2_efgdme.png"
                    alt="Calendar Icon"
                    width={20}
                    height={20}
                  />
                </button>
                {isCalendarOpen && (
                  <DatePicker
                    selected={deadline}
                    onSelect={(date) => {
                      setDeadline(date)
                      setIsCalendarOpen(false)
                    }}
                    onClose={() => setIsCalendarOpen(false)}
                    minDate={startOfToday()}
                  />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {deadline ? (
                  <>
                    <p className="text-sm font-medium">Deadline: {format(deadline, "MM/dd/yyyy")}</p>
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-[#fbb350]/20">
                      <div
                        style={{
                          width: `${Math.max(0, Math.min(100, (1 - differenceInDays(deadline, new Date()) / 30) * 100))}%`,
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#fbb350] rounded-full"
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {differenceInDays(deadline, new Date()) > 0
                        ? `${differenceInDays(deadline, new Date())} days left`
                        : "Deadline passed"}
                    </p>
                  </>
                ) : (
                  <p className="text-sm">No deadline set</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div>
          {isEditing ? (
            <Input
              value={victoriesTitleText}
              onChange={(e) => setVictoriesTitleText(e.target.value)}
              className="font-semibold mb-4 text-lg text-[#fbb350]"
            />
          ) : (
            <h3 className="font-semibold mb-4 text-lg text-[#fbb350]">{victoriesTitleText}</h3>
          )}
          <ul className="space-y-4">
            {wins.map((win, index) => (
              <li key={index} className="flex items-center">
                <Image
                  src="https://res.cloudinary.com/drkudvyog/image/upload/v1737477323/Trophy_icon_duha_rdwgow.png"
                  alt="Trophy Icon"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                {isEditing ? (
                  <Input
                    value={win}
                    onChange={(e) => {
                      const newWins = [...wins]
                      newWins[index] = e.target.value
                      setWins(newWins)
                    }}
                    className="text-base"
                  />
                ) : (
                  <span className="text-base">{win}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        {isEditing && (
          <div className="px-6 pb-6">
            <Button
              onClick={handleSave}
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
