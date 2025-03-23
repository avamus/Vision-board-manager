"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { IconSelector, availableIcons } from "./icon-selector"
import { Goal, Subtask, calculateProgress, generateId } from "../../utils/subtask-types"
import { ImageGalleryManager } from "./image-components-manager"
import { ChallengeCardManager } from "./challenge-card-manager"
import { TeamGoalsVision } from "./team-goals-vision"

// Progress & Wins Modal Component
function ProgressWinsEditModal({ 
  isOpen, 
  onClose, 
  memberId, 
  teamId,
  initialData,
  onSave
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  memberId: string; 
  teamId: string;
  initialData: {
    title: string;
    victoriesTitle: string;
    wins: string[];
    iconId: string;
  };
  onSave: (data: {
    title: string;
    victoriesTitle: string;
    wins: string[];
    iconId: string;
  }) => void;
}) {
  const [title, setTitle] = useState(initialData.title);
  const [victoriesTitle, setVictoriesTitle] = useState(initialData.victoriesTitle);
  const [wins, setWins] = useState([...initialData.wins]);
  const [iconId, setIconId] = useState(initialData.iconId);
  const [showIconSelector, setShowIconSelector] = useState(false);
  
  // Max allowed wins
  const maxWins = 5;
  
  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setTitle(initialData.title);
      setVictoriesTitle(initialData.victoriesTitle);
      setWins([...initialData.wins]);
      setIconId(initialData.iconId);
    }
  }, [isOpen, initialData]);
  
  // Get icon by ID
  const getIconSrc = (iconId: string) => {
    const icon = availableIcons.find(icon => icon.id === iconId);
    return icon ? icon.src : availableIcons[0].src;
  };

  // Handle icon selection
  const handleSelectIcon = (iconId: string) => {
    setIconId(iconId);
    setShowIconSelector(false);
  };
  
  // Update win text
  const updateWin = (index: number, text: string) => {
    const newWins = [...wins];
    newWins[index] = text;
    setWins(newWins);
  };
  
  // Add new win
  const addWin = () => {
    if (wins.length < maxWins) {
      setWins([...wins, "New achievement"]);
    }
  };
  
  // Remove win
  const removeWin = (index: number) => {
    const newWins = [...wins];
    newWins.splice(index, 1);
    setWins(newWins);
  };
  
  // Handle save
  const handleSave = () => {
    onSave({
      title,
      victoriesTitle,
      wins,
      iconId
    });
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Progress & Wins</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Section title and icon */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Section Icon</label>
            <div className="flex items-center">
              <div 
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer"
                onClick={() => setShowIconSelector(!showIconSelector)}
              >
                <img 
                  src={getIconSrc(iconId)}
                  alt="Section icon"
                  width={20}
                  height={20}
                />
              </div>
              {showIconSelector && (
                <div className="absolute mt-8 z-10">
                  <IconSelector 
                    selectedIconId={iconId}
                    onSelectIcon={handleSelectIcon}
                    onClose={() => setShowIconSelector(false)}
                  />
                </div>
              )}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="ml-2 flex-grow p-2 border border-gray-300 rounded-md"
                placeholder="Section title"
              />
            </div>
          </div>
          
          {/* Victories title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Victories Section Title</label>
            <input
              type="text"
              value={victoriesTitle}
              onChange={(e) => setVictoriesTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Recent Victories:"
            />
          </div>
          
          {/* Wins list */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Achievements</label>
              {wins.length < maxWins && (
                <button 
                  onClick={addWin}
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Achievement
                </button>
              )}
            </div>
            
            {wins.length >= maxWins && (
              <p className="text-xs text-orange-500">Maximum of {maxWins} achievements reached</p>
            )}
            
            <div className="space-y-2">
              {wins.map((win, index) => (
                <div key={index} className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <input
                    type="text"
                    value={win}
                    onChange={(e) => updateWin(index, e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md text-sm"
                  />
                  <button 
                    onClick={() => removeWin(index)}
                    className="ml-1 text-gray-400 hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// OurVisionManager Component
function OurVisionManager({ memberId, teamId }: { memberId: string, teamId: string }) {
  // Component code remains the same...
  // (Your existing OurVisionManager implementation)
  const [visionTitle, setVisionTitle] = useState("Our Vision:")
  const [vision, setVision] = useState(
    "To become the industry leader in innovative solutions, setting new standards for excellence and customer satisfaction.",
  )
  
  const [headerIconId, setHeaderIconId] = useState("icon9")
  const [showIconSelector, setShowIconSelector] = useState(false)
  
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false)
  const [tempVision, setTempVision] = useState(vision)
  const [tempHeaderIconId, setTempHeaderIconId] = useState(headerIconId)
  const [tempVisionTitle, setTempVisionTitle] = useState(visionTitle)
  
  // Get icon by ID
  const getIconSrc = (iconId: string) => {
    const icon = availableIcons.find(icon => icon.id === iconId);
    return icon ? icon.src : availableIcons[0].src;
  };

  // Handle icon selection
  const handleSelectIcon = (iconId: string) => {
    setTempHeaderIconId(iconId);
    setShowIconSelector(false);
  };

  // Start editing mode
  const startEditing = () => {
    setTempVision(vision)
    setTempHeaderIconId(headerIconId)
    setTempVisionTitle(visionTitle)
    setIsEditing(true)
  }

  // Save changes
  const saveChanges = async () => {
    setVision(tempVision)
    setHeaderIconId(tempHeaderIconId)
    setVisionTitle(tempVisionTitle)
    setIsEditing(false)
    
    // Save to backend
    try {
      const response = await fetch(`/api/team-goals-vision?memberId=${memberId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberstack_id: memberId,
          team_id: teamId,
          component_type: 'vision',
          title: tempVisionTitle,
          content: tempVision,
          icon_id: tempHeaderIconId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save vision data');
      }
    } catch (error) {
      console.error('Error saving vision data:', error);
    }
  }

  // Cancel changes
  const cancelChanges = () => {
    setIsEditing(false)
  }
  
  // Load data from backend
  useEffect(() => {
    const loadVisionData = async () => {
      try {
        const response = await fetch(`/api/team-goals-vision?memberId=${memberId}&componentType=vision`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setVisionTitle(data[0].title || "Our Vision:")
            setVision(data[0].content || "")
            setHeaderIconId(data[0].icon_id || "icon9")
          }
        }
      } catch (error) {
        console.error('Error loading vision data:', error);
      }
    };
    
    if (memberId) {
      loadVisionData();
    }
  }, [memberId]);
  
  return (
    <Card className="border border-[#ddd] rounded-xl">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`${isEditing ? "rounded-full border border-purple-200 p-1" : ""} inline-block mr-3`}>
              {isEditing ? (
                <div 
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowIconSelector(!showIconSelector);
                  }}
                >
                  <img 
                    src={getIconSrc(tempHeaderIconId)}
                    alt="Vision icon"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  {showIconSelector && (
                    <IconSelector 
                      selectedIconId={tempHeaderIconId}
                      onSelectIcon={handleSelectIcon}
                      onClose={() => setShowIconSelector(false)}
                    />
                  )}
                </div>
              ) : (
                <img 
                  src={getIconSrc(headerIconId)}
                  alt="Vision icon"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              )}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={tempVisionTitle}
                onChange={(e) => setTempVisionTitle(e.target.value)}
                className="font-black text-[19px] text-[#5b06be] px-2 py-1 border border-purple-300 rounded-md bg-white"
              />
            ) : (
              <h3 className="font-black text-[19px] text-[#5b06be]">{visionTitle}</h3>
            )}
          </div>
          
          {!isEditing ? (
            <button
              onClick={startEditing}
              className="hover:bg-gray-100 rounded-full p-1 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          ) : (
            <div className="flex space-x-2">
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
          )}
        </div>
        
        <div className="mt-3">
          {isEditing ? (
            <textarea 
              value={tempVision}
              onChange={(e) => setTempVision(e.target.value)}
              className="text-[15px] font-semibold w-full p-2 border border-gray-300 rounded-md bg-white"
              rows={2}
            />
          ) : (
            <p className="text-[15px] font-semibold">{vision}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// VisionBoardSection Component
function VisionBoardSection({ memberId, teamId }: { memberId: string, teamId: string }) {
  // Component code remains the same...
  // (Your existing VisionBoardSection implementation)
  const [images, setImages] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load existing images
  useEffect(() => {
    const loadVisionBoardImages = async () => {
      try {
        const response = await fetch(`/api/team-goals-vision?memberId=${memberId}&componentType=vision_board`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            // Extract all image URLs from the content field which should be a JSON string of URLs
            const imageUrls = data.map((item: any) => item.image_url).filter(Boolean);
            setImages(imageUrls);
          }
        }
      } catch (error) {
        console.error('Error loading vision board images:', error);
      }
    };
    
    if (memberId) {
      loadVisionBoardImages();
    }
  }, [memberId]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  // Upload image
  const uploadImage = async () => {
    if (!newImage) return;
    
    setUploadingImage(true);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        const response = await fetch(`/api/team-goals-vision?memberId=${memberId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            memberstack_id: memberId,
            team_id: teamId,
            component_type: 'vision_board',
            image_url: base64data,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const result = await response.json();
        setImages([...images, result.image_url]);
        setNewImage(null);
        setUploadingImage(false);
      };
      
      reader.readAsDataURL(newImage);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadingImage(false);
    }
  };

  // Delete image
  const deleteImage = async (imageUrl: string) => {
    try {
      const response = await fetch(`/api/team-goals-vision?memberId=${memberId}&imageUrl=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
      
      setImages(images.filter(img => img !== imageUrl));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <Card className="border border-[#ddd] rounded-xl">
      <CardHeader className="pb-3 pt-3 px-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[21px] font-bold text-black">Vision Board</span>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden h-32">
              <img 
                src={imageUrl} 
                alt={`Vision ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <button
                  onClick={() => deleteImage(imageUrl)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          
          {isEditing && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center p-2">
              <label className="cursor-pointer text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs">Upload Image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
              
              {newImage && (
                <div className="mt-2 text-center">
                  <p className="text-xs truncate max-w-full">{newImage.name}</p>
                  <button
                    onClick={uploadImage}
                    disabled={uploadingImage}
                    className="mt-1 px-2 py-1 text-xs bg-[#5b06be] hover:bg-[#4a05a2] text-white rounded-md"
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Main VisionDashboardManager Component
export function VisionDashboardManager() {
  const [memberId, setMemberId] = useState<string>("");
  const [teamId, setTeamId] = useState<string>("");
  
  // State for Progress & Wins Modal
  const [isProgressWinsModalOpen, setIsProgressWinsModalOpen] = useState(false);
  const [progressWinsData, setProgressWinsData] = useState({
    title: "Progress & Wins",
    victoriesTitle: "Recent Victories:",
    wins: [
      "Secured 3 major client contracts",
      "Launched innovative product feature",
      "Achieved 98% customer satisfaction rate",
    ],
    iconId: "icon5"
  });
  
  // Extract member ID from URL parameters
  useEffect(() => {
    const url = new URL(window.location.href);
    const memberIdParam = url.searchParams.get('memberId');
    const teamIdParam = url.searchParams.get('teamId');
    
    console.log("Dashboard extracted memberId:", memberIdParam);
    
    if (memberIdParam) {
      setMemberId(memberIdParam);
    }
    
    if (teamIdParam) {
      setTeamId(teamIdParam);
    }
  }, []);
  
  // Load Progress & Wins data
  useEffect(() => {
    const loadProgressWinsData = async () => {
      if (!memberId) return;
      
      try {
        const response = await fetch(`/api/progress-wins?memberId=${memberId}`);
        if (response.ok) {
          const data = await response.json();
          
          if (data && data.length > 0) {
            const winsData = data[0];
            let parsedWins = [];
            
            try {
              parsedWins = JSON.parse(winsData.wins || "[]");
              if (!Array.isArray(parsedWins)) {
                parsedWins = [];
              }
            } catch (e) {
              console.error('Error parsing wins:', e);
              parsedWins = [];
            }
            
            setProgressWinsData({
              title: winsData.title || "Progress & Wins",
              victoriesTitle: winsData.victories_title || "Recent Victories:",
              wins: parsedWins.length > 0 ? parsedWins : [
                "Secured 3 major client contracts",
                "Launched innovative product feature",
                "Achieved 98% customer satisfaction rate",
              ],
              iconId: winsData.icon_id || "icon5"
            });
          }
        }
      } catch (error) {
        console.error('Error loading progress & wins data:', error);
      }
    };
    
    if (memberId) {
      loadProgressWinsData();
    }
  }, [memberId]);
  
  // Save Progress & Wins data
  const saveProgressWinsData = async (data: {
    title: string;
    victoriesTitle: string;
    wins: string[];
    iconId: string;
  }) => {
    setProgressWinsData(data);
    
    try {
      const response = await fetch(`/api/progress-wins?memberId=${memberId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberstack_id: memberId,
          team_id: teamId,
          title: data.title,
          victories_title: data.victoriesTitle,
          wins: JSON.stringify(data.wins),
          icon_id: data.iconId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save progress & wins data');
      }
    } catch (error) {
      console.error('Error saving progress & wins data:', error);
    }
  };
  
  return (
    <div className="w-full">
      {/* Dashboard content */}
      <div className="flex flex-col gap-3">
        <TeamGoalsVision memberId={memberId} teamId={teamId} />
        <OurVisionManager memberId={memberId} teamId={teamId} />
        <div className="grid gap-3 md:grid-cols-2">
          <ChallengeCardManager />
          
          {/* Progress & Wins Section */}
          <div className="h-full">
            <div className="w-full h-full border border-[#ddd] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between bg-white p-3 border-b border-[#ddd]">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[21px] font-bold text-black">{progressWinsData.title}</span>
                </div>
                
                <button
                  onClick={() => setIsProgressWinsModalOpen(true)}
                  className="hover:bg-gray-100 rounded-full p-1 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-white p-4 h-[calc(100%-60px)]">
                <div className="w-full h-full border border-[#ddd] rounded-xl overflow-hidden">
                  <div className="p-3 h-full">
                    <h3 className="font-black mb-3 text-[19px] text-[#5b06be]">{progressWinsData.victoriesTitle}</h3>
                    <ul className="space-y-3">
                      {progressWinsData.wins.map((win, index) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          <span className="text-[15px] font-semibold">{win}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <VisionBoardSection memberId={memberId} teamId={teamId} />
      </div>
      
      {/* Progress & Wins Edit Modal */}
      <ProgressWinsEditModal 
        isOpen={isProgressWinsModalOpen}
        onClose={() => setIsProgressWinsModalOpen(false)}
        memberId={memberId}
        teamId={teamId}
        initialData={progressWinsData}
        onSave={saveProgressWinsData}
      />
    </div>
  )
}
