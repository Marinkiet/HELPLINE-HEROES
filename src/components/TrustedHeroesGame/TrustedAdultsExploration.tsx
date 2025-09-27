import React, { useState, useEffect } from 'react';
import { Users, Shield, ArrowRight, AlertTriangle } from 'lucide-react';
import { AudioPlayer } from '../AudioPlayer';
import { useAudio } from '../../contexts/AudioContext';
import { elevenLabsService } from '../../services/elevenLabsService';
import { Section } from '../../data/games';
import therapist from '../../assets/therapist.jpg';
import doctor from '../../assets/doctor.jpg';
import teacher from '../../assets/teacher.jpg';
import home from '../../assets/home.jpg';
import police from '../../assets/police.jpg';

interface TrustedAdultsExplorationProps {
  onComplete: () => void;
  section: Section;
}

export function TrustedAdultsExploration({ onComplete, section }: TrustedAdultsExplorationProps) {
  const { selectedLanguage, isNarrationEnabled } = useAudio();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAdultType, setSelectedAdultType] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  const questions = section.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const getAdultTypeImage = (adultType: string) => {
    switch (adultType) {
      case 'parents':
        return home;
      case 'teachers':
        return teacher;
      case 'doctors':
        return doctor;
      case 'police':
        return police;
      case 'counselors':
        return therapist;
      default:
        return 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  useEffect(() => {
    generateAudio();
  }, [selectedLanguage, currentQuestion, selectedAdultType]);

  const generateAudio = async () => {
    try {
      let text = '';
      if (currentQuestion.type === 'definition' || currentQuestion.type === 'redFlags') {
        text = currentQuestion.text[selectedLanguage];
      } else if (currentQuestion.type === 'types' && selectedAdultType) {
        const selectedOption = currentQuestion.options.find(option => option.key === selectedAdultType);
        if (selectedOption) {
          text = selectedOption.description[selectedLanguage];
        }
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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAdultType('');
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
    setSelectedAdultType('');
  };

  const renderContent = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'definition':
        return (
          <>
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">{currentQuestion.text[selectedLanguage]}</h2>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentQuestion.description[selectedLanguage]}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="bg-green-100 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <p className="font-semibold text-green-800">{option.text[selectedLanguage]}</p>
                </div>
              ))}
            </div>
          </>
        );
      case 'types':
        return (
          <>
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">{currentQuestion.text[selectedLanguage]}</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-6">
              {currentQuestion.options.map((type) => (
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
                      <h3 className="font-bold text-gray-700">{type.title[selectedLanguage]}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {selectedAdultType && (
              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-xl">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {currentQuestion.options.find(o => o.key === selectedAdultType)?.description[selectedLanguage]}
                </p>
              </div>
            )}
          </>
        );
      case 'redFlags':
        return (
          <>
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">{currentQuestion.text[selectedLanguage]}</h2>
            </div>
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-xl mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentQuestion.description[selectedLanguage]}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="bg-red-100 p-3 rounded-lg flex items-center">
                  <div className="text-2xl mr-3">{option.icon}</div>
                  <p className="text-red-800 font-semibold">{option.text[selectedLanguage]}</p>
                </div>
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-3xl font-black text-white">
            Learning About Trusted Adults
          </h1>
        </div>
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {questions.map((q, index) => (
              <div key={q.id} className={`px-4 py-2 rounded-full font-bold ${currentQuestionIndex === index ? 'bg-white text-purple-600' : 'bg-white/20 text-white'}`}>
                {index + 1}. {q.text[selectedLanguage]}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            {renderContent()}
          </div>
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
                {currentQuestion?.guidance[selectedLanguage]}
              </p>
            </div>
            {currentQuestion?.type === 'types' && selectedAdultType && (
              <div className="mb-8">
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <img
                    src={getAdultTypeImage(selectedAdultType)}
                    alt={`${selectedAdultType} trusted adults`}
                    className="w-full max-w-md h-64 object-cover rounded-xl mx-auto shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <p className="text-sm text-gray-600 mt-3 font-semibold">
                    {currentQuestion.options.find(type => type.key === selectedAdultType)?.title[selectedLanguage]}
                  </p>
                </div>
              </div>
            )}
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
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>
                  {currentQuestionIndex === questions.length - 1 ? 'Start Quiz' : 'Next'}
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