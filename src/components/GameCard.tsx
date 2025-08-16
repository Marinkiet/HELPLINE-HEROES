import React from 'react';
import { Star, Shield } from 'lucide-react';

interface GameCardProps {
  id: string;
  title: string;
  image: string;
  featured?: boolean;
  onClick: () => void;
}

export function GameCard({ id, title, image, featured = false, onClick }: GameCardProps) {
  return (
    <div 
      className={`
        relative bg-white rounded-2xl p-4 cursor-pointer transform transition-all duration-300 
        hover:scale-105 hover:shadow-xl active:scale-95
        ${featured ? 'ring-3 ring-yellow-400' : ''}
        min-h-[240px] group shadow-lg
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Learn about ${title}`}
    >
      {featured && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 border-2 border-white shadow-lg">
          <Shield className="w-5 h-5 text-purple-600" />
        </div>
      )}
      
      <div className="relative overflow-hidden rounded-xl mb-3 bg-gradient-to-br from-blue-100 to-purple-100">
        <img 
          src={image}
          alt={`${title} safety activity`}
          className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <h3 className="text-lg font-black text-gray-800 text-center leading-tight">
        {title}
      </h3>
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300" />
    </div>
  );
}