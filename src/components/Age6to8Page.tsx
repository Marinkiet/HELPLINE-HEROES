import React, { useState } from 'react';
import { GameGrid } from './GameGrid';
import { GameModal } from './GameModal';
import { VideoUploadModal } from './VideoUploadModal';
import { FeaturedSection } from './FeaturedSection';
import { CategoryCards } from './CategoryCards';
import { games } from '../data/games';
import { Game } from '../types/audio';
import { ReportBadTouchButton } from './ReportBadTouchButton';
import { AdultReportButton } from './AdultReportButton';

interface Age6to8PageProps {
  onBackToAgeSelection: () => void;
  onCommunitySafetyClick: () => void;
}

export function Age6to8Page({ onBackToAgeSelection, onCommunitySafetyClick }: Age6to8PageProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoGameId, setSelectedVideoGameId] = useState<number | null>(null);

  // Filter games for early age group (6-8)
  const ageAppropriateGames = games.filter(game => game.ageGroup === 'early');
  
  // Filter games based on category and search
  const filteredGames = ageAppropriateGames.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGameClick = (game: Game) => {
    // Show video modal for main games (IDs 1, 2, 3)
    if ([1, 2, 3].includes(game.id)) {
      setSelectedVideoGameId(game.id);
      setShowVideoModal(true);
    } else {
      setSelectedGame(game);
    }
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideoGameId(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBackToAgeSelection}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Age Selection</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Little Heroes (6-8 years)</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Section */}
        <FeaturedSection 
          games={ageAppropriateGames.slice(0, 3)} 
          onGameClick={handleGameClick}
        />

        {/* Category Cards */}
        <CategoryCards 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />

        {/* Games Grid */}
        <GameGrid 
          games={filteredGames}
          onGameClick={handleGameClick}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <ReportBadTouchButton />
          <AdultReportButton onClick={onCommunitySafetyClick} />
        </div>
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <GameModal 
          game={selectedGame} 
          onClose={handleCloseModal}
        />
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideoGameId && (
        <VideoUploadModal 
          gameId={selectedVideoGameId}
          onClose={handleCloseVideoModal}
        />
      )}
    </div>
  );
}