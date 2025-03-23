"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ChallengeCardProps {
  memberId?: string;
  teamId?: string;
}

export function ChallengeCard({ memberId, teamId }: ChallengeCardProps) {
  const [titleText, setTitleText] = useState("Current Challenge")
  const [challengeTitle, setChallengeTitle] = useState("What we're fighting against:")
  const [whyTitle, setWhyTitle] = useState("Why it matters:")
  const [challenge, setChallenge] = useState("Market saturation and fierce competition")
  const [why, setWhy] = useState("Overcoming this challenge will set us apart and secure our position as industry leaders.")

  // Load data from backend
  useEffect(() => {
    const loadChallengeData = async () => {
      if (!memberId) return;
      
      try {
        const response = await fetch(`/api/current-challenge?memberId=${memberId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setTitleText(data[0].title || "Current Challenge");
            setChallengeTitle(data[0].challenge_title || "What we're fighting against:");
            setWhyTitle(data[0].why_title || "Why it matters:");
            setChallenge(data[0].challenge || "Market saturation and fierce competition");
            setWhy(data[0].why || "Overcoming this challenge will set us apart and secure our position as industry leaders.");
          }
        }
      } catch (error) {
        console.error('Error loading challenge data:', error);
      }
    };
    
    loadChallengeData();
  }, [memberId]);

  return (
    <Card className="border border-[#ddd] rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-2xl font-bold text-black">{titleText}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* What we're fighting against container */}
        <Card className="border border-[#ddd] rounded-xl">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 text-lg text-[#5b06be]">{challengeTitle}</h3>
            <p className="text-base">{challenge}</p>
          </CardContent>
        </Card>
        
        {/* Why it matters container */}
        <Card className="border border-[#ddd] rounded-xl">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 text-lg text-[#5b06be]">{whyTitle}</h3>
            <p className="text-base">{why}</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
