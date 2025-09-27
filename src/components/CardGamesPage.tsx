import React from 'react';
import { ArrowLeft, Facebook, Instagram, Twitter } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface CardGamesPageProps {
  onBack: () => void;
}

export function CardGamesPage({ onBack }: CardGamesPageProps) {
  const { selectedLanguage } = useAudio();

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-200 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Large hourglass background */}
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 opacity-20">
          <div className="text-yellow-600 text-9xl">⏳</div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-yellow-500/20 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-orange-400/20 rounded-full"></div>
        <div className="absolute bottom-40 right-20 w-16 h-16 bg-yellow-600/20 rounded-full"></div>
      </div>

      {/* Header */}
      <header className="bg-black text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side - Logo and branding */}
            <div className="flex items-center space-x-4">
              {/* Irish flag */}
              <div className="flex">
                <div className="w-6 h-4 bg-green-500"></div>
                <div className="w-6 h-4 bg-white"></div>
                <div className="w-6 h-4 bg-orange-500"></div>
              </div>
              
              {/* Blue smiley face logo */}
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="text-white text-xl">😊</div>
              </div>
              
              <div className="text-white text-sm">Irish Edition</div>
            </div>

            {/* Center - Main logo */}
            <div className="text-center">
              <h1 className="text-4xl font-black text-yellow-400">30 SECONDS</h1>
              <p className="text-sm text-red-400 italic">the quick thinking fast talking game</p>
            </div>

            {/* Right side - Social media icons */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Facebook className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center">
                <Instagram className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center">
                <Twitter className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Navigation menu */}
          <div className="border-t border-gray-700 py-3">
            <nav className="flex justify-center space-x-8 text-yellow-400 text-sm font-semibold">
              <span className="hover:text-yellow-300 cursor-pointer">How To Play</span>
              <span className="hover:text-yellow-300 cursor-pointer">Buy the Games</span>
              <span className="hover:text-yellow-300 cursor-pointer">30 Seconds of Facts</span>
              <span className="hover:text-yellow-300 cursor-pointer">News</span>
              <span className="hover:text-yellow-300 cursor-pointer">The story so far</span>
              <span className="hover:text-yellow-300 cursor-pointer">Contact</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={onBack}
            className="bg-white/20 hover:bg-white/30 text-gray-800 hover:text-gray-900 font-bold p-3 rounded-full shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            
            {/* Left - Main game box */}
            <div className="flex justify-center">
              <div className="relative transform hover:scale-105 transition-transform duration-300">
                {/* Box shadow */}
                <div className="absolute inset-0 bg-black/30 rounded-lg transform translate-x-2 translate-y-2"></div>
                
                <div className="relative w-80 h-96 bg-black rounded-lg shadow-2xl p-6 flex flex-col">
                  {/* Irish flag on box */}
                  <div className="flex mb-4">
                    <div className="w-4 h-3 bg-green-500"></div>
                    <div className="w-4 h-3 bg-white"></div>
                    <div className="w-4 h-3 bg-orange-500"></div>
                  </div>
                  
                  <div className="text-white text-xs mb-2">Irish Edition</div>
                  
                  {/* Blue smiley */}
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-white text-2xl">😊</div>
                  </div>
                  
                  {/* Main title */}
                  <h2 className="text-yellow-400 text-4xl font-black mb-2">30 SECONDS</h2>
                  <p className="text-red-400 text-sm italic mb-4">the quick thinking fast talking game</p>
                  
                  {/* Side text */}
                  <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90">
                    <span className="text-yellow-400 text-lg font-black whitespace-nowrap">30 SECONDS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Main text and button */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-black text-white mb-8 leading-tight drop-shadow-lg">
                30 Seconds & 30 Seconds junior
                <br />
                are fun, fast-paced
                <br />
                & easy to play
                <br />
                general knowledge
                <br />
                board games
              </h1>
              
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-black text-2xl px-12 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
                How Do You Play?
              </button>
            </div>

            {/* Right - Junior game box and board */}
            <div className="flex flex-col items-center space-y-8">
              {/* Junior game box */}
              <div className="relative transform rotate-12 hover:rotate-0 transition-transform duration-300">
                {/* Box shadow */}
                <div className="absolute inset-0 bg-purple-800/30 rounded-lg transform translate-x-2 translate-y-2"></div>
                
                <div className="relative w-72 h-72 bg-purple-600 rounded-lg shadow-2xl p-4 flex flex-col">
                  {/* Irish flag on junior box */}
                  <div className="flex mb-2">
                    <div className="w-3 h-2 bg-green-500"></div>
                    <div className="w-3 h-2 bg-white"></div>
                    <div className="w-3 h-2 bg-orange-500"></div>
                  </div>
                  
                  <div className="text-white text-xs mb-2">junior</div>
                  
                  {/* Blue smiley */}
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                    <div className="text-white text-lg">😊</div>
                  </div>
                  
                  {/* Junior title */}
                  <h3 className="text-yellow-400 text-2xl font-black mb-1">30 SECONDS</h3>
                  <p className="text-red-400 text-xs italic mb-4">the quick thinking fast talking game</p>
                  
                  {/* Game board preview inside box */}
                  <div className="flex-1 bg-purple-700 rounded p-2">
                    <div className="grid grid-cols-6 gap-1 h-full">
                      {Array.from({ length: 36 }, (_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            i % 4 === 0 ? 'bg-red-400' :
                            i % 4 === 1 ? 'bg-green-400' :
                            i % 4 === 2 ? 'bg-blue-400' : 'bg-yellow-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Separate game board */}
              <div className="relative">
                {/* Board shadow */}
                <div className="absolute inset-0 bg-purple-800/30 rounded-lg transform translate-x-2 translate-y-2"></div>
                
                <div className="relative bg-purple-600 rounded-lg p-4 w-80 h-80 shadow-2xl">
                  {/* Board header */}
                  <div className="text-center mb-4">
                    <h3 className="text-yellow-400 text-xl font-black">GAME BOARD</h3>
                    <p className="text-white text-xs">junior edition</p>
                  </div>
                  
                  {/* Main game board grid */}
                  <div className="bg-purple-700 rounded p-3 h-64">
                    <div className="grid grid-cols-8 gap-1 h-full">
                      {Array.from({ length: 64 }, (_, i) => {
                        // Create a more realistic board pattern
                        const colors = ['bg-red-400', 'bg-green-400', 'bg-blue-400', 'bg-yellow-400', 'bg-orange-400', 'bg-pink-400'];
                        const colorIndex = Math.floor(i / 8) % colors.length;
                        return (
                          <div
                            key={i}
                            className={`rounded-sm ${colors[colorIndex]} hover:opacity-80 transition-opacity cursor-pointer`}
                          />
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Board footer */}
                  <div className="text-center mt-2">
                    <p className="text-white text-xs font-semibold">Roll dice & answer questions!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section - Educational context */}
          <div className="mt-16 text-center">
            <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-black text-white mb-4 drop-shadow-lg">
                Educational Fun for the Whole Family
              </h2>
              <p className="text-xl text-white/90 leading-relaxed drop-shadow">
                These fast-paced games help children develop communication skills, quick thinking, 
                and confidence - all while having fun with family and friends. Perfect for building 
                the social skills that help keep children safe and connected.
              </p>
            </div>
          </div>
        </div>

        {/* Shopping cart icon (bottom right) */}
        <div className="fixed bottom-8 right-8 z-20">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-all duration-200">
              <div className="text-white font-bold text-lg">🛒</div>
            </div>
            {/* Cart count badge */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">0</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}