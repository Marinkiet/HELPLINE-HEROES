import React, { useState, useEffect } from 'react';
import { Heart, Play } from 'lucide-react';
import { AudioPlayer } from '../AudioPlayer';
import { useAudio } from '../../contexts/AudioContext';
import { trustedHeroesContent } from '../../data/trustedHeroesContent';
import { elevenLabsService } from '../../services/elevenLabsService';

interface TrustedHeroesLandingProps {
  onStartGame: () => void;
}

export function TrustedHeroesLanding({ onStartGame }: TrustedHeroesLandingProps) {
  const { isNarrationEnabled, selectedLanguage } = useAudio();
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [heartsClicked, setHeartsClicked] = useState<boolean[]>([false, false, false]);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [heartClickAudio, setHeartClickAudio] = useState<string>('');
  const [playingHeartSound, setPlayingHeartSound] = useState(false);

  useEffect(() => {
    // Generate audio for welcome message
    const generateAudio = async () => {
      try {
        console.log('Generating welcome audio for Trusted Heroes:', selectedLanguage);
        const url = await elevenLabsService.generateSpeech({
          language: selectedLanguage,
          text: trustedHeroesContent.welcome[selectedLanguage],
          voiceId: 'vGQNBgLaiM3EdZtxIiuY' // Child voice - friendly narrator
        });
        console.log('Trusted Heroes audio URL generated:', url ? 'Success' : 'Failed');
        setAudioUrl(url);
      } catch (error) {
        console.error('Failed to generate Trusted Heroes audio:', error);
      }
    };
    
    generateAudio();
  }, [selectedLanguage]);

  useEffect(() => {
    // Pre-generate heart click sound effect
    const generateHeartSound = async () => {
      try {
        console.log('💖 Pre-generating heart click sound...');
        const heartSound = await elevenLabsService.generateStarClickSound(); // Reuse the magical sound
        setHeartClickAudio(heartSound);
        console.log('✅ Heart click sound ready!');
      } catch (error) {
        console.error('❌ Failed to generate heart sound:', error);
      }
    };
    
    generateHeartSound();
  }, []);

  const playHeartClickSound = async () => {
    if (!heartClickAudio || !isNarrationEnabled) return;
    
    try {
      console.log('🔊 Playing heart click sound...');
      const audio = new Audio(heartClickAudio);
      audio.volume = 0.7; // Slightly quieter than narration
      
      audio.addEventListener('play', () => setPlayingHeartSound(true));
      audio.addEventListener('ended', () => setPlayingHeartSound(false));
      audio.addEventListener('error', (e) => {
        console.error('❌ Heart sound playback error:', e);
        setPlayingHeartSound(false);
      });
      
      await audio.play();
    } catch (error) {
      console.error('❌ Failed to play heart sound:', error);
      setPlayingHeartSound(false);
    }
  };

  const handleHeartClick = (index: number) => {
    // Play heart click sound effect
    playHeartClickSound();
    
    const newHeartsClicked = [...heartsClicked];
    newHeartsClicked[index] = true;
    setHeartsClicked(newHeartsClicked);

    // Check if all hearts are clicked
    if (newHeartsClicked.every(clicked => clicked)) {
      setTimeout(() => setShowPlayButton(true), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl text-center">
        {/* Game Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-800 mb-4">
            💖 Trusted Heroes Circle 💖
          </h1>
          <div className="bg-pink-100 border-l-4 border-pink-400 p-4 rounded-r-xl">
            <p className="text-lg text-gray-700 leading-relaxed">
              {trustedHeroesContent.welcome[selectedLanguage]}
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

        {/* Interactive Hearts */}
        <div className="mb-8">
          <p className="text-xl font-bold text-gray-700 mb-6">
            Click on the 3 golden hearts to enter:
          </p>
          <div className="flex justify-center space-x-8">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => handleHeartClick(index)}
                disabled={heartsClicked[index]}
                className={`transform transition-all duration-300 ${
                  heartsClicked[index] 
                    ? 'scale-125 animate-pulse' 
                    : 'hover:scale-110 hover:rotate-12'
                } ${playingHeartSound ? 'animate-bounce' : ''}`}
                aria-label={`Click heart ${index + 1}`}
              >
                <Heart 
                  className={`w-16 h-16 ${
                    heartsClicked[index] 
                      ? 'text-pink-400 fill-pink-400' 
                      : 'text-yellow-500 fill-yellow-500 hover:text-yellow-600'
                  }`}
                />
              </button>
            ))}
          </div>
          
          {/* Audio feedback indicator */}
          {playingHeartSound && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                <span>💖 Heart Sound Playing</span>
              </div>
            </div>
          )}
        </div>

        {/* Play Button */}
        {showPlayButton && (
          <div className="animate-bounce-in">
            <button
              onClick={onStartGame}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-black py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-3 mx-auto text-xl"
            >
              <Play className="w-6 h-6" />
              <span>Meet Your Trusted Heroes!</span>
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center space-x-2">
          {heartsClicked.map((clicked, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                clicked ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}