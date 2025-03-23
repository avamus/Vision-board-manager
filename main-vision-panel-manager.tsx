import { useState } from "react"

export function MainVisionPanelManager() {
  const [vision, setVision] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [tempVision, setTempVision] = useState(vision)

  // Otevření režimu editace
  const startEditing = () => {
    setTempVision(vision)
    setIsEditing(true)
  }

  // Uložení změn
  const saveChanges = () => {
    setVision(tempVision)
    setIsEditing(false)
  }

  // Zrušení změn
  const cancelChanges = () => {
    setIsEditing(false)
  }

  return (
    <div className="bg-white text-foreground rounded-2xl border border-[#ddd] p-4 relative group">
      {!isEditing ? (
        <>
          <p className="text-[21px] font-light leading-relaxed">
            {vision || "Click to add your vision..."}
          </p>
          <button
            onClick={startEditing}
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-full p-1 transition-opacity"
          >
            <img 
              src="https://res.cloudinary.com/drkudvyog/image/upload/v1740768653/Edit_icon_duha_fzk30m.png" 
              alt="Edit" 
              width="14" 
              height="14" 
            />
          </button>
        </>
      ) : (
        <div className="w-full">
          <textarea
            value={tempVision}
            onChange={(e) => setTempVision(e.target.value)}
            className="text-[21px] font-light leading-relaxed w-full p-2 border border-purple-300 rounded-md bg-white"
            rows={3}
            placeholder="Write your vision here..."
          />
          <div className="flex justify-end space-x-2 mt-3">
            <button 
              onClick={cancelChanges}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button 
              onClick={saveChanges}
              className="px-2 py-1 text-xs bg-[#5b06be] hover:bg-[#4a05a2] text-white rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
