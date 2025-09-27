import React, { useState } from 'react';
import { GameLanding } from './GameLanding';
import { BodyPartsExploration } from './BodyPartsExploration';
import { TouchScenarioGame } from './TouchScenarioGame';

type GameStage = 'landing' | 'exploration' | 'scenarios' | 'complete';

import { Game } from '../../data/games';

interface SafeTouchGameContainerProps {
  onClose: () => void;
  game: Game;
}

export function SafeTouchGameContainer({ onClose, game }: SafeTouchGameContainerProps) {
  const [currentStage, setCurrentStage] = useState<GameStage>('landing');

  const handleStageComplete = (nextStage: GameStage) => {
    setCurrentStage(nextStage);
  };

  const renderCurrentStage = () => {
    const welcomeSection = game.sections.find(s => s.section_type === 'welcome');
    const explorationSection = game.sections.find(s => s.section_type === 'exploration');
    const scenariosSection = game.sections.find(s => s.section_type === 'scenarios');

    switch (currentStage) {
      case 'landing':
        return (
          <GameLanding 
            onStartGame={() => handleStageComplete('exploration')}
            section={welcomeSection}
          />
        );
      
      case 'exploration':
        return (
          <BodyPartsExploration
            onComplete={() => handleStageComplete('scenarios')}
            section={explorationSection}
          />
        );
      
      case 'scenarios':
        return (
          <TouchScenarioGame
            onComplete={onClose}
            section={scenariosSection}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto">
      {renderCurrentStage()}
    </div>
  );
}