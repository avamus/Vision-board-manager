"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { IconSelector, availableIcons } from "./icon-selector"

interface ChallengeCardManagerProps {
  memberId?: string;
  teamId?: string;
}

export function ChallengeCardManager() {
  const [memberId, setMemberId] = useState<string>("");
  const [teamId, setTeamId] = useState<string>("");
  
  // Extract member ID from URL parameters
  useEffect(() => {
    const url = new URL(window.location.href);
    const memberIdParam = url.searchParams.get('memberId');
    const teamIdParam = url.searchParams.get('teamId');
    
    console.log("Extracted memberId:", memberIdParam); // Debug logging
    
    if (memberIdParam) {
      setMemberId(memberIdParam);
    }
    
    if (teamIdParam) {
      setTeamId(teamIdParam);
    }
  }, []);
  const [titleText, setTitleText] = useState("Current Challenge")
  const [challengeTitle, setChallengeTitle] = useState("What we're fighting against:")
  const [whyTitle, setWhyTitle] = useState("Why it matters:")
  const [challenge, setChallenge] = useState("Market saturation and fierce competition")
  const [why, setWhy] = useState("Overcoming this challenge will set us apart and secure our position as industry leaders.")
  const [headerIconId, setHeaderIconId] = useState("icon2")
  const [showIconSelector, setShowIconSelector] = useState(false)

  // State for editing
  const [isEditing, setIsEditing] = useState(false)
  const [tempTitleText, setTempTitleText] = useState(titleText)
  const [tempChallengeTitle, setTempChallengeTitle] = useState(challengeTitle)
  const [tempWhyTitle, setTempWhyTitle] = useState(whyTitle)
  const [tempChallenge, setTempChallenge] = useState(challenge)
  const [tempWhy, setTempWhy] = useState(why)
  const [tempHeaderIconId, setTempHeaderIconId] = useState(headerIconId)

  // Load data from backend
  useEffect(() => {
    const loadChallengeData = async () => {
      if (!memberId) return;
      
      try {
        console.log("Attempting to fetch challenge data for memberId:", memberId);
        const response = await fetch(`/api/current-challenge?memberId=${memberId}`);
        console.log("API response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Challenge data received:", data);
          
          if (data && data.length > 0) {
            setTitleText(data[0].title || "Current Challenge");
            setChallengeTitle(data[0].challenge_title || "What we're fighting against:");
            setWhyTitle(data[0].why_title || "Why it matters:");
            setChallenge(data[0].challenge || "Market saturation and fierce competition");
            setWhy(data[0].why || "Overcoming this challenge will set us apart and secure our position as industry leaders.");
            setHeaderIconId(data[0].icon_id || "icon2");
          } else {
            console.log("No challenge data found for this member");
          }
        } else {
          console.error("Failed to fetch challenge data, status:", response.status);
        }
      } catch (error) {
        console.error('Error loading challenge data:', error);
      }
    };
    
    if (memberId) {
      console.log("Loading challenge data for memberId:", memberId);
      loadChallengeData();
    }
  }, [memberId]);

  // Start editing mode
  const startEditing = () => {
    setTempTitleText(titleText)
    setTempChallengeTitle(challengeTitle)
    setTempWhyTitle(whyTitle)
    setTempChallenge(challenge)
    setTempWhy(why)
    setTempHeaderIconId(headerIconId)
    setIsEditing(true)
  }

  // Save changes
  const saveChanges = async () => {
    setTitleText(tempTitleText)
    setChallengeTitle(tempChallengeTitle)
    setWhyTitle(tempWhyTitle)
    setChallenge(tempChallenge)
    setWhy(tempWhy)
    setHeaderIconId(tempHeaderIconId)
    setIsEditing(false)
    
    // Save to backend
    if (!memberId) {
      console.error("Cannot save: No member ID available");
      return;
    }
    
    try {
      console.log("Saving challenge data for memberId:", memberId);
      
      const payload = {
        memberstack_id: memberId,
        team_id: teamId,
        title: tempTitleText,
        challenge_title: tempChallengeTitle,
        why_title: tempWhyTitle,
        challenge: tempChallenge,
        why: tempWhy,
        icon_id: tempHeaderIconId
      };
      
      console.log("Sending payload:", payload);
      
      const response = await fetch(`/api/current-challenge?memberId=${memberId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log("Save response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save challenge data: ${JSON.stringify(errorData)}`);
      } else {
        const result = await response.json();
        console.log("Save successful, response:", result);
      }
    } catch (error) {
      console.error('Error saving challenge data:', error);
    }
  }

  // Cancel changes
  const cancelChanges = () => {
    setIsEditing(false)
  }

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

  return (
    <Card className="border border-[#ddd] rounded-xl h-full">
      <CardHeader className="pb-3 pt-3 px-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${isEditing ? "rounded-full border border-purple-200 p-1" : ""} inline-block mr-2`}>
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
                  alt="Section icon"
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
                alt="Section icon"
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={tempTitleText}
              onChange={(e) => setTempTitleText(e.target.value)}
              className="text-[21px] font-bold text-black px-2 py-1 border border-purple-300 rounded-md bg-white"
            />
          ) : (
            <span className="text-[21px] font-bold text-black">{titleText}</span>
          )}
        </div>
        
        {!isEditing ? (
          <button
            onClick={startEditing}
            className="hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <img 
              src="https://res.cloudinary.com/drkudvyog/image/upload/v1740768653/Edit_icon_duha_fzk30m.png" 
              alt="Edit" 
              width="14" 
              height="14" 
            />
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
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        {/* What we're fighting against */}
        <Card className="border border-[#ddd] rounded-xl bg-white">
          <CardContent className="p-3">
            {isEditing ? (
              <input
                type="text"
                value={tempChallengeTitle}
                onChange={(e) => setTempChallengeTitle(e.target.value)}
                className="font-black mb-2 text-[19px] text-[#5b06be] px-2 py-1 border border-purple-300 rounded-md bg-white"
              />
            ) : (
              <h3 className="font-black mb-2 text-[19px] text-[#5b06be]">{challengeTitle}</h3>
            )}
            
            {isEditing ? (
              <textarea
                value={tempChallenge}
                onChange={(e) => setTempChallenge(e.target.value)}
                className="text-[15px] font-semibold w-full p-2 border border-gray-300 rounded-md bg-white"
                rows={2}
              />
            ) : (
              <p className="text-[15px] font-semibold">{challenge}</p>
            )}
          </CardContent>
        </Card>
        
        {/* Why it matters */}
        <Card className="border border-[#ddd] rounded-xl bg-white">
          <CardContent className="p-3">
            {isEditing ? (
              <input
                type="text"
                value={tempWhyTitle}
                onChange={(e) => setTempWhyTitle(e.target.value)}
                className="font-black mb-2 text-[19px] text-[#5b06be] px-2 py-1 border border-purple-300 rounded-md bg-white"
              />
            ) : (
              <h3 className="font-black mb-2 text-[19px] text-[#5b06be]">{whyTitle}</h3>
            )}
            
            {isEditing ? (
              <textarea
                value={tempWhy}
                onChange={(e) => setTempWhy(e.target.value)}
                className="text-[15px] font-semibold w-full p-2 border border-gray-300 rounded-md bg-white"
                rows={2}
              />
            ) : (
              <p className="text-[15px] font-semibold">{why}</p>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
