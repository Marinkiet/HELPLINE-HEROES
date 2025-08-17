import React from 'react';
import { useAudio } from '../contexts/AudioContext';
import { appContent } from '../data/appContent';
import { GameCard } from './GameCard';
import { Game } from '../data/games';

interface GameGridProps {
  games: Game[];
  onGameClick: (game: Game) => void;
  filteredCategory?: string;
}

export function GameGrid({ games, onGameClick, filteredCategory }: GameGridProps) {
  const { selectedLanguage } = useAudio();
  
  const filteredGames = filteredCategory 
    ? games.filter(game => game.category === filteredCategory)
    : games;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-3xl font-black text-white mb-6 text-center">
        {filteredCategory ? `${appContent.categories[filteredCategory as keyof typeof appContent.categories][selectedLanguage]} Activities` : appContent.gameGrid.allActivities[selectedLanguage]}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            title={game.title}
            description={game.description}
            image={game.image}
            featured={game.featured}
            onClick={() => onGameClick(game)}
          />
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {appContent.gameGrid.noActivities.title[selectedLanguage]}
          </h3>
          <p className="text-lg text-white/80">
            {appContent.gameGrid.noActivities.subtitle[selectedLanguage]}
          </p>
        </div>
      )}
    </div>
  );
}