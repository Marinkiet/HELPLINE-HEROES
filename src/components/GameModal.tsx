import React from 'react';
import { X, Play, Phone, Heart, ArrowLeft } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useEngagement } from '../contexts/EngagementContext';
import { appContent } from '../data/appContent';
import { Game } from '../data/games';
import { helplineNumbers } from '../data/games';
import { SafeTouchGameContainer } from './SafeTouchGame/SafeTouchGameContainer';
import { TrustedHeroesGameContainer } from './TrustedHeroesGame/TrustedHeroesGameContainer';
import { BraveVoiceGameContainer } from './BraveVoiceGame/BraveVoiceGameContainer';
import { HelpAFriendGameContainer } from './HelpAFriendGame/HelpAFriendGameContainer';
import { OnlineSafetyGameContainer } from './OnlineSafetyGame/OnlineSafetyGameContainer';
import { FeelingSafeGameContainer } from './FeelingSafeGame/FeelingSafeGameContainer';
import { BullyingResponseGameContainer } from './BullyingResponseGame/BullyingResponseGameContainer';
import { ReportItRightGameContainer } from './ReportItRightGame/ReportItRightGameContainer';
import hug from '../assets/hug.jpg';
import frontl from '../assets/frontl.png';
import shout from '../assets/shout.jpg';

interface GameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GameModal({ game, isOpen, onClose }: GameModalProps) {
  const { selectedLanguage } = useAudio();
  const { trackGameStart, trackInteraction } = useEngagement();
  const [showSafeTouchGame, setShowSafeTouchGame] = React.useState(false);
  const [showTrustedHeroesGame, setShowTrustedHeroesGame] = React.useState(false);
  const [showBraveVoiceGame, setShowBraveVoiceGame] = React.useState(false);
  const [showHelpAFriendGame, setShowHelpAFriendGame] = React.useState(false);
  const [showOnlineSafetyGame, setShowOnlineSafetyGame] = React.useState(false);
  const [showFeelingSafeGame, setShowFeelingSafeGame] = React.useState(false);
  const [showBullyingResponseGame, setShowBullyingResponseGame] = React.useState(false);
  const [showReportItRightGame, setShowReportItRightGame] = React.useState(false);
  
  if (!isOpen || !game) return null;

  // Get translated content
  const translatedTitle = typeof game.title === 'object' ? game.title[selectedLanguage] : game.title;
  const translatedDescription = typeof game.description === 'object' ? game.description[selectedLanguage] : game.description;

  // Get background image based on game ID to match card backgrounds
  const getModalImage = () => {
    switch (game.id) {
      case '1': // Safe Touch Detective
        return hug;
      case '2': // Trusted Heroes Circle
        return frontl;
      case '3': // Brave Voice
        return shout;
      default:
        return game.image; // Use original image for other games
    }
  };

  const modalImage = getModalImage();

  const handleStartLearning = () => {
    trackGameStart(game.id, translatedTitle);

    if (game.id === '1') {
      setShowSafeTouchGame(true);
    } else if (game.id === '2') {
      setShowTrustedHeroesGame(true);
    } else if (game.id === '3') {
      setShowBraveVoiceGame(true);
    } else if (game.id === '6') {
      setShowHelpAFriendGame(true);
    } else if (game.id === '7') {
      setShowOnlineSafetyGame(true);
    } else if (game.id === '9') {
      setShowFeelingSafeGame(true);
    } else if (game.id === '10') {
      setShowBullyingResponseGame(true);
    } else if (game.id === '12') {
      setShowReportItRightGame(true);
    } else {
      alert('This game is coming soon!');
      trackInteraction('coming_soon_game_click', {
        game_id: game.id,
        game_title: game.title[selectedLanguage]
      });
    }
  };

  // Handle Safe Touch Detective game specifically
  if (showSafeTouchGame && game.id === '1') {
    return (
      <SafeTouchGameContainer 
        onClose={() => {
          setShowSafeTouchGame(false);
          onClose();
        }}
      />
    );
  }

  // Handle Trusted Heroes Circle game specifically
  if (showTrustedHeroesGame && game.id === '2') {
    return (
      <TrustedHeroesGameContainer 
        onClose={() => {
          setShowTrustedHeroesGame(false);
          onClose();
        }}
      />
    );
  }

  // Handle Brave Voice game specifically
  if (showBraveVoiceGame && game.id === '3') {
    return (
      <BraveVoiceGameContainer
        onClose={() => {
          setShowBraveVoiceGame(false);
          onClose();
        }}
      />
    );
  }

  // Handle Help a Friend game
  if (showHelpAFriendGame && game.id === '6') {
    return (
      <HelpAFriendGameContainer
        onClose={() => {
          setShowHelpAFriendGame(false);
          onClose();
        }}
      />
    );
  }

  // Handle Online Safety Shield game
  if (showOnlineSafetyGame && game.id === '7') {
    return (
      <OnlineSafetyGameContainer
        onClose={() => {
          setShowOnlineSafetyGame(false);
          onClose();
        }}
      />
    );
  }

  // Handle Feeling Safe at Home game
  if (showFeelingSafeGame && game.id === '9') {
    return (
      <FeelingSafeGameContainer
        onClose={() => {
          setShowFeelingSafeGame(false);
          onClose();
        }}
      />
    );
  }

  // Handle Bullying Response Team game
  if (showBullyingResponseGame && game.id === '10') {
    return (
      <BullyingResponseGameContainer
        onClose={() => {
          setShowBullyingResponseGame(false);
          onClose();
        }}
      />
    );
  }

  // Handle Report It Right game
  if (showReportItRightGame && game.id === '12') {
    return (
      <ReportItRightGameContainer
        onClose={() => {
          setShowReportItRightGame(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl transform animate-bounce-in">
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 text-gray-600 hover:text-gray-800 font-bold p-3 rounded-full shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-gray-800">{translatedTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close game details"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
        
        <div className="mb-6">
          <img 
            src={modalImage}
            alt={`${translatedTitle} safety activity`}
            className="w-full h-48 object-cover rounded-2xl"
          />
        </div>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {translatedDescription}
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-xl">
          <div className="flex items-center mb-2">
            <Heart className="w-5 h-5 text-blue-500 mr-2" />
            <h4 className="font-bold text-blue-800">{appContent.safety.rememberSafe[selectedLanguage]}</h4>
          </div>
          <p className="text-blue-700 text-sm">
            {appContent.safety.helpMessage[selectedLanguage].replace('116', helplineNumbers.childline).replace('741741', helplineNumbers.textLine.split(' ').pop() || '741741')}
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={handleStartLearning}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 text-lg"
          >
            <Play className="w-6 h-6" />
            <span>{appContent.buttons.startLearning[selectedLanguage]}</span>
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl transition-colors duration-200 text-lg"
          >
            {appContent.buttons.backToActivities[selectedLanguage]}
          </button>
        </div>
      </div>
    </div>
  );
}