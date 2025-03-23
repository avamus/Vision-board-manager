"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ProgressWinsSectionProps {
  memberId?: string;
  teamId?: string;
}

export function ProgressWinsSection({ memberId, teamId }: ProgressWinsSectionProps) {
  const [titleText, setTitleText] = useState("Progress & Wins")
  const [victoriesTitleText, setVictoriesTitleText] = useState("Recent Victories:")
  const [wins, setWins] = useState([
    "Secured 3 major client contracts",
    "Launched innovative product feature",
    "Achieved 98% customer satisfaction rate",
  ])

  // Load data from backend
  useEffect(() => {
    const loadWinsData = async () => {
      if (!memberId) return;
      
      try {
        console.log("Attempting to fetch wins data for memberId:", memberId);
        const response = await fetch(`/api/progress-wins?memberId=${memberId}`);
        console.log("API response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Wins data received:", data);
          
          if (data && data.length > 0) {
            setTitleText(data[0].title || "Progress & Wins");
            setVictoriesTitleText(data[0].victories_title || "Recent Victories:");
            
            // Extract wins from content (stored as JSON array)
            try {
              const winsContent = JSON.parse(data[0].wins);
              if (Array.isArray(winsContent)) {
                setWins(winsContent);
              }
            } catch (e) {
              console.error('Error parsing wins content:', e);
            }
          } else {
            console.log("No wins data found for this member");
          }
        } else {
          console.error("Failed to fetch wins data, status:", response.status);
        }
      } catch (error) {
        console.error('Error loading wins data:', error);
      }
    };
    
    if (memberId) {
      console.log("Loading wins data for memberId:", memberId);
      loadWinsData();
    }
  }, [memberId]);

  return (
    <Card className="border border-[#ddd] rounded-xl h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-2xl font-bold text-black">{titleText}</span>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        {/* Recent Victories container */}
        <Card className="border border-[#ddd] rounded-xl h-full">
          <CardContent className="p-4 flex flex-col h-full">
            <h3 className="font-semibold mb-6 text-lg text-[#5b06be]">{victoriesTitleText}</h3>
            <ul className="space-y-6 flex-grow">
              {wins.map((win, index) => (
                <li key={index} className="flex items-start">
                  <img
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1737477323/Trophy_icon_duha_rdwgow.png"
                    alt="Trophy Icon"
                    width={16}
                    height={16}
                    className="mr-3 mt-1 flex-shrink-0"
                  />
                  <span className="text-base">{win}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
