import React, { useState } from 'react';
import { BraveVoiceLanding } from './BraveVoiceLanding';
import { BraveVoiceExploration } from './BraveVoiceExploration';
import { BraveVoiceScenarios } from './BraveVoiceScenarios';

type GameStage = 'landing' | 'exploration' | 'scenarios' | 'complete';

interface BraveVoiceGameContainerProps {
  onClose: () => void;
}

export function BraveVoiceGameContainer({ onClose }: BraveVoiceGameContainerProps) {
  const [currentStage, setCurrentStage] = useState<GameStage>('landing');

  const handleStageComplete = (nextStage: GameStage) => {
    setCurrentStage(nextStage);
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'landing':
        return (
          <BraveVoiceLanding 
            onStartGame={() => handleStageComplete('exploration')}
          />
        );
      
      case 'exploration':
        return (
          <BraveVoiceExploration
            onComplete={() => handleStageComplete('scenarios')}
          />
        );
      
      case 'scenarios':
        return (
          <BraveVoiceScenarios
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