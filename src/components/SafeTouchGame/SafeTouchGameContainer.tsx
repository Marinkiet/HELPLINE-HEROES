import React, { useState } from 'react';
import { GameLanding } from './GameLanding';
import { BodyPartsExploration } from './BodyPartsExploration';
import { TouchScenarioGame } from './TouchScenarioGame';

type GameStage = 'landing' | 'exploration' | 'scenarios' | 'complete';

interface SafeTouchGameContainerProps {
  onClose: () => void;
}

export function SafeTouchGameContainer({ onClose }: SafeTouchGameContainerProps) {
  const [currentStage, setCurrentStage] = useState<GameStage>('landing');

  const handleStageComplete = (nextStage: GameStage) => {
    setCurrentStage(nextStage);
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'landing':
        return (
          <GameLanding 
            onStartGame={() => handleStageComplete('exploration')}
          />
        );
      
      case 'exploration':
        return (
          <BodyPartsExploration
            onComplete={() => handleStageComplete('scenarios')}
          />
        );
      
      case 'scenarios':
        return (
          <TouchScenarioGame
            onComplete={onClose}
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