import React from 'react';
import { Shield, Volume2, VolumeX, Globe } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { LANGUAGES } from '../types/audio';

export function Navigation() {
  const { isNarrationEnabled, toggleNarration, selectedLanguage, setSelectedLanguage } = useAudio();

  return (
    <nav className="bg-blue-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Helpline Heroes
            </h1>
          </div>

          {/* Narration Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-md">
              <Globe className="w-4 h-4 text-blue-600" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'af' | 'zu')}
                className="bg-transparent border-none outline-none font-semibold text-gray-700 cursor-pointer text-sm"
                aria-label="Select language"
              >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Narration Toggle */}
            <button
              onClick={toggleNarration}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-bold transition-all duration-200 text-sm ${
                isNarrationEnabled
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              aria-label={`Turn narration ${isNarrationEnabled ? 'off' : 'on'}`}
            >
              {isNarrationEnabled ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>OFF</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Narration Controls */}
        <div className="md:hidden pb-3">
          <div className="flex items-center justify-center space-x-4">
            {/* Mobile Language Selector */}
            <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-md">
              <Globe className="w-4 h-4 text-blue-600" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'af' | 'zu')}
                className="bg-transparent border-none outline-none font-semibold text-gray-700 cursor-pointer text-sm"
                aria-label="Select language"
              >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Narration Toggle */}
            <button
              onClick={toggleNarration}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-bold transition-all duration-200 text-sm ${
                isNarrationEnabled
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              aria-label={`Turn narration ${isNarrationEnabled ? 'off' : 'on'}`}
            >
              {isNarrationEnabled ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Narration ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Narration OFF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}