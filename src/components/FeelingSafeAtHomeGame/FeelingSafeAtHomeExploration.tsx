import React, { useState, useEffect } from 'react';
import { Home, Shield, ArrowRight, AlertTriangle } from 'lucide-react';
import { AudioPlayer } from '../AudioPlayer';
import { useAudio } from '../../contexts/AudioContext';
import { feelingSafeAtHomeContent } from '../../data/feelingSafeAtHomeContent';
import { elevenLabsService } from '../../services/elevenLabsService';
import family from '../../assets/family.jpg';

interface FeelingSafeAtHomeExplorationProps {
  onComplete: () => void;
}

export function FeelingSafeAtHomeExploration({ onComplete }: FeelingSafeAtHomeExplorationProps) {
  const { selectedLanguage, isNarrationEnabled } = useAudio();
  const [currentSection, setCurrentSection] = useState<'what' | 'features' | 'warning'>('what');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  const sections = [
    { key: 'what', title: 'What is a Safe Home?', icon: Home, color: 'green' },
    { key: 'features', title: 'Safe Home Features', icon: Shield, color: 'blue' },
    { key: 'warning', title: 'Warning Signs', icon: AlertTriangle, color: 'red' }
  ];

  useEffect(() => {
    generateAudio();
  }, [selectedLanguage, currentSection]);

  const generateAudio = async () => {
    try {
      let text = '';
      
      switch (currentSection) {
        case 'what':
          text = feelingSafeAtHomeContent.whatIsSafeHome[selectedLanguage];
          break;
        case 'features':
          text = feelingSafeAtHomeContent.safeHomeFeatures[selectedLanguage];
          break;
        case 'warning':
          text = feelingSafeAtHomeContent.unsafeHomeSigns[selectedLanguage];
          break;
      }
      
      if (text) {
        console.log('Generating home safety exploration audio:', text.substring(0, 50) + '...');
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

  const handleNext = () => {
    const currentIndex = sections.findIndex(s => s.key === currentSection);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1].key as any);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    const currentIndex = sections.findIndex(s => s.key === currentSection);
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1].key as any);
    }
  };

  const currentSectionData = sections.find(s => s.key === currentSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-3xl font-black text-white">
            Learning About Safe Homes
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max px-4">
            {sections.map((section, index) => (
              <div 
                key={section.key}
                className={`px-3 py-2 rounded-full font-bold text-sm ${
                  currentSection === section.key 
                    ? 'bg-white text-purple-600' 
                    : 'bg-white/20 text-white'
                }`}
              >
                {index + 1}. {section.title}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center mb-6">
              {currentSectionData && (
                <>
                  <currentSectionData.icon className={`w-8 h-8 text-${currentSectionData.color}-600 mr-3`} />
                  <h2 className="text-2xl font-bold text-gray-800">{currentSectionData.title}</h2>
                </>
              )}
            </div>
            
            <div className={`bg-${currentSectionData?.color}-50 border-l-4 border-${currentSectionData?.color}-400 p-6 rounded-r-xl mb-6`}>
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentSection === 'what' && feelingSafeAtHomeContent.whatIsSafeHome[selectedLanguage]}
                {currentSection === 'features' && feelingSafeAtHomeContent.safeHomeFeatures[selectedLanguage]}
                {currentSection === 'warning' && feelingSafeAtHomeContent.unsafeHomeSigns[selectedLanguage]}
              </p>
            </div>

            {/* Visual Examples */}
            {currentSection === 'what' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-100 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">💝</div>
                  <p className="font-semibold text-green-800">Loved</p>
                </div>
                <div className="bg-green-100 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">🛡️</div>
                  <p className="font-semibold text-green-800">Protected</p>
                </div>
                <div className="bg-green-100 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">🤗</div>
                  <p className="font-semibold text-green-800">Comfortable</p>
                </div>
                <div className="bg-green-100 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">👂</div>
                  <p className="font-semibold text-green-800">Heard</p>
                </div>
              </div>
            )}

            {currentSection === 'features' && (
              <div className="space-y-3">
                <div className="bg-blue-100 p-3 rounded-lg flex items-center">
                  <div className="text-2xl mr-3">👂</div>
                  <p className="text-blue-800 font-semibold">Adults listen to you</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg flex items-center">
                  <div className="text-2xl mr-3">📋</div>
                  <p className="text-blue-800 font-semibold">Clear, fair rules</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg flex items-center">
                  <div className="text-2xl mr-3">🚪</div>
                  <p className="text-blue-800 font-semibold">Privacy respected</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg flex items-center">
                  <div className="text-2xl mr-3">🤝</div>
                  <p className="text-blue-800 font-semibold">Help when needed</p>
                </div>
              </div>
            )}

            {currentSection === 'warning' && (
              <div className="space-y-3">
                <div className="bg-red-100 p-3 rounded-lg flex items-center">
                  <div className="text-2xl mr-3">😡</div>
                  <p className="text-red-800 font-semibold">Frequent yelling or anger</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg flex items-center">
                  <div className="text-2xl mr-3">🥺</div>
                  <p className="text-red-800 font-semibold">Being called mean names</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg flex items-center">
                  <div className="text-2xl mr-3">🍺</div>
                  <p className="text-red-800 font-semibold">Adults using drugs/alcohol</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg flex items-center">
                  <div className="text-2xl mr-3">😰</div>
                  <p className="text-red-800 font-semibold">Feeling scared at home</p>
                </div>
              </div>
            )}

            {currentSection === 'warning' && (
              <div className="mt-6 bg-yellow-100 border border-yellow-300 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <div className="text-2xl mr-2">💡</div>
                  <h4 className="font-bold text-yellow-800">Remember:</h4>
                </div>
                <p className="text-yellow-700 text-sm">
                  {feelingSafeAtHomeContent.whatToDoIfUnsafe[selectedLanguage]}
                </p>
              </div>
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

            {/* Image Display Area */}
            <div className="mb-8">
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                <img 
                  src={family}
                  alt="Safe family environment"
                  className="w-full max-w-md h-64 object-cover rounded-xl mx-auto shadow-lg"
                />
                <p className="text-sm text-gray-600 mt-3 font-semibold">
                  {currentSectionData?.title}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl mb-8">
              <p className="text-lg text-yellow-800 leading-relaxed">
                {currentSection === 'what' && "Every child deserves to feel safe and loved at home!"}
                {currentSection === 'features' && "These are the things that make a home feel safe and welcoming."}
                {currentSection === 'warning' && "If you notice these signs, remember it's not your fault and you can get help!"}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                  currentSection === 'what'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                disabled={currentSection === 'what'}
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>
                  {currentSection === 'warning' ? 'Start Practice' : 'Next'}
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