import { ArrowLeft } from 'lucide-react';

interface BraveVoiceGameContainerProps {
  onBack: () => void;
}

export function BraveVoiceGameContainer({ onBack }: BraveVoiceGameContainerProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-50 to-white z-50 overflow-y-auto">
      <div className="min-h-screen p-6">
        <button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 text-purple-700 hover:text-purple-800 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Games</span>
        </button>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-4">Brave Voice Game</h1>
          <p className="text-gray-600 mb-8">
            Learn how to speak up and use your brave voice in different situations.
          </p>

          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">This game is coming soon!</p>
            <p className="text-gray-400 mt-2">Check back later for an exciting learning experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
}