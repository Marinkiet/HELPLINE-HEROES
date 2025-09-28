import React, { useState } from 'react';
import { FeelingSafeAtHomeLanding } from './FeelingSafeAtHomeLanding';
import { FeelingSafeAtHomeExploration } from './FeelingSafeAtHomeExploration';
import { FeelingSafeAtHomeScenarios } from './FeelingSafeAtHomeScenarios';

type GameStage = 'landing' | 'exploration' | 'scenarios' | 'complete';

interface FeelingSafeAtHomeGameContainerProps {
  onClose: () => void;
}

export function FeelingSafeAtHomeGameContainer({ onClose }: FeelingSafeAtHomeGameContainerProps) {
  const [currentStage, setCurrentStage] = useState<GameStage>('landing');

  const handleStageComplete = (nextStage: GameStage) => {
    setCurrentStage(nextStage);
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'landing':
        return (
          <FeelingSafeAtHomeLanding 
            onStartGame={() => handleStageComplete('exploration')}
          />
        );
      
      case 'exploration':
        return (
          <FeelingSafeAtHomeExploration
            onComplete={() => handleStageComplete('scenarios')}
          />
        );
      
      case 'scenarios':
        return (
          <FeelingSafeAtHomeScenarios
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