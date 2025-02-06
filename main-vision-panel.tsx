import { useState } from "react"
import { EditableText } from "./editable-text"

export function MainVisionPanel() {
  const [vision, setVision] = useState("")

  return (
    <EditableText
      value={vision}
      onChange={setVision}
      className="text-3xl font-light leading-relaxed bg-white text-foreground rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6"
    />
  )
}
