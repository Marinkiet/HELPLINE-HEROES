import React, { useState } from 'react';
import { TrustedHeroesLanding } from './TrustedHeroesLanding';
import { TrustedAdultsExploration } from './TrustedAdultsExploration';
import { TrustedAdultsScenario } from './TrustedAdultsScenario';
import { Game } from '../../data/games';

type GameStage = 'landing' | 'exploration' | 'scenarios' | 'complete';

interface TrustedHeroesGameContainerProps {
  onClose: () => void;
  game: Game;
}

export function TrustedHeroesGameContainer({ onClose, game }: TrustedHeroesGameContainerProps) {
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
          <TrustedHeroesLanding 
            onStartGame={() => handleStageComplete('exploration')}
            section={welcomeSection}
          />
        );
      
      case 'exploration':
        return (
          <TrustedAdultsExploration
            onComplete={() => handleStageComplete('scenarios')}
            section={explorationSection}
          />
        );
      
      case 'scenarios':
        return (
          <TrustedAdultsScenario
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