import React from 'react';
import { X, Play, Phone, Heart } from 'lucide-react';
import { Game } from '../data/games';
import { helplineNumbers } from '../data/games';

interface GameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GameModal({ game, isOpen, onClose }: GameModalProps) {
  if (!isOpen || !game) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl transform animate-bounce-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-gray-800">{game.title}</h2>
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
            src={game.image}
            alt={`${game.title} safety activity`}
            className="w-full h-48 object-cover rounded-2xl"
          />
        </div>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {game.description}
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-xl">
          <div className="flex items-center mb-2">
            <Heart className="w-5 h-5 text-blue-500 mr-2" />
            <h4 className="font-bold text-blue-800">Remember: You're Safe Here</h4>
          </div>
          <p className="text-blue-700 text-sm">
            If you ever need help, call <strong>{helplineNumbers.childline}</strong> or text <strong>{helplineNumbers.textLine}</strong>
          </p>
        </div>
        
        <div className="flex gap-4">
          <button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 text-lg">
            <Play className="w-6 h-6" />
            <span>Start Learning!</span>
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl transition-colors duration-200 text-lg"
          >
            Back to Activities
          </button>
        </div>
      </div>
    </div>
  );
}