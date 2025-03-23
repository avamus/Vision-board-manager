import { useState, useEffect } from "react";

export type IconOption = {
  id: string;
  src: string;
  alt: string;
}

// Predefined icons
export const availableIcons: IconOption[] = [
  {
    id: "icon1",
    src: "https://res.cloudinary.com/drkudvyog/image/upload/v1740850701/Sada_-_icon_2_duha_oyhuqz.png",
    alt: "Icon 1"
  },
  {
    id: "icon2",
    src: "https://res.cloudinary.com/drkudvyog/image/upload/v1740852595/Sada_-_Icon_6_duha_khkhvb.png",
    alt: "Icon 2"
  },
  {
    id: "icon3",
    src: "https://res.cloudinary.com/drkudvyog/image/upload/v1740852595/Sada_-_icon_5_duha_uz3kc1.png",
    alt: "Icon 3"
  },
  {
    id: "icon4",
    src: "https://res.cloudinary.com/drkudvyog/image/upload/v1740852596/Sada_-_Icon_7_duha_tvcepe.png",
    alt: "Icon 4"
  },
  {
    id: "icon5",
    src: "https://res.cloudinary.com/drkudvyog/image/upload/v1740852596/Sada_-_icon_10_duha_hppcnr.png",
    alt: "Icon 5"
  },
  {
    id: "icon6",
    src: "https://res.cloudinary.com/drkudvyog/image/upload/v1740852596/Sada_-_icon_8_duha_js7ncj.png",
    alt: "Icon 6"
  },
  {
    id: "icon7",
    src: "https://res.cloudinary.com/drkudvyog/image/upload/v1740852596/Sada_-_icon_9_duha_o8gkmr.png",
    alt: "Icon 7"
  },
  {
    id: "icon8",
    src: "https://res.cloudinary.com/drkudvyog/image/upload/v1740852603/bonus_benefits_icon_duha_m1t74p.png",
    alt: "Icon 8"
  },
  {
    id: "icon9",
    src: "https://res.cloudinary.com/drkudvyog/image/upload/v1740852603/Sada_-_icon_1_duha_nqo6b5.png",
    alt: "Icon 9"
  },
  {
    id: "icon10",
    src: "https://res.cloudinary.com/drkudvyog/image/upload/v1740852603/Sada_-_icon_3_duha_gknwz1.png",
    alt: "Icon 10"
  }
];

interface IconSelectorProps {
  selectedIconId: string;
  onSelectIcon: (iconId: string) => void;
  onClose: () => void;
}

export function IconSelector({ selectedIconId, onSelectIcon, onClose }: IconSelectorProps) {
  const [hoveredIconId, setHoveredIconId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Ensure the component renders after mounting, which helps with server-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render anything until mounted
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      <div 
        className="relative p-4 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[19px] font-semibold mb-3">Select Icon</h3>
        <div className="grid grid-cols-5 gap-2">
          {availableIcons.map((icon) => (
            <div
              key={icon.id}
              className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer transition-all border-2 ${
                selectedIconId === icon.id 
                  ? "bg-purple-100 border-[#5b06be]" 
                  : hoveredIconId === icon.id 
                    ? "bg-gray-100 border-gray-200" 
                    : "border-transparent hover:bg-gray-50"
              }`}
              onClick={() => {
                onSelectIcon(icon.id);
              }}
              onMouseEnter={() => setHoveredIconId(icon.id)}
              onMouseLeave={() => setHoveredIconId(null)}
            >
              <img 
                src={icon.src} 
                alt={icon.alt}
                width={20}
                height={20}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => {}} // Closed when selecting an icon
            className="px-3 py-1 text-xs bg-[#5b06be] hover:bg-[#4a05a2] text-white rounded-md"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
