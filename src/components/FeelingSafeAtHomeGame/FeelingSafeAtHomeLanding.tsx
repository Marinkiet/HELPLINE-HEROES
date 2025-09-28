import React, { useState, useEffect } from 'react';
import { Home, Play } from 'lucide-react';
import { AudioPlayer } from '../AudioPlayer';
import { useAudio } from '../../contexts/AudioContext';
import { feelingSafeAtHomeContent } from '../../data/feelingSafeAtHomeContent';
import { elevenLabsService } from '../../services/elevenLabsService';

interface FeelingSafeAtHomeLandingProps {
  onStartGame: () => void;
}

export function FeelingSafeAtHomeLanding({ onStartGame }: FeelingSafeAtHomeLandingProps) {
  const { isNarrationEnabled, selectedLanguage } = useAudio();
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [housesClicked, setHousesClicked] = useState<boolean[]>([false, false, false]);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [houseClickAudio, setHouseClickAudio] = useState<string>('');
  const [playingHouseSound, setPlayingHouseSound] = useState(false);

  useEffect(() => {
    // Generate audio for welcome message
    const generateAudio = async () => {
      try {
        console.log('Generating welcome audio for Feeling Safe at Home:', selectedLanguage);
        const url = await elevenLabsService.generateSpeech({
          language: selectedLanguage,
          text: feelingSafeAtHomeContent.welcome[selectedLanguage],
          voiceId: 'vGQNBgLaiM3EdZtxIiuY' // Child voice - friendly narrator
        });
        console.log('Feeling Safe at Home audio URL generated:', url ? 'Success' : 'Failed');
        setAudioUrl(url);
      } catch (error) {
        console.error('Failed to generate Feeling Safe at Home audio:', error);
      }
    };
    
    generateAudio();
  }, [selectedLanguage]);

  useEffect(() => {
    // Pre-generate house click sound effect
    const generateHouseSound = async () => {
      try {
        console.log('🏠 Pre-generating house click sound...');
        const houseSound = await elevenLabsService.generateStarClickSound(); // Reuse the magical sound
        setHouseClickAudio(houseSound);
        console.log('✅ House click sound ready!');
      } catch (error) {
        console.error('❌ Failed to generate house sound:', error);
      }
    };
    
    generateHouseSound();
  }, []);

  const playHouseClickSound = async () => {
    if (!houseClickAudio || !isNarrationEnabled) return;
    
    try {
      console.log('🔊 Playing house click sound...');
      const audio = new Audio(houseClickAudio);
      audio.volume = 0.7; // Slightly quieter than narration
      
      audio.addEventListener('play', () => setPlayingHouseSound(true));
      audio.addEventListener('ended', () => setPlayingHouseSound(false));
      audio.addEventListener('error', (e) => {
        console.error('❌ House sound playback error:', e);
        setPlayingHouseSound(false);
      });
      
      await audio.play();
    } catch (error) {
      console.error('❌ Failed to play house sound:', error);
      setPlayingHouseSound(false);
    }
  };

  const handleHouseClick = (index: number) => {
    // Play house click sound effect
    playHouseClickSound();
    
    const newHousesClicked = [...housesClicked];
    newHousesClicked[index] = true;
    setHousesClicked(newHousesClicked);

    // Check if all houses are clicked
    if (newHousesClicked.every(clicked => clicked)) {
      setTimeout(() => setShowPlayButton(true), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl text-center">
        {/* Game Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-800 mb-4">
            🏠 Feeling Safe at Home 🏠
          </h1>
          <div className="bg-green-100 border-l-4 border-green-400 p-4 rounded-r-xl">
            <p className="text-lg text-gray-700 leading-relaxed">
              {feelingSafeAtHomeContent.welcome[selectedLanguage]}
            </p>
          </div>
        </div>

        {/* Audio Player */}
        <div className="flex justify-center mb-8">
          <AudioPlayer
            audioUrl={audioUrl}
            isPlaying={isPlaying}
            onPlayStateChange={setIsPlaying}
            autoPlay={true}
          />
        </div>

        {/* Interactive Houses */}
        <div className="mb-8">
          <p className="text-xl font-bold text-gray-700 mb-6">
            Click on the 3 blue houses to enter:
          </p>
          <div className="flex justify-center space-x-8">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => handleHouseClick(index)}
                disabled={housesClicked[index]}
                className={`transform transition-all duration-300 ${
                  housesClicked[index] 
                    ? 'scale-125 animate-pulse' 
                    : 'hover:scale-110 hover:rotate-12'
                } ${playingHouseSound ? 'animate-bounce' : ''}`}
                aria-label={`Click house ${index + 1}`}
              >
                <Home 
                  className={`w-16 h-16 ${
                    housesClicked[index] 
                      ? 'text-green-400 fill-green-400' 
                      : 'text-blue-500 fill-blue-500 hover:text-blue-600'
                  }`}
                />
              </button>
            ))}
          </div>
          
          {/* Audio feedback indicator */}
          {playingHouseSound && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>🏠 House Sound Playing</span>
              </div>
            </div>
          )}
        </div>

        {/* Play Button */}
        {showPlayButton && (
          <div className="animate-bounce-in">
            <button
              onClick={onStartGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-black py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-3 mx-auto text-xl"
            >
              <Play className="w-6 h-6" />
              <span>Start Home Safety Learning!</span>
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center space-x-2">
          {housesClicked.map((clicked, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                clicked ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}