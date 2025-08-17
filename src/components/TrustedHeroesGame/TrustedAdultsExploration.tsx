import React, { useState, useEffect } from 'react';
import { Users, Shield, ArrowRight, AlertTriangle } from 'lucide-react';
import { AudioPlayer } from '../AudioPlayer';
import { useAudio } from '../../contexts/AudioContext';
import { trustedHeroesContent } from '../../data/trustedHeroesContent';
import { elevenLabsService } from '../../services/elevenLabsService';

interface TrustedAdultsExplorationProps {
  onComplete: () => void;
}

export function TrustedAdultsExploration({ onComplete }: TrustedAdultsExplorationProps) {
  const { selectedLanguage, isNarrationEnabled } = useAudio();
  const [currentSection, setCurrentSection] = useState<'definition' | 'types' | 'redFlags'>('definition');
  const [selectedAdultType, setSelectedAdultType] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  const adultTypes = [
    { key: 'parents', icon: '👨‍👩‍👧‍👦', title: 'Parents & Family', bgColor: '#e3f2fd', shadowDark: '#bbdefb',  },
    { key: 'teachers', icon: '👩‍🏫', title: 'Teachers & School', bgColor: '#e8f5e8', shadowDark: '#c8e6c9', shadowLight: '#ffffff' },
    { key: 'doctors', icon: '👨‍⚕️', title: 'Doctors & Healthcare', bgColor: '#f3e5f5', shadowDark: '#e1bee7', shadowLight: '#ffffff' },
    { key: 'police', icon: '👮‍♀️', title: 'Police & Community', bgColor: '#fff8e1', shadowDark: '#ffecb3', shadowLight: '#ffffff' },
    { key: 'counselors', icon: '🧑‍💼', title: 'Counselors & Therapists', bgColor: '#fce4ec', shadowDark: '#f8bbd9', shadowLight: '#ffffff' }
  ];

  useEffect(() => {
    generateAudio();
  }, [selectedLanguage, currentSection, selectedAdultType]);

  const generateAudio = async () => {
    try {
      let text = '';
      
      if (currentSection === 'definition') {
        text = trustedHeroesContent.whatIsTrustedAdult[selectedLanguage];
      } else if (currentSection === 'types' && selectedAdultType) {
        text = trustedHeroesContent.trustedAdultTypes[selectedAdultType as keyof typeof trustedHeroesContent.trustedAdultTypes][selectedLanguage];
      } else if (currentSection === 'redFlags') {
        text = trustedHeroesContent.redFlags[selectedLanguage];
      }
      
      if (text) {
        console.log('Generating exploration audio:', text.substring(0, 50) + '...');
        const url = await elevenLabsService.generateSpeech({
          language: selectedLanguage,
          text,
          voiceId: 'vGQNBgLaiM3EdZtxIiuY' // Child voice - friendly narrator
        });
        setAudioUrl(url);
      }
    } catch (error) {
      console.error('Failed to generate exploration audio:', error);
    }
  };

  const handleAdultTypeClick = (adultType: string) => {
    setSelectedAdultType(adultType);
  };

  const handleNext = () => {
    if (currentSection === 'definition') {
      setCurrentSection('types');
      setSelectedAdultType('');
    } else if (currentSection === 'types') {
      setCurrentSection('redFlags');
      setSelectedAdultType('');
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentSection === 'redFlags') {
      setCurrentSection('types');
    } else if (currentSection === 'types') {
      setCurrentSection('definition');
    }
    setSelectedAdultType('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-3xl font-black text-white">
            Learning About Trusted Adults
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            <div className={`px-4 py-2 rounded-full font-bold ${currentSection === 'definition' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'}`}>
              1. What is a Trusted Adult?
            </div>
            <div className={`px-4 py-2 rounded-full font-bold ${currentSection === 'types' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'}`}>
              2. Types of Trusted Adults
            </div>
            <div className={`px-4 py-2 rounded-full font-bold ${currentSection === 'redFlags' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'}`}>
              3. Warning Signs
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            {currentSection === 'definition' && (
              <>
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">What is a Trusted Adult?</h2>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl mb-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {trustedHeroesContent.whatIsTrustedAdult[selectedLanguage]}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-100 p-4 rounded-xl text-center">
                    <div className="text-3xl mb-2">✅</div>
                    <p className="font-semibold text-green-800">Keeps you safe</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-xl text-center">
                    <div className="text-3xl mb-2">💝</div>
                    <p className="font-semibold text-green-800">Cares about you</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-xl text-center">
                    <div className="text-3xl mb-2">🗣️</div>
                    <p className="font-semibold text-green-800">Tells the truth</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-xl text-center">
                    <div className="text-3xl mb-2">🤗</div>
                    <p className="font-semibold text-green-800">Respects you</p>
                  </div>
                </div>
              </>
            )}

            {currentSection === 'types' && (
              <>
                <div className="flex items-center mb-6">
                  <Users className="w-8 h-8 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Types of Trusted Adults</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {adultTypes.map((type) => (
                    <button
                      key={type.key}
                      onClick={() => handleAdultTypeClick(type.key)}
                      className={`p-4 rounded-xl text-left transition-all duration-200 transform cursor-pointer outline-none font-bold text-gray-700 ${
                        selectedAdultType === type.key ? 'ring-3 ring-purple-400' : ''
                      }`}
                      style={{
                        backgroundColor: type.bgColor,
                        boxShadow: selectedAdultType === type.key 
                          ? `inset 5px 5px 10px ${type.shadowDark}, inset -5px -5px 10px ${type.shadowLight}`
                          : `7px 7px 15px ${type.shadowDark}, -7px -7px 15px ${type.shadowLight}`
                      }}
                      onMouseEnter={(e) => {
                        if (selectedAdultType !== type.key) {
                          e.currentTarget.style.boxShadow = `inset 5px 5px 10px ${type.shadowDark}, inset -5px -5px 10px ${type.shadowLight}`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedAdultType !== type.key) {
                          e.currentTarget.style.boxShadow = `7px 7px 15px ${type.shadowDark}, -7px -7px 15px ${type.shadowLight}`;
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{type.icon}</div>
                        <div>
                          <h3 className="font-bold text-gray-700">{type.title}</h3>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedAdultType && (
                  <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-xl">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {trustedHeroesContent.trustedAdultTypes[selectedAdultType as keyof typeof trustedHeroesContent.trustedAdultTypes][selectedLanguage]}
                    </p>
                  </div>
                )}
              </>
            )}

            {currentSection === 'redFlags' && (
              <>
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Warning Signs</h2>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-xl mb-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {trustedHeroesContent.redFlags[selectedLanguage]}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-red-100 p-3 rounded-lg flex items-center">
                    <div className="text-2xl mr-3">🤫</div>
                    <p className="text-red-800 font-semibold">Asks you to keep secrets</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg flex items-center">
                    <div className="text-2xl mr-3">🎁</div>
                    <p className="text-red-800 font-semibold">Gives gifts for favors</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg flex items-center">
                    <div className="text-2xl mr-3">😰</div>
                    <p className="text-red-800 font-semibold">Makes you feel scared</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg flex items-center">
                    <div className="text-2xl mr-3">⚠️</div>
                    <p className="text-red-800 font-semibold">Threatens you</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Audio and Navigation Panel */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Listen & Learn</h2>
              <AudioPlayer
                audioUrl={audioUrl}
                isPlaying={isPlaying}
                onPlayStateChange={setIsPlaying}
                autoPlay={true}
              />
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl mb-8">
              <p className="text-lg text-yellow-800 leading-relaxed">
                {currentSection === 'definition' && "Now what makes an adult trustworthy and safe to talk to?"}
                {currentSection === 'types' && selectedAdultType && "Click on different types of trusted adults to learn about them!"}
                {currentSection === 'types' && !selectedAdultType && "Click on the cards above to learn about different types of trusted adults."}
                {currentSection === 'redFlags' && "Remember these warning signs to stay safe!"}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                  currentSection === 'definition'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                disabled={currentSection === 'definition'}
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>
                  {currentSection === 'redFlags' ? 'Start Quiz' : 'Next'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}