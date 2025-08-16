import React, { useState, useEffect } from 'react';
import { Star, Play } from 'lucide-react';
import { AudioPlayer } from '../AudioPlayer';
import { LanguageSelector } from '../LanguageSelector';
import { gameContent } from '../../data/gameContent';
import { elevenLabsService } from '../../services/elevenLabsService';

interface GameLandingProps {
  onStartGame: () => void;
}

export function GameLanding({ onStartGame }: GameLandingProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'af' | 'zu'>('en');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [starsClicked, setStarsClicked] = useState<boolean[]>([false, false, false]);
  const [showPlayButton, setShowPlayButton] = useState(false);

  useEffect(() => {
    // Generate audio for welcome message
    const generateAudio = async () => {
      const url = await elevenLabsService.generateSpeech({
        language: selectedLanguage,
        text: gameContent.welcome[selectedLanguage]
      });
      setAudioUrl(url);
    };
    
    generateAudio();
  }, [selectedLanguage]);

  const handleStarClick = (index: number) => {
    const newStarsClicked = [...starsClicked];
    newStarsClicked[index] = true;
    setStarsClicked(newStarsClicked);

    // Check if all stars are clicked
    if (newStarsClicked.every(clicked => clicked)) {
      setTimeout(() => setShowPlayButton(true), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl text-center">
        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>

        {/* Game Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-800 mb-4">
            🕵️ Safe Touch Detective 🕵️
          </h1>
          <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-r-xl">
            <p className="text-lg text-gray-700 leading-relaxed">
              {gameContent.welcome[selectedLanguage]}
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

        {/* Interactive Stars */}
        <div className="mb-8">
          <p className="text-xl font-bold text-gray-700 mb-6">
            Click on the 3 green stars to enter:
          </p>
          <div className="flex justify-center space-x-8">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => handleStarClick(index)}
                disabled={starsClicked[index]}
                className={`transform transition-all duration-300 ${
                  starsClicked[index] 
                    ? 'scale-125 animate-pulse' 
                    : 'hover:scale-110 hover:rotate-12'
                }`}
                aria-label={`Click star ${index + 1}`}
              >
                <Star 
                  className={`w-16 h-16 ${
                    starsClicked[index] 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-green-500 fill-green-500 hover:text-green-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Play Button */}
        {showPlayButton && (
          <div className="animate-bounce-in">
            <button
              onClick={onStartGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-black py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-3 mx-auto text-xl"
            >
              <Play className="w-6 h-6" />
              <span>Start Your Detective Adventure!</span>
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center space-x-2">
          {starsClicked.map((clicked, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                clicked ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}