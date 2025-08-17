import React from 'react';
import { Users } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { appContent } from '../data/appContent';

interface AdultReportButtonProps {
  onClick: () => void;
}

export function AdultReportButton({ onClick }: AdultReportButtonProps) {
  const { selectedLanguage } = useAudio();

  // Get translated button text and split into lines
  const buttonText = appContent.safety.adultReportButton[selectedLanguage];
  const textLines = buttonText.split('\n');

  return (
    <div
      className="relative flex items-center justify-center w-32 h-32 rounded-lg bg-orange-500 hover:bg-orange-600 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-110 group"
      onClick={onClick}
      aria-label={`${buttonText.replace(/\n/g, ' ')} - For grown-ups only`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="text-center">
        <Users className="w-12 h-12 text-white mx-auto mb-2" />
        <div className="text-white font-bold text-xs leading-tight">
          {textLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}