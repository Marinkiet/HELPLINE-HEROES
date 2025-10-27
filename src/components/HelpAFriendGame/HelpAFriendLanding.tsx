import { Play, Heart, Users } from 'lucide-react';
import { useAudio } from '../../contexts/AudioContext';

interface HelpAFriendLandingProps {
  onStartGame: () => void;
}

export function HelpAFriendLanding({ onStartGame }: HelpAFriendLandingProps) {
  const { selectedLanguage } = useAudio();

  const content = {
    en: {
      title: 'Help a Friend',
      subtitle: 'Learn how to support your friends when they need you',
      intro: 'Being a good friend means knowing when someone needs help and how to support them.',
      readyButton: 'Start Learning'
    }
  };

  const text = content[selectedLanguage as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-rose-400 to-red-400 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-full">
              <Users className="w-16 h-16 md:w-20 md:h-20 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {text.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-6">
            {text.subtitle}
          </p>

          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {text.intro}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-4 text-left bg-white p-4 rounded-xl shadow-md">
              <Heart className="w-8 h-8 text-pink-500 flex-shrink-0" />
              <p className="text-gray-700 font-medium">Recognize when friends need help</p>
            </div>

            <div className="flex items-center justify-center space-x-4 text-left bg-white p-4 rounded-xl shadow-md">
              <Users className="w-8 h-8 text-rose-500 flex-shrink-0" />
              <p className="text-gray-700 font-medium">Learn how to be supportive</p>
            </div>

            <div className="flex items-center justify-center space-x-4 text-left bg-white p-4 rounded-xl shadow-md">
              <Heart className="w-8 h-8 text-red-500 flex-shrink-0" />
              <p className="text-gray-700 font-medium">Know when to get adult help</p>
            </div>
          </div>

          <button
            onClick={onStartGame}
            className="group bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-12 py-6 rounded-full text-xl font-bold shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center mx-auto"
          >
            <Play className="w-6 h-6 mr-3 group-hover:animate-pulse" />
            {text.readyButton}
          </button>
        </div>
      </div>
    </div>
  );
}
