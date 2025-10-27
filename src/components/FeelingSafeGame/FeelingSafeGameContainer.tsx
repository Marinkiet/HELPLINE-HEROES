import { ArrowLeft } from 'lucide-react';

interface FeelingSafeGameContainerProps {
  onBack: () => void;
}

export function FeelingSafeGameContainer({ onBack }: FeelingSafeGameContainerProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-white z-50 overflow-y-auto">
      <div className="min-h-screen p-6">
        <button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 text-blue-700 hover:text-blue-800 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Games</span>
        </button>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Feeling Safe Game</h1>
          <p className="text-gray-600 mb-8">
            Explore what makes you feel safe and learn to recognize safe environments.
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