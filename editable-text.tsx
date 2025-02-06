import { useState } from "react"
import { Input } from "@/components/ui/input"

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function EditableText({ value, onChange, className }: EditableTextProps): string {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    onChange(tempValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      onChange(tempValue)
    }
  }

  if (isEditing) {
    return (
      <Input
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
        autoFocus
      />
    )
  }

  return value
}
