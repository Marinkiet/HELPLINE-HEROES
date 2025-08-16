import React, { useState, useEffect } from 'react';
import { Sun, ArrowRight, Check } from 'lucide-react';
import { AudioPlayer } from '../AudioPlayer';
import { LanguageSelector } from '../LanguageSelector';
import { gameContent } from '../../data/gameContent';
import { elevenLabsService } from '../../services/elevenLabsService';

interface BodyPartsExplorationProps {
  selectedLanguage: 'en' | 'af' | 'zu';
  onLanguageChange: (language: 'en' | 'af' | 'zu') => void;
  onComplete: () => void;
}

export function BodyPartsExploration({ selectedLanguage, onLanguageChange, onComplete }: BodyPartsExplorationProps) {
  const [currentBodyPart, setCurrentBodyPart] = useState<'upperBody' | 'lowerBody'>('upperBody');
  const [showTrustedAdults, setShowTrustedAdults] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredArea, setHoveredArea] = useState<string>('');

  useEffect(() => {
    if (showTrustedAdults) {
      generateTrustedAdultsAudio();
    } else if (hoveredArea) {
      generateBodyPartAudio();
    }
  }, [selectedLanguage, currentBodyPart, showTrustedAdults, hoveredArea]);

  const generateBodyPartAudio = async () => {
    if (!hoveredArea) return;
    
    const text = gameContent.bodyParts[currentBodyPart][selectedLanguage];
    const url = await elevenLabsService.generateSpeech({
      language: selectedLanguage,
      text
    });
    setAudioUrl(url);
  };

  const generateTrustedAdultsAudio = async () => {
    const text = gameContent.trustedAdults[selectedLanguage];
    const url = await elevenLabsService.generateSpeech({
      language: selectedLanguage,
      text
    });
    setAudioUrl(url);
  };

  const handleBodyPartHover = (area: string) => {
    setHoveredArea(area);
  };

  const handleSunClick = () => {
    setShowTrustedAdults(true);
  };

  const handleNext = () => {
    if (currentBodyPart === 'upperBody') {
      setCurrentBodyPart('lowerBody');
      setShowTrustedAdults(false);
      setHoveredArea('');
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-white">
            Body Safety Explorer
          </h1>
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Body Diagrams */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {currentBodyPart === 'upperBody' ? 'Upper Body' : 'Lower Body'}
            </h2>
            
            <div className="flex justify-center space-x-8">
              {/* Boy Avatar */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-blue-600 mb-4">Boy</h3>
                <div className="relative">
                  <svg width="120" height="200" viewBox="0 0 120 200" className="border-2 border-gray-200 rounded-lg">
                    {/* Head */}
                    <circle cx="60" cy="30" r="20" fill="#fdbcb4" stroke="#333" strokeWidth="2"/>
                    
                    {currentBodyPart === 'upperBody' ? (
                      <>
                        {/* Upper body */}
                        <rect 
                          x="40" y="50" width="40" height="60" 
                          fill="#87CEEB" 
                          stroke="#333" 
                          strokeWidth="2"
                          className="cursor-pointer hover:fill-blue-300 transition-colors"
                          onMouseEnter={() => handleBodyPartHover('chest')}
                          onMouseLeave={() => setHoveredArea('')}
                        />
                        {/* Arms */}
                        <rect x="20" y="60" width="15" height="40" fill="#fdbcb4" stroke="#333" strokeWidth="2"/>
                        <rect x="85" y="60" width="15" height="40" fill="#fdbcb4" stroke="#333" strokeWidth="2"/>
                      </>
                    ) : (
                      <>
                        {/* Lower body */}
                        <rect x="40" y="50" width="40" height="30" fill="#87CEEB" stroke="#333" strokeWidth="2"/>
                        <rect 
                          x="45" y="80" width="30" height="30" 
                          fill="#FF6B6B" 
                          stroke="#333" 
                          strokeWidth="2"
                          className="cursor-pointer hover:fill-red-400 transition-colors"
                          onMouseEnter={() => handleBodyPartHover('private')}
                          onMouseLeave={() => setHoveredArea('')}
                        />
                        {/* Legs */}
                        <rect x="45" y="110" width="12" height="60" fill="#4169E1" stroke="#333" strokeWidth="2"/>
                        <rect x="63" y="110" width="12" height="60" fill="#4169E1" stroke="#333" strokeWidth="2"/>
                      </>
                    )}
                  </svg>
                </div>
              </div>

              {/* Girl Avatar */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-pink-600 mb-4">Girl</h3>
                <div className="relative">
                  <svg width="120" height="200" viewBox="0 0 120 200" className="border-2 border-gray-200 rounded-lg">
                    {/* Head */}
                    <circle cx="60" cy="30" r="20" fill="#fdbcb4" stroke="#333" strokeWidth="2"/>
                    
                    {currentBodyPart === 'upperBody' ? (
                      <>
                        {/* Upper body */}
                        <rect 
                          x="40" y="50" width="40" height="60" 
                          fill="#FFB6C1" 
                          stroke="#333" 
                          strokeWidth="2"
                          className="cursor-pointer hover:fill-pink-300 transition-colors"
                          onMouseEnter={() => handleBodyPartHover('chest')}
                          onMouseLeave={() => setHoveredArea('')}
                        />
                        {/* Arms */}
                        <rect x="20" y="60" width="15" height="40" fill="#fdbcb4" stroke="#333" strokeWidth="2"/>
                        <rect x="85" y="60" width="15" height="40" fill="#fdbcb4" stroke="#333" strokeWidth="2"/>
                      </>
                    ) : (
                      <>
                        {/* Lower body */}
                        <rect x="40" y="50" width="40" height="30" fill="#FFB6C1" stroke="#333" strokeWidth="2"/>
                        <rect 
                          x="45" y="80" width="30" height="30" 
                          fill="#FF6B6B" 
                          stroke="#333" 
                          strokeWidth="2"
                          className="cursor-pointer hover:fill-red-400 transition-colors"
                          onMouseEnter={() => handleBodyPartHover('private')}
                          onMouseLeave={() => setHoveredArea('')}
                        />
                        {/* Legs */}
                        <rect x="45" y="110" width="12" height="60" fill="#9370DB" stroke="#333" strokeWidth="2"/>
                        <rect x="63" y="110" width="12" height="60" fill="#9370DB" stroke="#333" strokeWidth="2"/>
                      </>
                    )}
                  </svg>
                </div>
              </div>
            </div>

            {/* Sun Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSunClick}
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-800 p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
                aria-label="Learn about trusted adults"
              >
                <Sun className="w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Information Panel */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {showTrustedAdults ? 'Trusted Adults' : 'Body Safety Information'}
              </h2>
              <AudioPlayer
                audioUrl={audioUrl}
                isPlaying={isPlaying}
                onPlayStateChange={setIsPlaying}
                autoPlay={true}
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {showTrustedAdults 
                  ? gameContent.trustedAdults[selectedLanguage]
                  : hoveredArea 
                    ? gameContent.bodyParts[currentBodyPart][selectedLanguage]
                    : `Hover over the colored areas to learn about body safety.`
                }
              </p>
            </div>

            {showTrustedAdults && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-100 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">👨‍⚕️</div>
                  <p className="font-semibold text-green-800">Doctors</p>
                </div>
                <div className="bg-green-100 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
                  <p className="font-semibold text-green-800">Parents</p>
                </div>
                <div className="bg-green-100 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">👩‍🏫</div>
                  <p className="font-semibold text-green-800">Teachers</p>
                </div>
                <div className="bg-green-100 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">👮‍♀️</div>
                  <p className="font-semibold text-green-800">Police</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setShowTrustedAdults(false)}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                  showTrustedAdults 
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!showTrustedAdults}
              >
                Back to Body Parts
              </button>
              
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                {currentBodyPart === 'upperBody' ? (
                  <>
                    <span>Next Body Part</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>Start Game</span>
                    <Check className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}