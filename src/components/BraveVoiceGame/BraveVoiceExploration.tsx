import React, { useState, useEffect } from 'react';
import { Volume2, Users, ArrowRight, Phone } from 'lucide-react';
import { AudioPlayer } from '../AudioPlayer';
import { useAudio } from '../../contexts/AudioContext';
import { braveVoiceContent } from '../../data/braveVoiceContent';
import { elevenLabsService } from '../../services/elevenLabsService';

interface BraveVoiceExplorationProps {
  onComplete: () => void;
}

export function BraveVoiceExploration({ onComplete }: BraveVoiceExplorationProps) {
  const { selectedLanguage, isNarrationEnabled } = useAudio();
  const [currentSection, setCurrentSection] = useState<'what' | 'when' | 'how' | 'multiple' | 'emergency'>('what');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  const sections = [
    { key: 'what', title: 'What is Brave Voice?', icon: Volume2, color: 'blue' },
    { key: 'when', title: 'When to Use It', icon: Users, color: 'green' },
    { key: 'how', title: 'How to Use It', icon: ArrowRight, color: 'purple' },
    { key: 'multiple', title: 'Tell Multiple Adults', icon: Users, color: 'orange' },
    { key: 'emergency', title: 'Emergency Help', icon: Phone, color: 'red' }
  ];

  useEffect(() => {
    generateAudio();
  }, [selectedLanguage, currentSection]);

  const generateAudio = async () => {
    try {
      let text = '';
      
      switch (currentSection) {
        case 'what':
          text = braveVoiceContent.whatIsBraveVoice[selectedLanguage];
          break;
        case 'when':
          text = braveVoiceContent.whenToUseBraveVoice[selectedLanguage];
          break;
        case 'how':
          text = braveVoiceContent.howToUseBraveVoice[selectedLanguage];
          break;
        case 'multiple':
          text = braveVoiceContent.reportToMultipleAdults[selectedLanguage];
          break;
        case 'emergency':
          text = braveVoiceContent.emergencyHelp[selectedLanguage];
          break;
      }
      
      if (text) {
        console.log('Generating brave voice exploration audio:', text.substring(0, 50) + '...');
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-3xl font-black text-white">
            Learning About Your Brave Voice
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
                {currentSection === 'what' && braveVoiceContent.whatIsBraveVoice[selectedLanguage]}
                {currentSection === 'when' && braveVoiceContent.whenToUseBraveVoice[selectedLanguage]}
                {currentSection === 'how' && braveVoiceContent.howToUseBraveVoice[selectedLanguage]}
                {currentSection === 'multiple' && braveVoiceContent.reportToMultipleAdults[selectedLanguage]}
                {currentSection === 'emergency' && braveVoiceContent.emergencyHelp[selectedLanguage]}
              </p>
            </div>

            {/* Visual Examples */}
            {currentSection === 'what' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-100 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">💪</div>
                  <p className="font-semibold text-green-800">Strong</p>
                </div>
                <div className="bg-green-100 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">🗣️</div>
                  <p className="font-semibold text-green-800">Clear</p>
                </div>
                <div className="bg-green-100 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">🛡️</div>
                  <p className="font-semibold text-green-800">Protective</p>
                </div>
                <div className="bg-green-100 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">❤️</div>
                  <p className="font-semibold text-green-800">Caring</p>
                </div>
              </div>
            )}

            {currentSection === 'emergency' && (
              <div className="bg-red-100 border border-red-300 rounded-xl p-6 text-center">
                <Phone className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-800 mb-2">Remember the Red Button!</h3>
                <p className="text-red-700 mb-4">
                  Look for the big red "Need Help?" button on the main screen. Click it to call 116 - Childline!
                </p>
                <div className="bg-red-200 rounded-lg p-3">
                  <p className="text-red-800 font-bold">116 - Free • 24/7 • Confidential</p>
                </div>
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
                  src="/src/assets/doctor.jpg"
                  alt="Educational content illustration"
                  className="w-full max-w-md h-64 object-cover rounded-xl mx-auto shadow-lg"
                  onError={(e) => {
                    // Fallback to a placeholder if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
                <p className="text-sm text-gray-600 mt-3 font-semibold">
                  {currentSectionData?.title}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl mb-8">
              <p className="text-lg text-yellow-800 leading-relaxed">
                {currentSection === 'what' && "Your voice is like a superhero power - it can protect you and others!"}
                {currentSection === 'when' && "Trust your feelings. If something doesn't feel right, use your brave voice!"}
                {currentSection === 'how' && "Practice these steps so you'll be ready when you need your brave voice."}
                {currentSection === 'multiple' && "Don't give up! Keep telling adults until someone helps you."}
                {currentSection === 'emergency' && "In emergencies, the red button is always there to help you!"}
              </p>
            </div>

            {/* Practice Examples */}
            {currentSection === 'how' && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Practice Phrases:</h3>
                <div className="space-y-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <p className="font-semibold text-blue-800">"No, I don't like that!"</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <p className="font-semibold text-blue-800">"Stop, that makes me uncomfortable!"</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <p className="font-semibold text-blue-800">"I need to tell a trusted adult!"</p>
                  </div>
                </div>
              </div>
            )}

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
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>
                  {currentSection === 'emergency' ? 'Start Practice' : 'Next'}
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