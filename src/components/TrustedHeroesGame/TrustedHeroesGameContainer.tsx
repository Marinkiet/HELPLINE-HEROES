import React, { useState } from 'react';
import { TrustedHeroesLanding } from './TrustedHeroesLanding';
import { TrustedAdultsExploration } from './TrustedAdultsExploration';
import { TrustedAdultsScenario } from './TrustedAdultsScenario';

type GameStage = 'landing' | 'exploration' | 'scenarios' | 'complete';

interface TrustedHeroesGameContainerProps {
  onClose: () => void;
}

export function TrustedHeroesGameContainer({ onClose }: TrustedHeroesGameContainerProps) {
  const [currentStage, setCurrentStage] = useState<GameStage>('landing');

  const handleStageComplete = (nextStage: GameStage) => {
    setCurrentStage(nextStage);
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'landing':
        return (
          <TrustedHeroesLanding 
            onStartGame={() => handleStageComplete('exploration')}
          />
        );
      
      case 'exploration':
        return (
          <TrustedAdultsExploration
            onComplete={() => handleStageComplete('scenarios')}
          />
        );
      
      case 'scenarios':
        return (
          <TrustedAdultsScenario
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