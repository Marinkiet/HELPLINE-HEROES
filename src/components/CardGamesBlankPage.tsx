import React from 'react';
import { ArrowLeft, Facebook, Instagram, Twitter } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface CardGamesBlankPageProps {
  onBack: () => void;
}

export function CardGamesBlankPage({ onBack }: CardGamesBlankPageProps) {
  const { selectedLanguage } = useAudio();

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-200 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Large hourglass background - positioned like in reference */}
        <div className="absolute top-40 left-32 opacity-30">
          <div className="text-yellow-600/50 text-9xl transform rotate-12">⏳</div>
        </div>
        
        {/* Additional decorative circles */}
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-yellow-500/20 rounded-full"></div>
        <div className="absolute top-60 right-40 w-32 h-32 bg-orange-400/20 rounded-full"></div>
        <div className="absolute bottom-20 right-32 w-16 h-16 bg-yellow-600/20 rounded-full"></div>
        
        {/* Subtle wave pattern at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 opacity-80"></div>
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
              
              <div className="text-white text-sm font-semibold">Irish Edition</div>
            </div>

            {/* Center - Main logo */}
            <div className="text-center">
              <h1 className="text-4xl font-black text-yellow-400">30 SECONDS</h1>
              <p className="text-sm text-red-400 italic font-medium">the quick thinking fast talking game</p>
            </div>

            {/* Right side - Social media icons */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                <Facebook className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer">
                <Instagram className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                <Twitter className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Navigation menu */}
          <div className="border-t border-gray-700 py-3">
            <nav className="flex justify-center space-x-8 text-yellow-400 text-sm font-semibold">
              <span className="hover:text-yellow-300 cursor-pointer transition-colors">How To Play</span>
              <span className="hover:text-yellow-300 cursor-pointer transition-colors">Buy the Games</span>
              <span className="hover:text-yellow-300 cursor-pointer transition-colors">30 Seconds of Facts</span>
              <span className="hover:text-yellow-300 cursor-pointer transition-colors">News</span>
              <span className="hover:text-yellow-300 cursor-pointer transition-colors">The story so far</span>
              <span className="hover:text-yellow-300 cursor-pointer transition-colors">Contact</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10">
        {/* Back Button */}
        <div className="absolute top-8 left-8 z-20">
          <button
            onClick={onBack}
            className="bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 font-bold p-3 rounded-full shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center min-h-[600px]">
            
            {/* Left - Main game box */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative transform hover:scale-105 transition-transform duration-300">
                {/* Box shadow */}
                <div className="absolute inset-0 rounded-lg transform translate-x-3 translate-y-3"></div>
                
                <div className="relative w-80 h-[480px] rounded-lg shadow-2xl p-6 flex flex-col">
                  <img 
                    src="https://trustlineheroes.s3.eu-north-1.amazonaws.com/gamecards.png"
                    alt="Game Card"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Center - Main text and button */}
            <div className="text-center">
              <h1 className="text-5xl lg:text-6xl font-black text-white mb-12 leading-tight drop-shadow-2xl">
                Trustline heroes is engaging, empowering
                <br />
                <span className="text-4xl lg:text-2xl">& simple to play.</span>
                <br />
                <span className="text-4xl lg:text-2xl">An awareness-building</span>
                <br />
                <span className="text-4xl lg:text-2xl">board game that helps kids</span>
                <br />
                <span className="text-4xl lg:text-2xl">learn to recognize, resist & report</span>
                <br />
                <span className="text-4xl lg:text-2xl">unsafe situations.</span>
              </h1>
              
              <button className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-black text-2xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200 border-4 border-white">
                How Do You Play?
              </button>
            </div>

            {/* Right - Junior game box and board */}
            <div className="flex flex-col items-center lg:items-start space-y-8">
              {/* Junior game box */}
              <div className="relative transform rotate-12 hover:rotate-6 transition-transform duration-300">
                {/* Box shadow */}
                <div className="absolute inset-0 bg-purple-800/40 rounded-lg transform translate-x-3 translate-y-3"></div>
                
                <div className="relative w-72 h-80 bg-purple-600 rounded-lg shadow-2xl p-4 flex flex-col">
                  {/* Irish flag on junior box */}
                  <div className="flex mb-2">
                    <div className="w-4 h-3 bg-green-500"></div>
                    <div className="w-4 h-3 bg-white"></div>
                    <div className="w-4 h-3 bg-orange-500"></div>
                  </div>
                  
                  <div className="text-white text-sm mb-2 font-semibold">junior</div>
                  
                  {/* Blue smiley */}
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-white text-2xl">😊</div>
                  </div>
                  
                  {/* Junior title */}
                  <h3 className="text-yellow-400 text-3xl font-black mb-2 leading-tight">30 SECONDS</h3>
                  <p className="text-red-400 text-sm italic mb-4 font-medium">the quick thinking fast talking game</p>
                  
                  {/* Game board preview inside box */}
                  <div className="flex-1 bg-purple-700 rounded-lg p-3">
                    <div className="grid grid-cols-6 gap-1 h-full">
                      {Array.from({ length: 36 }, (_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            i % 6 === 0 ? 'bg-red-400' :
                            i % 6 === 1 ? 'bg-green-400' :
                            i % 6 === 2 ? 'bg-blue-400' : 
                            i % 6 === 3 ? 'bg-yellow-400' :
                            i % 6 === 4 ? 'bg-orange-400' : 'bg-pink-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Ages indicator */}
                  <div className="text-white text-xs mt-2 opacity-80">
                    Ages 6+
                  </div>
                </div>
              </div>

              {/* Separate game board - positioned to match reference */}
              <div className="relative transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                {/* Board shadow */}
                <div className="absolute inset-0 bg-purple-800/40 rounded-lg transform translate-x-3 translate-y-3"></div>
                
                <div className="relative bg-purple-600 rounded-lg p-6 w-80 h-80 shadow-2xl">
                  {/* Board header */}
                  <div className="text-center mb-4">
                    <h3 className="text-yellow-400 text-2xl font-black">GAME BOARD</h3>
                    <p className="text-white text-sm font-semibold">junior edition</p>
                  </div>
                  
                  {/* Main game board grid */}
                  <div className="bg-purple-700 rounded-lg p-4 h-56">
                    <div className="grid grid-cols-8 gap-1 h-full">
                      {Array.from({ length: 64 }, (_, i) => {
                        // Create a spiral board pattern like in the reference
                        const colors = [
                          'bg-red-400', 'bg-green-400', 'bg-blue-400', 'bg-yellow-400', 
                          'bg-orange-400', 'bg-pink-400', 'bg-purple-400', 'bg-cyan-400'
                        ];
                        
                        // Create a more interesting pattern
                        let colorIndex;
                        if (i < 8) colorIndex = 0; // Top row - red
                        else if (i >= 56) colorIndex = 1; // Bottom row - green
                        else if (i % 8 === 0) colorIndex = 2; // Left column - blue
                        else if (i % 8 === 7) colorIndex = 3; // Right column - yellow
                        else colorIndex = (i % 4) + 4; // Interior - other colors
                        
                        return (
                          <div
                            key={i}
                            className={`rounded-sm ${colors[colorIndex]} hover:opacity-80 transition-opacity cursor-pointer shadow-sm`}
                          />
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Board footer */}
                  <div className="text-center mt-3">
                    <p className="text-white text-sm font-bold">Roll dice & answer questions!</p>
                  </div>
                </div>
              </div>
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