import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AudioContextType {
  isNarrationEnabled: boolean;
  toggleNarration: () => void;
  selectedLanguage: 'en' | 'af' | 'zu';
  setSelectedLanguage: (language: 'en' | 'af' | 'zu') => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [isNarrationEnabled, setIsNarrationEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'af' | 'zu'>('en');

  const toggleNarration = () => {
    setIsNarrationEnabled(prev => !prev);
  };

  const value = {
    isNarrationEnabled,
    toggleNarration,
    selectedLanguage,
    setSelectedLanguage
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}