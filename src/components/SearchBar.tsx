import React from 'react';
import { Search, Shuffle } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSurpriseMe: () => void;
}

export function SearchBar({ searchQuery, onSearchChange, onSurpriseMe }: SearchBarProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for safety activities..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-lg font-semibold rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-200 placeholder-gray-400"
            aria-label="Search safety activities"
          />
        </div>
        
        <button
          onClick={onSurpriseMe}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-purple-800 font-black px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
          aria-label="Pick a random safety activity"
        >
          <Shuffle className="w-5 h-5" />
          <span>Learn Something New!</span>
        </button>
      </div>
    </div>
  );
}