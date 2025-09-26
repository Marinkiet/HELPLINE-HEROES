import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { engagementService } from '../services/engagementService';

interface EngagementContextType {
  trackGameStart: (gameId: string, gameName: string) => Promise<void>;
  trackGameEnd: (pointsEarned?: number, completed?: boolean) => Promise<void>;
  trackInteraction: (type: string, data?: Record<string, any>) => Promise<void>;
  updateLanguage: (language: string) => Promise<void>;
  updateAgeGroup: (ageGroup: 'early' | 'middle' | 'teen') => Promise<void>;
}

const EngagementContext = createContext<EngagementContextType | undefined>(undefined);

interface EngagementProviderProps {
  children: ReactNode;
}

export function EngagementProvider({ children }: EngagementProviderProps) {
  const trackGameStart = async (gameId: string, gameName: string) => {
    await engagementService.startGameSession(gameId, gameName);
  };

  const trackGameEnd = async (pointsEarned: number = 0, completed: boolean = false) => {
    await engagementService.endGameSession(pointsEarned, completed);
  };

  const trackInteraction = async (type: string, data: Record<string, any> = {}) => {
    await engagementService.trackInteraction(type, data);
  };

  const updateLanguage = async (language: string) => {
    await engagementService.updateLanguage(language);
  };

  const updateAgeGroup = async (ageGroup: 'early' | 'middle' | 'teen') => {
    await engagementService.updateAgeGroup(ageGroup);
  };

  const value = {
    trackGameStart,
    trackGameEnd,
    trackInteraction,
    updateLanguage,
    updateAgeGroup
  };

  return (
    <EngagementContext.Provider value={value}>
      {children}
    </EngagementContext.Provider>
  );
}

export function useEngagement() {
  const context = useContext(EngagementContext);
  if (context === undefined) {
    throw new Error('useEngagement must be used within an EngagementProvider');
  }
  return context;
}