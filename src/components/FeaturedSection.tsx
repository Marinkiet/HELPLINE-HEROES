import React from 'react';
import { Star, Shield, Heart, Users } from 'lucide-react';
import kidsbg from '../assets/kidsbg.jpg';
interface FeaturedGame {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  // color: string;
  image?: string;
  to: string;
  from: string;
  onClick: () => void;
}

interface FeaturedSectionProps {
  onGameClick: (gameId: string) => void;
}

export function FeaturedSection({ onGameClick }: FeaturedSectionProps) {
  const featuredGames: FeaturedGame[] = [
      {
        id: 'safe-touch',
        title: 'Safe Touch Detective',
        subtitle: 'Learn about body safety',
        icon: <Shield className="w-16 h-16 text-white" />,
        from: 'from-green-100/50',
        to: 'to-green-600/50',
        image: kidsbg,
        onClick: () => onGameClick('1')
      },
      {
        id: 'trusted-adults',
        title: 'Trusted Heroes Circle',
        subtitle: 'Find your support team',
        icon: <Heart className="w-16 h-16 text-white" />,
        from: 'from-pink-100/50',
        to: 'to-pink-600/50',
        image: kidsbg,
        onClick: () => onGameClick('2')
      },
      {
        id: 'speak-up',
        title: 'Brave Voice Academy',
        subtitle: 'Practice speaking up',
        icon: <Users className="w-16 h-16 text-white" />,
        from: 'from-purple-500/50',
        to: 'to-purple-600/50',
        image: kidsbg,
        onClick: () => onGameClick('3')
      }
    ];
    

  return (
    <div className=" rounded-3xl p-8 my-10 shadow-2xl ">
      <div className="flex items-center mb-6">
        <Star className="w-8 h-8 text-yellow-300 mr-3" />
        <h2 className="text-3xl font-black text-white">Featured Safety Adventures</h2>
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
              : `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            // Only apply gradient stops if no image
            ...( !game.image && {
              '--tw-gradient-from': `rgb(${game.from}) / 0.5`,
              '--tw-gradient-to': `rgb(${game.to}) / 0.5`
            })
          }}
        >
            <div className="text-center">
              <div className="mb-4 flex justify-center group-hover:animate-bounce">
                {game.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-2">{game.title}</h3>
              <p className="text-white/90 font-semibold">{game.subtitle}</p>
              <div className="mt-4 bg-white/20 rounded-full px-4 py-2 inline-block">
                <span className="text-white font-bold text-sm">PLAY NOW</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}