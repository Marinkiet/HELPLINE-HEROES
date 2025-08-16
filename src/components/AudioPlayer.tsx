import React, { useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface AudioPlayerProps {
  audioUrl?: string;
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
  autoPlay?: boolean;
}

export function AudioPlayer({ audioUrl, isPlaying, onPlayStateChange, autoPlay = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isNarrationEnabled } = useAudio();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const handleEnded = () => onPlayStateChange(false);
    const handlePlay = () => onPlayStateChange(true);
    const handlePause = () => onPlayStateChange(false);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    if (autoPlay && isNarrationEnabled) {
      audio.play().catch(console.error);
    }

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioUrl, onPlayStateChange, autoPlay]);

  const togglePlayback = () => {
    if (!isNarrationEnabled) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  };

  if (!audioUrl) return null;

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={togglePlayback}
        className={`p-2 rounded-full transition-colors duration-200 ${
          isNarrationEnabled 
            ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        disabled={!isNarrationEnabled}
      >
        {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      <audio ref={audioRef} src={audioUrl} preload="auto" />
    </div>
  );
}