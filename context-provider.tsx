"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the structure of the user context
interface UserContextType {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  team: {
    id: string;
    name: string;
  } | null;
  loading: boolean;
  error: string | null;
}

// Create the user context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  team: null,
  loading: true,
  error: null
});

// Hook to use the user context
export const useUserContext = () => useContext(UserContext);

// Debug component to display the current user context
export function UserContextDebug() {
  const { user, team, loading } = useUserContext();
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  if (loading) return <div className="text-xs text-gray-400">Loading user data...</div>;
  
  return (
    <div className="text-xs text-gray-400 my-2 p-2 bg-gray-50 rounded">
      <div>User ID: {user?.id || 'Not set'}</div>
      <div>Team ID: {team?.id || 'Not set'}</div>
    </div>
  );
}

// Provider component for the user context
export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserContextType['user']>(null);
  const [team, setTeam] = useState<UserContextType['team']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate a delay
        setTimeout(() => {
          // Set dummy user data for testing
          setUser({
            id: 'user-1',
            name: 'Test User',
            email: 'test@example.com'
          });
          
          setTeam({
            id: 'team-1',
            name: 'Test Team'
          });
          
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, team, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}
