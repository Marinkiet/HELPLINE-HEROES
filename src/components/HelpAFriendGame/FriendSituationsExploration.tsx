import { useState } from 'react';
import { ArrowRight, Heart, AlertCircle, Users } from 'lucide-react';
import { useAudio } from '../../contexts/AudioContext';

interface FriendSituationsExplorationProps {
  onComplete: () => void;
}

export function FriendSituationsExploration({ onComplete }: FriendSituationsExplorationProps) {
  const { selectedLanguage } = useAudio();
  const [currentSlide, setCurrentSlide] = useState(0);

  const situations = [
    {
      icon: Heart,
      title: 'Signs a Friend Needs Help',
      points: [
        'They seem sad or worried a lot',
        'They stop wanting to play or talk',
        'They have unexplained injuries',
        'They talk about wanting to hurt themselves'
      ],
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Users,
      title: 'How to Be a Good Friend',
      points: [
        'Listen without judging',
        'Tell them you care about them',
        'Spend time with them',
        'Let them know they\'re not alone'
      ],
      color: 'from-rose-500 to-red-500'
    },
    {
      icon: AlertCircle,
      title: 'When to Get Adult Help',
      points: [
        'If they\'re being hurt or threatened',
        'If they talk about harming themselves',
        'If they\'re in danger',
        'If the problem is too big to handle alone'
      ],
      color: 'from-red-500 to-pink-500'
    }
  ];

  const currentSituation = situations[currentSlide];
  const Icon = currentSituation.icon;

  const handleNext = () => {
    if (currentSlide < situations.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-rose-400 to-red-400 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className={`bg-gradient-to-r ${currentSituation.color} p-6 rounded-2xl mb-8`}>
          <div className="flex items-center justify-center mb-4">
            <Icon className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white text-center">
            {currentSituation.title}
          </h2>
        </div>

        <div className="space-y-4 mb-8">
          {currentSituation.points.map((point, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 bg-gray-50 p-4 rounded-xl"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <p className="text-gray-700 font-medium text-lg">{point}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {situations.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-pink-600' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-4 rounded-full font-bold flex items-center shadow-lg transform hover:scale-105 active:scale-95 transition-all"
          >
            {currentSlide < situations.length - 1 ? 'Next' : 'Continue'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
