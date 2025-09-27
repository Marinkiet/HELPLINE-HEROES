import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, RotateCcw, Trophy, Shield, ArrowLeft } from 'lucide-react';
import { AudioPlayer } from '../AudioPlayer';
import { useAudio } from '../../contexts/AudioContext';
import { useEngagement } from '../../contexts/EngagementContext';
import { trustedHeroesContent } from '../../data/trustedHeroesContent';
import { elevenLabsService } from '../../services/elevenLabsService';
import cleaning from '../../assets/classroomCleaning.gif'
import doctorExam from '../../assets/doctorExam.gif'
import student from '../../assets/student.gif'
import neighbour from '../../assets/neighbour.gif'
import stranger from '../../assets/stranger.gif'

interface TrustedAdultsScenarioProps {
  onComplete: () => void;
}

export function TrustedAdultsScenario({ onComplete }: TrustedAdultsScenarioProps) {
  const { selectedLanguage, isNarrationEnabled } = useAudio();
  const { trackGameEnd, trackInteraction } = useEngagement();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [questionRetries, setQuestionRetries] = useState<Record<number, number>>({});
  const [firstAttempts, setFirstAttempts] = useState<Record<number, boolean>>({});

  const scenarios = trustedHeroesContent.scenarios;
  const currentScenarioData = scenarios[currentScenario];

  useEffect(() => {
    if (showFeedback) {
      generateFeedbackAudio();
    } else if (currentScenarioData) {
      generateScenarioAudio();
    }
  }, [selectedLanguage, currentScenario, showFeedback, lastAnswerCorrect]);

  const generateScenarioAudio = async () => {
    if (!currentScenarioData) return;
    
    try {
      const text = currentScenarioData[selectedLanguage];
      console.log('Generating scenario audio:', text.substring(0, 50) + '...');
      const url = await elevenLabsService.generateSpeech({
        language: selectedLanguage,
        text,
        voiceId: 'vGQNBgLaiM3EdZtxIiuY' // Child voice - friendly narrator
      });
      setAudioUrl(url);
    } catch (error) {
      console.error('Failed to generate scenario audio:', error);
    }
  };

  const generateFeedbackAudio = async () => {
    try {
      const feedbackKey = lastAnswerCorrect ? 'correct' : 'incorrect';
      let text = trustedHeroesContent.feedback[feedbackKey][selectedLanguage];
      
      if (lastAnswerCorrect && currentScenarioData) {
        text += ' ' + currentScenarioData.explanation[selectedLanguage];
      }
      
      console.log('Generating feedback audio:', text.substring(0, 50) + '...');
      const url = await elevenLabsService.generateSpeech({
        language: selectedLanguage,
        text,
        voiceId: 'vGQNBgLaiM3EdZtxIiuY' // Child voice
      });
      setAudioUrl(url);
    } catch (error) {
      console.error('Failed to generate feedback audio:', error);
    }
  };

  const handleAnswer = (answer: 'trustworthy' | 'untrustworthy') => {
    const startTime = Date.now();
    const isCorrect = answer === currentScenarioData.correctAnswer;
    const retryCount = questionRetries[currentScenario] || 0;
    const isFirstAttempt = firstAttempts[currentScenario] !== false;
    
    setLastAnswerCorrect(isCorrect);
    setShowFeedback(true);
    
    // Only award points on first correct attempt
    if (isCorrect && isFirstAttempt) {
      setScore(score + 1); // 1 point per correct answer on first attempt
    }

    // Track if this is not the first attempt for this question
    if (!isFirstAttempt) {
      setQuestionRetries(prev => ({
        ...prev,
        [currentScenario]: retryCount + 1
      }));
    }

    // Track detailed question response
    const trackResponse = async () => {
      if (typeof trackQuestionResponse === 'function') {
        await trackQuestionResponse(
          'trusted_heroes_circle',
          `scenario_${currentScenario + 1}`,
          currentScenarioData[selectedLanguage],
          answer,
          currentScenarioData.correctAnswer,
          isCorrect,
          Math.floor((Date.now() - startTime) / 1000),
          retryCount,
          isFirstAttempt
        );
      }
    };
    
    trackResponse();
  };

  const handleReplay = () => {
    // Mark this question as having been attempted before
    setFirstAttempts(prev => ({
      ...prev,
      [currentScenario]: false
    }));
    
    // Increment retry count
    setQuestionRetries(prev => ({
      ...prev,
      [currentScenario]: (prev[currentScenario] || 0) + 1
    }));
    
    setShowFeedback(false);
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setShowFeedback(false);
    } else {
      setGameComplete(true);
      // Track game completion - only award points for first-attempt correct answers
      const finalScore = score;
      const pointsEarned = finalScore; // 1 point per correct first attempt
      trackGameEnd(pointsEarned, true);
    }
  };

  const handleBack = () => {
    if (currentScenario > 0) {
      setCurrentScenario(currentScenario - 1);
      setShowFeedback(false);
    }
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl text-center">
          <div className="mb-6">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-black text-gray-800 mb-4">
              Amazing Work, Hero! 🎉
            </h1>
            <p className="text-2xl text-gray-600 mb-4">
              You scored {score} out of {scenarios.length}!
            </p>
            <div className="bg-green-100 border-l-4 border-green-400 p-4 rounded-r-xl">
              <p className="text-lg text-green-800">
                {trustedHeroesContent.completion[selectedLanguage]}
              </p>
            </div>
          </div>
          
          <button
            onClick={onComplete}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-black py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 text-xl"
          >
            Return to Safety Activities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button - Always show */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={currentScenario > 0 ? handleBack : onComplete}
            className="bg-white/20 hover:bg-white/30 text-white font-bold p-3 rounded-full shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
            aria-label={currentScenario > 0 ? "Go back to previous question" : "Exit game"}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <div className="flex items-center space-x-4">
            <Shield className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-black text-white">
              Trust Detective Quiz
            </h1>
            <div className="bg-white rounded-full px-4 py-2">
              <span className="font-bold text-gray-800">
                {currentScenario + 1} / {scenarios.length}
              </span>
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="text-center mb-6">
          <div className="bg-white rounded-2xl p-4 inline-block shadow-lg">
            <span className="text-2xl font-bold text-gray-800">
              Score: {score} / {scenarios.length}
            </span>
          </div>
        </div>

        {currentScenario === 0 && (
          <div className="flex justify-center mb-6">
            <img 
              src={cleaning} 
              alt="Teacher and Student"
              className="w-100 h-auto rounded-lg"
            />
          </div>
        )}

        {currentScenario === 1 && (
          <div className="flex justify-center mb-6">
            <img 
              src={stranger} 
              alt="Stranger Giving Candy"
              className="w-100 h-auto rounded-lg"
            />
          </div>
        )}

        {currentScenario === 2 && (
          <div className="flex justify-center mb-6">
            <img 
              src={doctorExam} 
              alt="Doctor Visit"
              className="w-100 h-auto rounded-lg"
            />
          </div>
        )}

        {currentScenario === 3 && (
          <div className="flex justify-center mb-6">
            <img 
              src={student} 
              alt="Older and Younger Student"
              className="w-100 h-auto rounded-lg"
            />
          </div>
        )}

        {currentScenario === 4 && (
          <div className="flex justify-center mb-6">
            <img 
              src={neighbour} 
              alt="Neighbour Helping with Homework"
              className="w-100 h-auto rounded-lg"
            />
          </div>
        )}

        {/* Main Game Area */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {!showFeedback ? (
            <>
              {/* Scenario */}
              <div className="text-center mb-8">
                <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-xl mb-6">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {currentScenarioData[selectedLanguage]}
                  </p>
                </div>
                
                <AudioPlayer
                  audioUrl={audioUrl}
                  isPlaying={isPlaying}
                  onPlayStateChange={setIsPlaying}
                  autoPlay={true}
                />
              </div>

              {/* Answer Buttons */}
              <div className="flex justify-center space-x-8">
                <button
                  onClick={() => handleAnswer('trustworthy')}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black py-6 px-8 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center space-x-3 text-xl"
                >
                  <ThumbsUp className="w-8 h-8" />
                  <span>Trustworthy</span>
                </button>
                
                <button
                  onClick={() => handleAnswer('untrustworthy')}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black py-6 px-8 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center space-x-3 text-xl"
                >
                  <ThumbsDown className="w-8 h-8" />
                  <span>Not Trustworthy</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Feedback */}
              <div className="text-center mb-8">
                <div className={`${lastAnswerCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'} border-l-4 p-6 rounded-r-xl mb-6`}>
                  <div className="flex items-center justify-center mb-4">
                    {lastAnswerCorrect ? (
                      <div className="text-6xl">✅</div>
                    ) : (
                      <div className="text-6xl">❌</div>
                    )}
                  </div>
                  <p className="text-xl text-gray-700 leading-relaxed mb-4">
                    {trustedHeroesContent.feedback[lastAnswerCorrect ? 'correct' : 'incorrect'][selectedLanguage]}
                  </p>
                  {lastAnswerCorrect && (
                    <p className="text-lg text-gray-600">
                      {currentScenarioData.explanation[selectedLanguage]}
                    </p>
                  )}
                </div>
                
                <AudioPlayer
                  audioUrl={audioUrl}
                  isPlaying={isPlaying}
                  onPlayStateChange={setIsPlaying}
                  autoPlay={true}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                {!lastAnswerCorrect && (
                  <button
                    onClick={handleReplay}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Try Again</span>
                  </button>
                )}
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Finish Game'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}