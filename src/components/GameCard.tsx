import React from 'react';
import { Star, Shield } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { elevenLabsService } from '../services/elevenLabsService';

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  featured?: boolean;
  onClick: () => void;
}

export function GameCard({ id, title, description, image, featured = false, onClick }: GameCardProps) {
  const { isNarrationEnabled, selectedLanguage } = useAudio();
  const [isPlayingNarration, setIsPlayingNarration] = React.useState(false);

  const handleCardClick = async () => {
    // Play narration if enabled
    if (isNarrationEnabled) {
      try {
        setIsPlayingNarration(true);
        const narrationText = `${title}. ${description}`;
        console.log('🎵 Playing card narration:', narrationText.substring(0, 50) + '...');
        
        const audioUrl = await elevenLabsService.generateSpeech({
          language: selectedLanguage,
          text: narrationText,
          voiceId: 'vGQNBgLaiM3EdZtxIiuY'
        });
        
        if (audioUrl) {
          const audio = new Audio(audioUrl);
          audio.addEventListener('ended', () => setIsPlayingNarration(false));
          audio.addEventListener('error', () => setIsPlayingNarration(false));
          await audio.play();
        }
      } catch (error) {
        console.error('❌ Failed to play card narration:', error);
        setIsPlayingNarration(false);
      }
    }
    
    // Execute the original onClick after a short delay to let narration start
    setTimeout(() => onClick(), isNarrationEnabled ? 500 : 0);
  };

  return (
    <div 
      className={`
        relative bg-white rounded-2xl p-4 cursor-pointer transform transition-all duration-300 
        hover:scale-105 hover:shadow-xl active:scale-95
        ${featured ? 'ring-3 ring-yellow-400' : ''} 
        ${isPlayingNarration ? 'ring-3 ring-blue-400 animate-pulse' : ''}
        min-h-[240px] group shadow-lg
      `}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      aria-label={`Learn about ${title}`}
    >
      {isPlayingNarration && (
        <div className="absolute -top-2 -left-2 bg-blue-500 rounded-full p-2 border-2 border-white shadow-lg animate-bounce">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
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