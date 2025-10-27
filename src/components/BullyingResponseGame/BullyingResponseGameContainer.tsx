import { ArrowLeft } from 'lucide-react';

interface BullyingResponseGameContainerProps {
  onBack: () => void;
}

export function BullyingResponseGameContainer({ onBack }: BullyingResponseGameContainerProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-orange-50 to-white z-50 overflow-y-auto">
      <div className="min-h-screen p-6">
        <button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 text-orange-700 hover:text-orange-800 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Games</span>
        </button>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-orange-900 mb-4">Bullying Response Game</h1>
          <p className="text-gray-600 mb-8">
            Learn how to respond to bullying and support others who are being bullied.
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