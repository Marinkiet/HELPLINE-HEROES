import React, { useState, useEffect } from 'react';
import { Sun, ArrowRight, Check } from 'lucide-react';
import { AudioPlayer } from '../AudioPlayer';
import { useAudio } from '../../contexts/AudioContext';
import { gameContent } from '../../data/gameContent';
import { elevenLabsService } from '../../services/elevenLabsService';

interface BodyPartsExplorationProps {
  onComplete: () => void;
}

export function BodyPartsExploration({ onComplete }: BodyPartsExplorationProps) {
  const { selectedLanguage, isNarrationEnabled } = useAudio();
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
    
    try {
      const text = gameContent.bodyParts[currentBodyPart][selectedLanguage];
      console.log('Generating body part audio:', text.substring(0, 50) + '...');
      const url = await elevenLabsService.generateSpeech({
        language: selectedLanguage,
        text,
        voiceId: 'vGQNBgLaiM3EdZtxIiuY' // Child voice - friendly narrator
      });
      setAudioUrl(url);
    } catch (error) {
      console.error('Failed to generate body part audio:', error);
    }
  };

  const generateTrustedAdultsAudio = async () => {
    try {
      const text = gameContent.trustedAdults[selectedLanguage];
      console.log('Generating trusted adults audio:', text.substring(0, 50) + '...');
      const url = await elevenLabsService.generateSpeech({
        language: selectedLanguage,
        text,
        voiceId: 'vGQNBgLaiM3EdZtxIiuY' // Child voice - friendly narrator
      });
      setAudioUrl(url);
    } catch (error) {
      console.error('Failed to generate trusted adults audio:', error);
    }
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
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-3xl font-black text-white">
            Body Safety Explorer
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Body Diagrams */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {currentBodyPart === 'upperBody' ? 'Upper Body' : 'Lower Body'}
            </h2>
            
            <div className="flex justify-center">
              <div className="text-center">
                <div className="relative">
                  {currentBodyPart === 'upperBody' ? (
                    <img 
                      src="/src/assets/upper.gif" 
                      alt="Upper body safety diagram"
                      className="w-80 h-auto border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                      onMouseEnter={() => handleBodyPartHover('chest')}
                      onMouseLeave={() => setHoveredArea('')}
                    />
                  ) : (
                    <img 
                      src="/src/assets/lower.gif" 
                      alt="Lower body safety diagram"
                      className="w-80 h-auto border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                      onMouseEnter={() => handleBodyPartHover('private')}
                      onMouseLeave={() => setHoveredArea('')}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Trusted Adult Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSunClick}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 font-bold text-lg"
                aria-label="Learn about trusted adults"
              >
                Trusted Adult?
              </button>
            </div>
          </div>

          {/* Information Panel */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {showTrustedAdults}
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
                    : ""
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
                onClick={() => {
                  setShowTrustedAdults(false);
                  if (currentBodyPart === 'lowerBody') {
                    setCurrentBodyPart('upperBody');
                 } else if (currentBodyPart === 'upperBody') {
                   onComplete(); // Navigate back to home screen
                  }
                }}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                  showTrustedAdults 
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!showTrustedAdults}
              >
               {currentBodyPart === 'upperBody' ? 'Back to Activities' : 'Back to Body Parts'}
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