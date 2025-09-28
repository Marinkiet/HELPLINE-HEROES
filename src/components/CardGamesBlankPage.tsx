import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface CardGamesBlankPageProps {
  onBack: () => void;
}

export function CardGamesBlankPage({ onBack }: CardGamesBlankPageProps) {
  const { selectedLanguage } = useAudio();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Decorative circles */}
        <div className="absolute top-20 left-16 w-24 h-24 bg-white/20 rounded-full"></div>
        <div className="absolute top-60 right-40 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 right-32 w-16 h-16 bg-white/30 rounded-full"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-white/15 rounded-full"></div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-full shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="Go back to home"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl font-black text-blue-600">Card Games</h1>
              <p className="text-sm text-blue-500 font-medium">Educational Safety Games</p>
            </div>

            {/* Spacer for balance */}
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
            <div className="mb-8">
              <div className="text-8xl mb-6">🎴</div>
              <h2 className="text-4xl font-black text-gray-800 mb-4">
                Card Games
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Fun educational card games are coming soon!
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl mb-8">
              <p className="text-lg text-blue-800 leading-relaxed">
                We're working on exciting card games that will help children learn about safety 
                in a fun and interactive way. Check back soon for updates!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl">
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="font-bold text-purple-800 mb-2">Safety Cards</h3>
                <p className="text-purple-700 text-sm">Learn safety rules through interactive cards</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="font-bold text-green-800 mb-2">Trust Game</h3>
                <p className="text-green-700 text-sm">Identify trusted adults and safe situations</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl">
                <div className="text-4xl mb-3">🗣️</div>
                <h3 className="font-bold text-orange-800 mb-2">Voice Cards</h3>
                <p className="text-orange-700 text-sm">Practice using your brave voice</p>
              </div>
            </div>

            <button
              onClick={onBack}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black text-xl px-8 py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Back to Safety Activities
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}