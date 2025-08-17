import React, { useState, useEffect } from 'react';
import { Mic, Play } from 'lucide-react';
import { AudioPlayer } from '../AudioPlayer';
import { useAudio } from '../../contexts/AudioContext';
import { braveVoiceContent } from '../../data/braveVoiceContent';
import { elevenLabsService } from '../../services/elevenLabsService';

interface BraveVoiceLandingProps {
  onStartGame: () => void;
}

export function BraveVoiceLanding({ onStartGame }: BraveVoiceLandingProps) {
  const { isNarrationEnabled, selectedLanguage } = useAudio();
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [micsClicked, setMicsClicked] = useState<boolean[]>([false, false, false]);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [micClickAudio, setMicClickAudio] = useState<string>('');
  const [playingMicSound, setPlayingMicSound] = useState(false);

  useEffect(() => {
    // Generate audio for welcome message
    const generateAudio = async () => {
      try {
        console.log('Generating welcome audio for Brave Voice:', selectedLanguage);
        const url = await elevenLabsService.generateSpeech({
          language: selectedLanguage,
          text: braveVoiceContent.welcome[selectedLanguage],
          voiceId: 'vGQNBgLaiM3EdZtxIiuY' // Child voice - friendly narrator
        });
        console.log('Brave Voice audio URL generated:', url ? 'Success' : 'Failed');
        setAudioUrl(url);
      } catch (error) {
        console.error('Failed to generate Brave Voice audio:', error);
      }
    };
    
    generateAudio();
  }, [selectedLanguage]);

  useEffect(() => {
    // Pre-generate mic click sound effect
    const generateMicSound = async () => {
      try {
        console.log('🎤 Pre-generating mic click sound...');
        const micSound = await elevenLabsService.generateStarClickSound(); // Reuse the magical sound
        setMicClickAudio(micSound);
        console.log('✅ Mic click sound ready!');
      } catch (error) {
        console.error('❌ Failed to generate mic sound:', error);
      }
    };
    
    generateMicSound();
  }, []);

  const playMicClickSound = async () => {
    if (!micClickAudio || !isNarrationEnabled) return;
    
    try {
      console.log('🔊 Playing mic click sound...');
      const audio = new Audio(micClickAudio);
      audio.volume = 0.7; // Slightly quieter than narration
      
      audio.addEventListener('play', () => setPlayingMicSound(true));
      audio.addEventListener('ended', () => setPlayingMicSound(false));
      audio.addEventListener('error', (e) => {
        console.error('❌ Mic sound playback error:', e);
        setPlayingMicSound(false);
      });
      
      await audio.play();
    } catch (error) {
      console.error('❌ Failed to play mic sound:', error);
      setPlayingMicSound(false);
    }
  };

  const handleMicClick = (index: number) => {
    // Play mic click sound effect
    playMicClickSound();
    
    const newMicsClicked = [...micsClicked];
    newMicsClicked[index] = true;
    setMicsClicked(newMicsClicked);

    // Check if all mics are clicked
    if (newMicsClicked.every(clicked => clicked)) {
      setTimeout(() => setShowPlayButton(true), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl text-center">
        {/* Game Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-800 mb-4">
            🎤 Brave Voice Training 🎤
          </h1>
          <div className="bg-blue-100 border-l-4 border-blue-400 p-4 rounded-r-xl">
            <p className="text-lg text-gray-700 leading-relaxed">
              {braveVoiceContent.welcome[selectedLanguage]}
            </p>
          </div>
        </div>

        {/* Audio Player */}
        <div className="flex justify-center mb-8">
          <AudioPlayer
            audioUrl={audioUrl}
            isPlaying={isPlaying}
            onPlayStateChange={setIsPlaying}
            autoPlay={true}
          />
        </div>

        {/* Interactive Microphones */}
        <div className="mb-8">
          <p className="text-xl font-bold text-gray-700 mb-6">
            Click on the 3 blue microphones to enter:
          </p>
          <div className="flex justify-center space-x-8">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => handleMicClick(index)}
                disabled={micsClicked[index]}
                className={`transform transition-all duration-300 ${
                  micsClicked[index] 
                    ? 'scale-125 animate-pulse' 
                    : 'hover:scale-110 hover:rotate-12'
                } ${playingMicSound ? 'animate-bounce' : ''}`}
                aria-label={`Click microphone ${index + 1}`}
              >
                <Mic 
                  className={`w-16 h-16 ${
                    micsClicked[index] 
                      ? 'text-indigo-400 fill-indigo-400' 
                      : 'text-blue-500 fill-blue-500 hover:text-blue-600'
                  }`}
                />
              </button>
            ))}
          </div>
          
          {/* Audio feedback indicator */}
          {playingMicSound && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>🎤 Mic Sound Playing</span>
              </div>
            </div>
          )}
        </div>

        {/* Play Button */}
        {showPlayButton && (
          <div className="animate-bounce-in">
            <button
              onClick={onStartGame}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-black py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-3 mx-auto text-xl"
            >
              <Play className="w-6 h-6" />
              <span>Start Brave Voice Training!</span>
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center space-x-2">
          {micsClicked.map((clicked, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                clicked ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}