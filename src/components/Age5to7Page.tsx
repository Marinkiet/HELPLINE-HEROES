import React, { useState, useMemo } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { Navigation } from './Navigation';
import { FeaturedSection } from './FeaturedSection';
import { CategoryCards } from './CategoryCards';
import { GameGrid } from './GameGrid';
import { SearchBar } from './SearchBar';
import { GameModal } from './GameModal';
import { VideoUploadModal } from './VideoUploadModal';
import { games, Game } from '../data/games';
import { appContent } from '../data/appContent';
import kidsbg from '../assets/kidsbg.jpg';
import { ReportBadTouchButton } from './ReportBadTouchButton';
import { AdultReportButton } from './AdultReportButton';

interface Age5to7PageProps {
  onBackToAgeSelection: () => void;
  onCommunitySafetyClick: () => void;
}

export function Age5to7Page({ onBackToAgeSelection, onCommunitySafetyClick }: Age5to7PageProps) {
  const { selectedLanguage } = useAudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoGame, setCurrentVideoGame] = useState<string>('');

  // Filter games for 6-8 age group (early)
  const filteredGames = useMemo(() => {
    let filtered = games.filter(game => game.ageGroup === 'early');
    
    if (selectedCategory) {
      filtered = filtered.filter(game => game.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(game => 
        game.title[selectedLanguage].toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description[selectedLanguage].toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchQuery, selectedCategory, selectedLanguage]);

  const handleGameClick = (game: Game) => {
    // Check if it's one of the main games (Safe Touch Detective, Trusted Heroes Circle, Brave Voice)
    if (['1', '2', '3'].includes(game.id)) {
      setCurrentVideoGame(game.id);
      setIsVideoModalOpen(true);
    } else {
      setSelectedGame(game);
      setIsModalOpen(true);
    }
  };

  const handleGameClickById = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      handleGameClick(game);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? '' : category);
  };

  const handleSurpriseMe = () => {
    const ageAppropriateGames = games.filter(game => game.ageGroup === 'early');
    const randomGame = ageAppropriateGames[Math.floor(Math.random() * ageAppropriateGames.length)];
    handleGameClick(randomGame);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoGame('');
  };

  // Get game title for video modal
  const getVideoGameTitle = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    return game ? game.title[selectedLanguage] : '';
  };
  return (
    <div className="min-h-screen bg-yellow-300">
      <div className="relative z-10">
        <Navigation onBackToAgeSelection={onBackToAgeSelection} />
        <div className="w-full"
        style={{
                backgroundImage: `url(${kidsbg})`, 
                backgroundSize: 'cover',}}> 
            <div className="text-center py-8">
              {/* Hero text and button container */}
              <div className="flex flex-col items-center justify-center mb-6">
                {/* Main heading and button row */}
                <div className="flex items-center justify-between w-full max-w-4xl px-8 mb-4">
                  <AdultReportButton onClick={onCommunitySafetyClick} />
                  <h1 className="text-4xl md:text-6xl font-black text-purple-800 leading-tight">
                    {appContent.hero.title[selectedLanguage].split(' ').slice(0, 3).join(' ')}
                    <br />
                    {appContent.hero.title[selectedLanguage].split(' ').slice(3).join(' ')}
                  </h1>
                  <ReportBadTouchButton />
                </div>
                <p className="text-xl md:text-2xl text-purple-700 font-bold max-w-2xl mx-auto">
                   {appContent.hero.subtitle[selectedLanguage]}
                </p>
              </div>
            </div>
            <div className="mx-10"><FeaturedSection onGameClick={handleGameClickById} /></div>
          </div>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CategoryCards onCategoryClick={handleCategoryClick} />

          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSurpriseMe={handleSurpriseMe}
          />

          <GameGrid 
            games={filteredGames}
            onGameClick={handleGameClick}
            filteredCategory={selectedCategory}
          />
        </main>

        <GameModal 
          game={selectedGame}
          isOpen={isModalOpen}
          onClose={closeModal}
        />

        <VideoUploadModal 
          isOpen={isVideoModalOpen}
          onClose={closeVideoModal}
          gameTitle={getVideoGameTitle(currentVideoGame)}
          gameId={currentVideoGame}
        />
      </div>
    </div>
  );
}