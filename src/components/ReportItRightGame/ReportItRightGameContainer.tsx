import { useState } from 'react';
import { Play, AlertCircle, CheckCircle, Trophy } from 'lucide-react';
import { useEngagement } from '../../contexts/EngagementContext';

interface ReportItRightGameContainerProps {
  onClose: () => void;
}

export function ReportItRightGameContainer({ onClose }: ReportItRightGameContainerProps) {
  const { trackGameComplete } = useEngagement();
  const [stage, setStage] = useState<'intro' | 'quiz' | 'complete'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = [
    {
      q: 'Should you share your password with your best friend?',
      options: ['Yes, they\'re my best friend', 'No, never share passwords', 'Only if they ask nicely'],
      correct: 1,
      feedback: 'Never share your password with anyone, even friends!'
    },
    {
      q: 'A stranger online wants to meet you. What should you do?',
      options: ['Meet them in a public place', 'Tell a trusted adult immediately', 'Chat with them more first'],
      correct: 1,
      feedback: 'Always tell a trusted adult if someone online wants to meet you!'
    },
    {
      q: 'Someone online is being mean to you. What\'s the best response?',
      options: ['Be mean back', 'Block them and tell an adult', 'Keep arguing with them'],
      correct: 1,
      feedback: 'Block bullies and tell a trusted adult. Don\'t engage!'
    },
    {
      q: 'Is it safe to post your home address online?',
      options: ['Yes, if it\'s on a private account', 'No, never post personal information', 'Only for friends'],
      correct: 1,
      feedback: 'Never post personal information like addresses online!'
    }
  ];

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === questions[currentQ].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      trackGameComplete('12', 'Report It Right', score);
      setStage('complete');
    }
  };

  if (stage === 'intro') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-400 via-teal-400 to-green-500 flex items-center justify-center p-4 z-50">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-full">
                <AlertCircle className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Report It Right</h1>
            <p className="text-xl text-gray-700 mb-8">
              Learn how to stay safe online and recognize inappropriate behavior on the internet.
            </p>
            <button
              onClick={() => setStage('quiz')}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-6 rounded-full text-xl font-bold shadow-xl transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center mx-auto"
            >
              <Play className="w-6 h-6 mr-3" />
              Start Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'complete') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-400 via-teal-400 to-green-500 flex items-center justify-center p-4 z-50">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-gray-900 mb-4">Great Job!</h2>
          <p className="text-2xl text-gray-700 mb-8">
            You scored {score} out of {questions.length}!
          </p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-12 py-4 rounded-full text-xl font-bold shadow-lg transform hover:scale-105 active:scale-95 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-400 via-teal-400 to-green-500 flex items-center justify-center p-4 z-50 overflow-auto">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 my-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-gray-600">
              Question {currentQ + 1} of {questions.length}
            </div>
            <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-600">{score}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-bold text-white text-center">{q.q}</h3>
        </div>

        <div className="space-y-4 mb-8">
          {q.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showFeedback}
              className={`w-full p-4 rounded-xl font-semibold text-left transition-all ${
                selectedAnswer === index
                  ? index === q.correct
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-red-100 border-2 border-red-500'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-green-400'
              }`}
            >
              {option}
              {showFeedback && selectedAnswer === index && (
                index === q.correct ? (
                  <CheckCircle className="w-6 h-6 text-green-600 inline ml-2" />
                ) : (
                  <span className="text-red-600 inline ml-2">✗</span>
                )
              )}
            </button>
          ))}
        </div>

        {showFeedback && (
          <>
            <div className="bg-green-50 p-6 rounded-xl mb-6">
              <p className="text-gray-700 font-medium">{q.feedback}</p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-full font-bold shadow-lg transform hover:scale-105 active:scale-95 transition-all"
            >
              {currentQ < questions.length - 1 ? 'Next Question' : 'Complete!'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
