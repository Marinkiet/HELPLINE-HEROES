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
    if (!audio) return;

    const handleEnded = () => onPlayStateChange(false);
    const handlePlay = () => onPlayStateChange(true);
    const handlePause = () => onPlayStateChange(false);
    const handleError = (e: Event) => {
      console.error('🔊 Audio playback error:', e);
      onPlayStateChange(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    // Handle audio URL changes and autoplay
    if (audioUrl) {
      console.log('🎵 Loading new audio URL:', audioUrl.substring(0, 50) + '...');
      audio.src = audioUrl;
      audio.load(); // Ensure audio is loaded
      
      if (autoPlay && isNarrationEnabled) {
        console.log('🔊 Attempting autoplay...');
        // Small delay to ensure audio is ready
        setTimeout(() => {
          audio.play().catch((error) => {
            console.warn('⚠️ Audio autoplay prevented by browser:', error);
            // Don't set playing state if autoplay fails
          });
        }, 100);
      }
    } else if (isPlaying) {
      // Stop playing if no audio URL
      console.log('🔇 Stopping audio - no URL provided');
      audio.pause();
      onPlayStateChange(false);
    }

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl, onPlayStateChange, autoPlay, isNarrationEnabled]);

  // Handle narration toggle changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (!isNarrationEnabled && isPlaying) {
      audio.pause();
    }
  }, [isNarrationEnabled, audioUrl, isPlaying]);

  const togglePlayback = () => {
    if (!isNarrationEnabled) return;
    
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (isPlaying) {
      console.log('⏸️ Pausing audio playback');
      audio.pause();
    } else {
      console.log('▶️ Starting manual audio playback');
      audio.play().catch((error) => {
        console.error('❌ Manual audio play failed:', error);
      });
    }
  };

  if (!audioUrl) {
    return (
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-full bg-gray-200 text-gray-400">
          <VolumeX className="w-4 h-4" />
        </div>
        <span className="text-sm text-gray-500">Loading audio...</span>
      </div>
    );
  }

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
      <audio ref={audioRef} preload="auto" />
      {isNarrationEnabled && (
        <span className="text-sm text-green-600 font-medium">Narration ON</span>
      )}
      {!isNarrationEnabled && (
        <span className="text-sm text-red-600 font-medium">Narration OFF</span>
      )}
    </div>
  );
}