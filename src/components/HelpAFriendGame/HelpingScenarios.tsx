import { useState } from 'react';
import { CheckCircle, XCircle, Heart, Trophy } from 'lucide-react';
import { useAudio } from '../../contexts/AudioContext';
import { useEngagement } from '../../contexts/EngagementContext';

interface HelpingScenariosProps {
  onComplete: () => void;
}

export function HelpingScenarios({ onComplete }: HelpingScenariosProps) {
  const { selectedLanguage } = useAudio();
  const { trackGameComplete } = useEngagement();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const scenarios = [
    {
      situation: 'Your friend tells you they feel scared at home. What should you do?',
      options: [
        { text: 'Tell them to stop complaining', correct: false },
        { text: 'Listen and help them talk to a trusted adult', correct: true },
        { text: 'Ignore them and change the subject', correct: false }
      ],
      correctFeedback: 'Great job! Helping a friend talk to a trusted adult is the right thing to do.',
      incorrectFeedback: 'Not quite. When a friend is scared, help them find a trusted adult to talk to.'
    },
    {
      situation: 'A friend shows you bruises and asks you not to tell anyone. What do you do?',
      options: [
        { text: 'Keep the secret because you promised', correct: false },
        { text: 'Tell a trusted adult right away', correct: true },
        { text: 'Tell all your other friends', correct: false }
      ],
      correctFeedback: 'Excellent! Some secrets should never be kept, especially if someone is being hurt.',
      incorrectFeedback: 'Remember: If a friend is being hurt, you must tell a trusted adult, even if you promised.'
    },
    {
      situation: 'Your friend seems really sad and won\'t play anymore. What\'s the best way to help?',
      options: [
        { text: 'Make fun of them for being sad', correct: false },
        { text: 'Ask them if they\'re okay and listen to them', correct: true },
        { text: 'Leave them alone forever', correct: false }
      ],
      correctFeedback: 'Perfect! Being a good listener shows you care about your friend.',
      incorrectFeedback: 'Try again. The best way to help is to ask if they\'re okay and really listen to them.'
    },
    {
      situation: 'A friend tells you someone touched them in a way that made them uncomfortable. What should you do?',
      options: [
        { text: 'Tell them it\'s probably nothing', correct: false },
        { text: 'Believe them and help them tell a trusted adult', correct: true },
        { text: 'Ask them lots of detailed questions', correct: false }
      ],
      correctFeedback: 'You\'re right! Always believe your friend and help them find adult help immediately.',
      incorrectFeedback: 'Remember: Always believe your friend and help them tell a trusted adult right away.'
    }
  ];

  const currentQ = scenarios[currentScenario];

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;

    setSelectedAnswer(index);
    setShowFeedback(true);

    if (currentQ.options[index].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      trackGameComplete('6', 'Help a Friend', score);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-rose-400 to-red-400 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-gray-600">
              Question {currentScenario + 1} of {scenarios.length}
            </div>
            <div className="flex items-center space-x-2 bg-pink-100 px-4 py-2 rounded-full">
              <Trophy className="w-5 h-5 text-pink-600" />
              <span className="font-bold text-pink-600">{score} / {scenarios.length}</span>
            </div>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-600 to-rose-600 transition-all duration-300"
              style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-bold text-white text-center">
            {currentQ.situation}
          </h3>
        </div>

        <div className="space-y-4 mb-8">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showFeedback}
              className={`w-full p-4 rounded-xl font-semibold text-left transition-all transform hover:scale-102 ${
                selectedAnswer === index
                  ? option.correct
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-red-100 border-2 border-red-500'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-pink-400'
              } ${showFeedback ? 'cursor-not-allowed' : 'hover:shadow-lg'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-800">{option.text}</span>
                {showFeedback && selectedAnswer === index && (
                  option.correct ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )
                )}
              </div>
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`p-6 rounded-xl mb-6 ${
            currentQ.options[selectedAnswer!].correct ? 'bg-green-50' : 'bg-orange-50'
          }`}>
            <div className="flex items-start space-x-3">
              {currentQ.options[selectedAnswer!].correct ? (
                <Heart className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              ) : (
                <Heart className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              )}
              <p className="text-gray-700 font-medium">
                {currentQ.options[selectedAnswer!].correct
                  ? currentQ.correctFeedback
                  : currentQ.incorrectFeedback}
              </p>
            </div>
          </div>
        )}

        {showFeedback && (
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-4 rounded-full font-bold shadow-lg transform hover:scale-105 active:scale-95 transition-all"
          >
            {currentScenario < scenarios.length - 1 ? 'Next Question' : 'Complete!'}
          </button>
        )}
      </div>
    </div>
  );
}
