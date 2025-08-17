import React, { useState, useEffect } from 'react';
import { Phone, Shield, X, AlertTriangle } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { elevenLabsService } from '../services/elevenLabsService';

export function ReportBadTouchButton() {
  const { isNarrationEnabled, selectedLanguage } = useAudio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate audio when modal opens
  useEffect(() => {
    if (isModalOpen && isNarrationEnabled) {
      generateModalAudio();
    }
  }, [isModalOpen, selectedLanguage, isNarrationEnabled]);

  const generateModalAudio = async () => {
    try {
      const modalText = getModalText();
      console.log('🎵 Generating Report Bad Touch modal audio...');
      
      const url = await elevenLabsService.generateSpeech({
        language: selectedLanguage,
        text: modalText,
        voiceId: 'vGQNBgLaiM3EdZtxIiuY' // Child-friendly voice
      });
      
      setAudioUrl(url);
      
      // Auto-play the audio
      if (url) {
        const audio = new Audio(url);
        audio.addEventListener('play', () => setIsPlaying(true));
        audio.addEventListener('ended', () => setIsPlaying(false));
        audio.addEventListener('error', () => setIsPlaying(false));
        
        setTimeout(() => {
          audio.play().catch(error => {
            console.warn('Audio autoplay prevented:', error);
          });
        }, 500);
      }
    } catch (error) {
      console.error('Failed to generate modal audio:', error);
    }
  };

  const getModalText = () => {
    const texts = {
      en: "Hi there! If someone touched you in a way that made you feel scared or uncomfortable, you can call 116 to talk to a kind adult who will help you. Only call if you really need help. Don't call for fun.",
      af: "Hallo daar! As iemand jou geraak het op 'n manier wat jou bang of ongemaklik laat voel het, kan jy 116 bel om met 'n vriendelike volwassene te praat wat jou sal help. Bel net as jy regtig hulp nodig het. Moenie bel om speletjies te speel nie.",
      zu: "Sawubona! Uma umuntu ekuthinte ngendlela eyakwenza wazizwa wesaba noma ungakhululekile, ungashayela u-116 ukukhuluma nomuntu omdala onobubele ozokusiza. Shayela kuphela uma udinga usizo ngempela. Ungashayeli ukudlala imidlalo."
    };
    return texts[selectedLanguage];
  };

  const handleCall = () => {
    // Show additional confirmation before making the call
    const confirmed = window.confirm(
      '⚠️ IMPORTANT REMINDER ⚠️\n\n' +
      'You are about to call Childline (116).\n\n' +
      'This number is ONLY for children who:\n' +
      '• Feel unsafe or scared\n' +
      '• Have experienced bad touch\n' +
      '• Need help from a trusted adult\n\n' +
      'Calling for fun or games is wrong and stops other children from getting help.\n\n' +
      'Are you sure you need help right now?'
    );
    
    if (confirmed) {
      window.location.href = 'tel:116';
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Button */}
      <div
        className="relative flex items-center justify-center w-32 h-32 rounded-full bg-red-500 hover:bg-red-600 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-110 group animate-pulse hover:animate-none"
        onClick={() => setIsModalOpen(true)}
        aria-label="Report Bad Touch - Call for help"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsModalOpen(true);
          }
        }}
      >
        <Shield className="w-16 h-16 text-white" />
      </div>

      {/* Simplified Modal for Children */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl transform animate-bounce-in">
            {/* Close button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simplified content for children */}
            <div className="text-center mb-6">
              <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Phone className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-black text-gray-800 mb-3">Need Help? 🤗</h2>
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                If someone touched you in a way that made you feel scared or uncomfortable, you can call <strong>116</strong> to talk to a kind adult who will help you.
              </p>
            </div>

            {/* Simple warning */}
            <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="font-bold text-yellow-800 text-sm">Important!</span>
              </div>
              <p className="text-yellow-700 text-sm text-center">
                Only call if you really need help. Don't call to play games! 🚫
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleCall}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black py-3 px-4 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Call 116 - I Need Help</span>
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl transition-colors duration-200"
              >
                I'm OK - Go Back
              </button>
            </div>

            {/* Audio indicator */}
            {isPlaying && (
              <div className="text-center mt-3">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>🔊 Listening to help message</span>
                </div>
              </div>
            )}

            {/* Simple reassurance */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                You are brave and important! 💙
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}