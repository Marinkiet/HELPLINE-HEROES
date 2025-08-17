import React from 'react';
import { Star, Shield } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { elevenLabsService } from '../services/elevenLabsService';
import { Game } from '../data/games';
import hug from '../assets/hug.jpg';
import frontl from '../assets/frontl.png';
import shout from '../assets/shout.jpg';

interface GameCardProps extends Omit<Game, 'ageGroup' | 'category'> {
  image: string;
  featured?: boolean;
  onClick: () => void;
}

export function GameCard({ id, title, description, image, featured = false, onClick }: GameCardProps) {
  const { isNarrationEnabled, selectedLanguage } = useAudio();
  const [isPlayingNarration, setIsPlayingNarration] = React.useState(false);

  // Get translated content
  const translatedTitle = typeof title === 'object' ? title[selectedLanguage] : title;
  const translatedDescription = typeof description === 'object' ? description[selectedLanguage] : description;

  // Check if game has content available
  const hasContent = ['1', '2', '3'].includes(id); // Only Safe Touch Detective, Trusted Heroes, Brave Voice

  // Get background image based on game ID
  const getBackgroundImage = () => {
    switch (id) {
      case '1': // Safe Touch Detective
        return hug;
      case '2': // Trusted Heroes Circle
        return frontl;
      case '3': // Brave Voice
        return shout;
      default:
        return null; // No image for other games, use background color instead
    }
  };

  // Get background color for games without content
  const getBackgroundColor = () => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple-blue
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink-red
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue-cyan
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green-teal
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Pink-yellow
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Teal-pink
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', // Coral-pink
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // Peach-orange
      'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', // Purple-pink
    ];
    
    // Use game ID to consistently assign colors
    const colorIndex = parseInt(id) % colors.length;
    return colors[colorIndex];
  };

  const backgroundImage = getBackgroundImage();
  const backgroundColor = getBackgroundColor();

  const handleCardClick = async () => {
    // Don't allow clicking on games without content
    if (!hasContent) {
      return;
    }

    // Play narration if enabled
    if (isNarrationEnabled) {
      try {
        setIsPlayingNarration(true);
        const narrationText = `${translatedTitle}. ${translatedDescription}`;
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
        ${hasContent ? 'hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer' : 'cursor-not-allowed opacity-75'}
        ${featured ? 'ring-3 ring-yellow-400' : ''} 
        ${isPlayingNarration ? 'ring-3 ring-blue-400 animate-pulse' : ''}
        min-h-[240px] group shadow-lg
      `}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && hasContent && handleCardClick()}
      aria-label={`Learn about ${translatedTitle}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        background: backgroundImage ? undefined : backgroundColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {isPlayingNarration && (
        <div className="absolute -top-2 -left-2 bg-blue-500 rounded-full p-2 border-2 border-white shadow-lg animate-bounce">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
        </div>
      )}
      
      {/* Semi-transparent overlay for content */}
      <div className={`${backgroundImage ? 'bg-black/40 backdrop-blur-sm' : 'bg-black/20'} rounded-xl p-4 h-full flex flex-col justify-center`}>
        <div className="text-center">
          <h3 className="text-lg font-black text-white text-center leading-tight mb-2">
            {translatedTitle}
          </h3>
          <p className="text-white/90 text-sm font-semibold">
            {translatedDescription}
          </p>
          <div className={`mt-3 rounded-full px-3 py-1 inline-block transition-colors duration-200 ${
            hasContent 
              ? 'bg-white/30 hover:bg-white/40' 
              : 'bg-gray-500/50 text-gray-300'
          }`}>
            <span className="text-white font-bold text-xs">{hasContent ? 'LEARN' : 'COMING SOON'}</span>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300" />
    </div>
  );
}