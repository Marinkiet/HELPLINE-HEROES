import React from 'react';
import { Globe } from 'lucide-react';
import { LANGUAGES } from '../types/audio';

interface LanguageSelectorProps {
  selectedLanguage: 'en' | 'af' | 'zu' | 'xh' | 'st' | 'tn' | 'ts' | 've' | 'nr' | 'nso';
  onLanguageChange: (language: 'en' | 'af' | 'zu' | 'xh' | 'st' | 'tn' | 'ts' | 've' | 'nr' | 'nso') => void;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-md">
      <Globe className="w-5 h-5 text-blue-600" />
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value as 'en' | 'af' | 'zu' | 'xh' | 'st' | 'tn' | 'ts' | 've' | 'nr' | 'nso')}
        className="bg-transparent border-none outline-none font-semibold text-gray-700 cursor-pointer"
        aria-label="Select language"
      >
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}