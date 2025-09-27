import React, { useState, useEffect } from 'react';
import { Volume2, Users, ArrowRight, Phone } from 'lucide-react';
import { AudioPlayer } from '../AudioPlayer';
import { useAudio } from '../../contexts/AudioContext';
import { Section } from '../../data/games';
import { elevenLabsService } from '../../services/elevenLabsService';

interface BraveVoiceExplorationProps {
  onComplete: () => void;
  section: Section;
}

export function BraveVoiceExploration({ onComplete, section }: BraveVoiceExplorationProps) {
  const { selectedLanguage, isNarrationEnabled } = useAudio();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);


  const questions = section.questions;
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    generateAudio();
  }, [selectedLanguage, currentQuestion]);

  const generateAudio = async () => {
    try {
      const text = currentQuestion.text[selectedLanguage];
      
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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

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
            {questions.map((question, index) => (
              <div 
                key={question.id}
                className={`px-3 py-2 rounded-full font-bold text-sm ${
                  currentQuestionIndex === index 
                    ? 'bg-white text-purple-600' 
                    : 'bg-white/20 text-white'
                }`}
              >
                {index + 1}. {question.text[selectedLanguage]}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{currentQuestion.text[selectedLanguage]}</h2>
            </div>
            
            <div className={`bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl mb-6`}>
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentQuestion.text[selectedLanguage]}
              </p>
            </div>
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
                  {currentQuestion.text[selectedLanguage]}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>
                  {currentQuestionIndex === questions.length - 1 ? 'Start Practice' : 'Next'}
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