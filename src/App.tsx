import React, { useState, useMemo } from 'react';
import { AudioProvider } from './contexts/AudioContext';
import { Navigation } from './components/Navigation';
import { CommunitySafetyModal } from './components/CommunitySafetyModal';
import { PhoneVerificationModal } from './components/PhoneVerificationModal';
import { FeaturedSection } from './components/FeaturedSection';
import { CategoryCards } from './components/CategoryCards';
import { GameGrid } from './components/GameGrid';
import { SearchBar } from './components/SearchBar';
import { GameModal } from './components/GameModal';
import { games, Game } from './data/games';
import kidsbg from './assets/kidsbg.jpg';
import { ReportBadTouchButton } from './components/ReportBadTouchButton';
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommunitySafetyOpen, setIsCommunitySafetyOpen] = useState(false);
  const [isPhoneVerificationOpen, setIsPhoneVerificationOpen] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const filteredGames = useMemo(() => {
    let filtered = games;
    
    if (selectedCategory) {
      filtered = filtered.filter(game => game.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(game => 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
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
    const randomGame = games[Math.floor(Math.random() * games.length)];
    handleGameClick(randomGame);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const handleCommunitySafetyClick = () => {
    if (isPhoneVerified) {
      setIsCommunitySafetyOpen(true);
    } else {
      setIsPhoneVerificationOpen(true);
    }
  };

  const closeCommunitySafety = () => {
    setIsCommunitySafetyOpen(false);
  };

  const closePhoneVerification = () => {
    setIsPhoneVerificationOpen(false);
  };

  const handlePhoneVerified = () => {
    setIsPhoneVerified(true);
    setIsPhoneVerificationOpen(false);
    setIsCommunitySafetyOpen(true);
  };

  return (
    <AudioProvider>
      <div className="min-h-screen bg-yellow-300">
        <div className="relative z-10">
          <Navigation onCommunitySafetyClick={handleCommunitySafetyClick} />
          <div className="w-full"
          style={{
                  backgroundImage: `url(${kidsbg})`, 
                  backgroundSize: 'cover',}}> 
              <div className="text-center py-8">
                {/* Hero text and button container */}
                <div className="flex flex-col items-center justify-center mb-6">
                  {/* Main heading and button row */}
                  <div className="flex items-center justify-center space-x-6 mb-4">
                    <h1 className="text-4xl md:text-6xl font-black text-purple-800 leading-tight">
                      You Are a
                      <br />
                <div className="flex items-center justify-center space-x-6 mb-4">
                    </h1>
                    <ReportBadTouchButton />
                  </div>
                  <p className="text-xl md:text-2xl text-purple-700 font-bold max-w-2xl mx-auto">
                    🛡️ Learn how to stay safe, help friends, and be brave! 💪
                  </p>
                </div>
              </div>
              <div className="mx-10"><FeaturedSection onGameClick={handleGameClickById} /></div>
            </div>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            
            

            
            
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

          <CommunitySafetyModal 
            isOpen={isCommunitySafetyOpen}
            onClose={closeCommunitySafety}
          />

          <PhoneVerificationModal 
            isOpen={isPhoneVerificationOpen}
            onClose={closePhoneVerification}
            onVerified={handlePhoneVerified}
          />
        </div>
      </div>
    </AudioProvider>
  );
}

export default App;