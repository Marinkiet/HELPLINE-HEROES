import React from 'react';
import { ArrowLeft, ExternalLink, Users, Clock, Star } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface CardGamesPageProps {
  onBack: () => void;
}

export function CardGamesPage({ onBack }: CardGamesPageProps) {
  const { selectedLanguage } = useAudio();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-400">
      {/* Navigation */}
      <nav className="bg-black/10 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 bg-black/20 hover:bg-black/30 text-black font-bold px-4 py-2 rounded-xl transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <h1 className="text-2xl font-black text-black">
              30 Seconds Card Games
            </h1>
            
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="bg-black/10 rounded-3xl p-8 shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/1679618/pexels-photo-1679618.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="30 Seconds Card Game"
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute -top-4 -right-4 bg-yellow-500 text-black font-black px-4 py-2 rounded-full shadow-lg transform rotate-12">
                  <Star className="w-5 h-5 inline mr-1" />
                  Popular!
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-black leading-tight mb-4">
                30 Seconds
                <span className="block text-4xl md:text-5xl text-black/80">Card Games</span>
              </h1>
              <div className="w-24 h-2 bg-black rounded-full mb-6"></div>
            </div>

            <div className="space-y-6">
              <p className="text-xl text-black/90 font-semibold leading-relaxed">
                Experience the excitement of 30 Seconds with our educational card games! 
                These fun, fast-paced games help children learn important safety concepts 
                while having a blast with friends and family.
              </p>

              <div className="bg-black/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-2xl font-black text-black mb-4">How to Play:</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-black text-yellow-400 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                    <p className="text-black font-semibold">Pick your teams and get ready for fun!</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-black text-yellow-400 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                    <p className="text-black font-semibold">Turn the timer and pick a card with safety topics</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-black text-yellow-400 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                    <p className="text-black font-semibold">Describe the safety concepts to your teammates as quickly as you can!</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/10 rounded-xl p-4 text-center">
                  <Users className="w-8 h-8 text-black mx-auto mb-2" />
                  <h4 className="font-black text-black">2-20 Players</h4>
                  <p className="text-black/80 text-sm">Perfect for groups</p>
                </div>
                <div className="bg-black/10 rounded-xl p-4 text-center">
                  <Clock className="w-8 h-8 text-black mx-auto mb-2" />
                  <h4 className="font-black text-black">30 Seconds</h4>
                  <p className="text-black/80 text-sm">Fast-paced fun</p>
                </div>
                <div className="bg-black/10 rounded-xl p-4 text-center">
                  <Star className="w-8 h-8 text-black mx-auto mb-2" />
                  <h4 className="font-black text-black">Educational</h4>
                  <p className="text-black/80 text-sm">Learn while playing</p>
                </div>
              </div>

              <div className="bg-black/10 rounded-2xl p-6 text-center">
                <h3 className="text-2xl font-black text-black mb-4">Ready to Play?</h3>
                <p className="text-lg text-black/80 font-semibold">
                  Get your physical 30 Seconds card game and gather your family and friends for hours of educational fun!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-black/10 rounded-3xl p-8">
          <h2 className="text-3xl font-black text-black mb-6 text-center">
            Why Play 30 Seconds Card Games?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-yellow-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="font-black text-black mb-2">Educational</h3>
              <p className="text-black/80 text-sm">Learn safety concepts through play</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="font-black text-black mb-2">Family Fun</h3>
              <p className="text-black/80 text-sm">Perfect for family game nights</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-black text-black mb-2">Fast-Paced</h3>
              <p className="text-black/80 text-sm">Quick rounds keep everyone engaged</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-black text-black mb-2">Skill Building</h3>
              <p className="text-black/80 text-sm">Improves communication and thinking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}