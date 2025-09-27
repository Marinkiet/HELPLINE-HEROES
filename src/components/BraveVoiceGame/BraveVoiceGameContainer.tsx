import React, { useState } from 'react';
import { BraveVoiceLanding } from './BraveVoiceLanding';
import { BraveVoiceExploration } from './BraveVoiceExploration';
import { BraveVoiceScenarios } from './BraveVoiceScenarios';

type GameStage = 'landing' | 'exploration' | 'scenarios' | 'complete';

import { Game } from '../../data/games';

interface BraveVoiceGameContainerProps {
  onClose: () => void;
  game: Game;
}

export function BraveVoiceGameContainer({ onClose, game }: BraveVoiceGameContainerProps) {
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
          <BraveVoiceLanding 
            onStartGame={() => handleStageComplete('exploration')}
            section={welcomeSection}
          />
        );
      
      case 'exploration':
        return (
          <BraveVoiceExploration
            onComplete={() => handleStageComplete('scenarios')}
            section={explorationSection}
          />
        );
      
      case 'scenarios':
        return (
          <BraveVoiceScenarios
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