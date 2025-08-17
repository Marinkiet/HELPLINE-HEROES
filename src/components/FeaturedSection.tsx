import React from 'react';
import { Star, Shield, Heart, Users } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { appContent } from '../data/appContent';
import { games } from '../data/games';
import shout from '../assets/shout.jpg';
interface FeaturedSectionProps {
  onGameClick: (gameId: string) => void;
}

export function FeaturedSection({ onGameClick }: FeaturedSectionProps) {
  const { selectedLanguage } = useAudio();
  
  // Get the first 3 games and their translated content
  const featuredGames = games.slice(0, 3).map((game, index) => {
    const icons = [
      <Shield className="w-16 h-16 text-white" />,
      <Heart className="w-16 h-16 text-white" />,
      <Users className="w-16 h-16 text-white" />
    ];
    
    return {
      id: game.id,
      title: game.title[selectedLanguage],
      subtitle: game.description[selectedLanguage],
      icon: icons[index],
      image: shout,
      onClick: () => onGameClick(game.id)
    };
  });

  return (
    <div className=" rounded-3xl p-8 my-10 shadow-2xl ">
      <div className="flex items-center mb-6">
        <Star className="w-8 h-8 text-yellow-300 mr-3" />
        <h2 className="text-3xl font-black text-white">{appContent.featured.title[selectedLanguage]}</h2>
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
              <div className="mt-4 bg-white/20 rounded-full px-4 py-2 inline-block">
                <span className="text-white font-bold text-sm">PLAY</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}