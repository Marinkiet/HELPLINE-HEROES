import { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import { useAudio } from '../contexts/AudioContext';

// Hook for getting app content
export function useAppContent(contentKey: string): string {
  const { selectedLanguage } = useAudio();
  const [content, setContent] = useState<string>(contentKey);

  useEffect(() => {
    const loadContent = async () => {
      const result = await contentService.getAppContent(contentKey, selectedLanguage);
      setContent(result);
    };

    loadContent();
  }, [contentKey, selectedLanguage]);

  return content;
}

// Hook for getting game content
function useGameContent(gameId: string, contentKey: string): string {
  const { selectedLanguage } = useAudio();
  const [content, setContent] = useState<string>(contentKey);

  useEffect(() => {
    const loadContent = async () => {
      const result = await contentService.getGameContent(gameId, contentKey, selectedLanguage);
      setContent(result);
    };

    loadContent();
  }, [gameId, contentKey, selectedLanguage]);

  return content;
}

// Hook for getting all app content (useful for components that need multiple content items)
function useAllAppContent(): Record<string, string> {
  const { selectedLanguage } = useAudio();
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadContent = async () => {
      const result = await contentService.getAllAppContent(selectedLanguage);
      setContent(result);
    };

    loadContent();
  }, [selectedLanguage]);

  return content;
}

// Hook for getting all game content
function useAllGameContent(gameId: string): Record<string, string> {
  const { selectedLanguage } = useAudio();
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadContent = async () => {
      const result = await contentService.getAllGameContent(gameId, selectedLanguage);
      setContent(result);
    };

    loadContent();
  }, [gameId, selectedLanguage]);

  return content;
}