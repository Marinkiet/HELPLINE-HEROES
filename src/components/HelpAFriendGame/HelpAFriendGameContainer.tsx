import { useState } from 'react';
import { HelpAFriendLanding } from './HelpAFriendLanding';
import { FriendSituationsExploration } from './FriendSituationsExploration';
import { HelpingScenarios } from './HelpingScenarios';

type GameStage = 'landing' | 'exploration' | 'scenarios' | 'complete';

interface HelpAFriendGameContainerProps {
  onClose: () => void;
}

export function HelpAFriendGameContainer({ onClose }: HelpAFriendGameContainerProps) {
  const [currentStage, setCurrentStage] = useState<GameStage>('landing');

  const handleStageComplete = (nextStage: GameStage) => {
    setCurrentStage(nextStage);
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'landing':
        return (
          <HelpAFriendLanding
            onStartGame={() => handleStageComplete('exploration')}
          />
        );

      case 'exploration':
        return (
          <FriendSituationsExploration
            onComplete={() => handleStageComplete('scenarios')}
          />
        );

      case 'scenarios':
        return (
          <HelpingScenarios
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
