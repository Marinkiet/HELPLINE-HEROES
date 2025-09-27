import React from 'react';
import { Star, Shield, Heart, Users, ExternalLink } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { appContent } from '../data/appContent';
import { games } from '../data/games';
import shout from '../assets/shout.jpg';
import hug from '../assets/hug.jpg';
import frontl from '../assets/frontl.png';

interface FeaturedSectionProps {
  onGameClick: (gameId: string) => void;
  onCardGamesClick?: () => void;
}

export function FeaturedSection({ onGameClick, onCardGamesClick }: FeaturedSectionProps) {
  const { selectedLanguage } = useAudio();
  const featuredTitle = appContent.featured.title[selectedLanguage];
  
  // Get the first 3 games (which should always be the main games regardless of age filtering)
  const mainGames = games.filter(game => ['1', '2', '3'].includes(game.id));
  const featuredGames = mainGames.map((game, index) => {
    const icons = [
      <Shield className="w-16 h-16 text-white" />,
      <Heart className="w-16 h-16 text-white" />,
      <Users className="w-16 h-16 text-white" />
    ];
    
    const images = [
      hug, // Safe Touch Detective
      frontl, // Trusted Heroes Circle  
      shout  // Brave Voice
    ];
    
    return {
      id: game.id,
      title: typeof game.title === 'object' ? game.title.en : game.title, // Fallback for now
      subtitle: typeof game.description === 'object' ? game.description.en : game.description, // Fallback for now
      icon: icons[index],
      image: images[index],
      onClick: () => onGameClick(game.id)
    };
  });

  const handleCardGamesClick = () => {
    if (onCardGamesClick) {
      onCardGamesClick();
    }
  };

  return (
    <div className=" rounded-3xl p-8 my-10 shadow-2xl ">
      <div className="flex items-center mb-6">
        <Star className="w-8 h-8 text-yellow-300 mr-3" />
        <h2 className="text-3xl font-black text-white">{featuredTitle}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredGames.map((game) => (
          <div
          key={game.id}
          onClick={game.onClick}
          className={`rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl group`}
          style={{
            backgroundImage: game.image
              ? `url(${game.image})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 h-full flex flex-col justify-center">
              <div className="text-center">
                <div className="mb-4 flex justify-center group-hover:animate-bounce">
                  {game.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-2">
                  {game.title}
                </h3>
                <p className="text-white/90 font-semibold">
                  {game.subtitle}
                </p>
                <div className="mt-4 bg-white/30 hover:bg-white/40 rounded-full px-4 py-2 inline-block transition-colors duration-200">
                  <span className="text-white font-bold text-sm">PLAY</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 30 Seconds Card Games Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleCardGamesClick}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-3 mx-auto text-lg"
        >
          <ExternalLink className="w-6 h-6" />
          <span>Card Games</span>
        </button>
        <p className="text-white/80 text-sm mt-2 font-semibold">
          Fun card games with similar educational content
        </p>
      </div>
    </div>
  );
}