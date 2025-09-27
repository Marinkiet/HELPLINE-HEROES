import React from 'react';
import { ArrowLeft, Facebook, Instagram, Twitter } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface CardGamesPageProps {
  onBack: () => void;
}

export function CardGamesPage({ onBack }: CardGamesPageProps) {
  const { selectedLanguage } = useAudio();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-yellow-400">
      {/* Top Navigation Bar */}
      <nav className="bg-black text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left side - Logo and branding */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-6 bg-green-500"></div>
              <div className="w-8 h-6 bg-white"></div>
              <div className="w-8 h-6 bg-orange-500"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-yellow-400">30 SECONDS</h1>
              <p className="text-sm text-yellow-300 italic">the quick thinking fast talking game</p>
            </div>
            <span className="text-white text-lg font-bold">Irish Edition</span>
          </div>

          {/* Center - Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8 text-yellow-300 font-bold">
            <button onClick={onBack} className="hover:text-white transition-colors">
              How to Play
            </button>
            <span className="hover:text-white transition-colors cursor-pointer">Buy the Games</span>
            <span className="hover:text-white transition-colors cursor-pointer">30 Seconds of Facts</span>
            <span className="hover:text-white transition-colors cursor-pointer">News</span>
            <span className="hover:text-white transition-colors cursor-pointer">The Story So Far</span>
            <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
          </div>

          {/* Right side - Social Media Icons */}
          <div className="flex items-center space-x-4">
            <Facebook className="w-8 h-8 text-blue-500 hover:text-blue-400 cursor-pointer" />
            <Instagram className="w-8 h-8 text-pink-500 hover:text-pink-400 cursor-pointer" />
            <Twitter className="w-8 h-8 text-blue-400 hover:text-blue-300 cursor-pointer" />
          </div>

          {/* Mobile back button */}
          <button
            onClick={onBack}
            className="md:hidden flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-xl transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </nav>

      {/* Main Hero Section */}
      <div className="bg-gradient-to-b from-yellow-400 to-yellow-300 min-h-screen relative overflow-hidden">
        {/* Decorative hourglass background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-96 h-96">
            <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-600">
              <path d="M20 10 L80 10 L50 50 L80 90 L20 90 L50 50 Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Left side - Game boxes */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Main 30 Seconds box */}
                <div className="bg-black rounded-lg p-8 shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-4 bg-green-500"></div>
                    <div className="w-6 h-4 bg-white"></div>
                    <div className="w-6 h-4 bg-orange-500"></div>
                    <span className="text-white text-sm">Irish Edition</span>
                  </div>
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-white text-2xl">😊</div>
                    </div>
                  </div>
                  <h2 className="text-4xl font-black text-yellow-400 mb-2">30 SECONDS</h2>
                  <p className="text-yellow-300 text-sm italic">the quick thinking fast talking game</p>
                </div>

                {/* Junior version box - positioned to the right */}
                <div className="absolute -right-32 top-32 bg-purple-600 rounded-lg p-6 shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-4 h-3 bg-green-500"></div>
                    <div className="w-4 h-3 bg-white"></div>
                    <div className="w-4 h-3 bg-orange-500"></div>
                  </div>
                  <div className="mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                      <div className="text-white text-lg">😊</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-yellow-400 mb-1">junior</h3>
                  <h3 className="text-2xl font-black text-yellow-400 mb-1">30 SECONDS</h3>
                  <p className="text-yellow-300 text-xs italic">the quick thinking fast talking game</p>
                  
                  {/* Game board preview */}
                  <div className="mt-4 grid grid-cols-4 gap-1">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded ${
                        i % 4 === 0 ? 'bg-red-500' :
                        i % 4 === 1 ? 'bg-green-500' :
                        i % 4 === 2 ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Text content */}
            <div className="text-center lg:text-left space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                  30 Seconds & 30 Seconds Junior
                  <br />
                  <span className="text-4xl md:text-5xl">are fun, fast-paced</span>
                  <br />
                  <span className="text-4xl md:text-5xl">& easy to play</span>
                  <br />
                  <span className="text-4xl md:text-5xl text-yellow-600">general knowledge</span>
                  <br />
                  <span className="text-4xl md:text-5xl text-yellow-600">board games</span>
                </h1>
              </div>

              {/* How Do You Play Button */}
              <div className="flex justify-center lg:justify-start">
                <button className="bg-blue-400 hover:bg-blue-500 text-white font-black text-2xl px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200">
                  How Do You Play?
                </button>
              </div>

              {/* Additional info */}
              <div className="bg-black/20 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-black text-white mb-4">Perfect for Safety Education!</h3>
                <p className="text-white/90 text-lg leading-relaxed">
                  Our special edition includes safety-themed cards that make learning about personal safety, 
                  trusted adults, and brave voice concepts fun and engaging for the whole family.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-yellow-500 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}