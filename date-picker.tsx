"use client"

import * as React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"

interface DatePickerProps {
  selected: Date | null
  onSelect: (date: Date | null) => void
  onClose: () => void
  minDate?: Date
}

export function DatePicker({ selected, onSelect, onClose, minDate }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selected || new Date())

  const days = React.useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const previousMonth = () => setCurrentMonth((prev) => subMonths(prev, 1))
  const nextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1))

  const handleDayClick = (day: Date) => {
    if (minDate && day < minDate) return
    onSelect(day)
  }

  const handleClear = () => {
    onSelect(null)
    onClose()
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    onSelect(today)
    onClose()
  }

  return (
    <div className="absolute top-full left-0 mt-1 w-[280px] bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-100" onClick={previousMonth}>
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-100" onClick={nextMonth}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-center text-xs text-gray-500 font-medium">
            {day.charAt(0)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() - 1 }).map(
          (_, i) => (
            <div key={`empty-${i}`} className="h-8" />
          ),
        )}

        {days.map((day) => (
          <Button
            key={day.toISOString()}
            variant="ghost"
            className={`h-8 w-8 p-0 text-sm hover:bg-gray-100 ${
              selected && isSameDay(day, selected) ? "bg-[#5b06be] text-white hover:bg-[#5b06be] hover:text-white" : ""
            } ${minDate && day < minDate ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handleDayClick(day)}
            disabled={minDate && day < minDate}
          >
            {format(day, "d")}
          </Button>
        ))}
      </div>

      <div className="flex justify-between mt-4 text-sm">
        <Button
          variant="ghost"
          size="sm"
          className="text-[#5b06be] hover:text-[#5b06be] hover:bg-[#5b06be]/10"
          onClick={handleClear}
        >
          Clear
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#5b06be] hover:text-[#5b06be] hover:bg-[#5b06be]/10"
          onClick={handleToday}
        >
          Today
        </Button>
      </div>
    </div>
  )
}
