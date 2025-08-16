import React, { useState, useMemo } from 'react';
import { AudioProvider } from './contexts/AudioContext';
import { Navigation } from './components/Navigation';
import { CommunitySafetyModal } from './components/CommunitySafetyModal';
import { FeaturedSection } from './components/FeaturedSection';
import { CategoryCards } from './components/CategoryCards';
import { GameGrid } from './components/GameGrid';
import { SearchBar } from './components/SearchBar';
import { GameModal } from './components/GameModal';
import { games, Game } from './data/games';
import kidsbg from './assets/kidsbg.jpg';
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommunitySafetyOpen, setIsCommunitySafetyOpen] = useState(false);

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
    setIsCommunitySafetyOpen(true);
  };

  const closeCommunitySafety = () => {
    setIsCommunitySafetyOpen(false);
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
              <div className="text-center ">
              <h1 className="text-4xl md:text-6xl font-black text-purple-800 mb-4 leading-tight">
                You Are a
                <br />
                <span className="text-blue-600">Helpline Hero!</span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-700 font-bold max-w-2xl mx-auto">
                🛡️ Learn how to stay safe, help friends, and be brave! 💪
              </p>
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
        </div>
      </div>
    </AudioProvider>
  );
}

export default App;