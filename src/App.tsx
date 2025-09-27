import React, { useState, useMemo, useEffect } from 'react';
import { useAudio } from './contexts/AudioContext';
import { AudioProvider } from './contexts/AudioContext';
import { EngagementProvider } from './contexts/EngagementContext';
import { useEngagement } from './contexts/EngagementContext';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AgeSelection } from './components/AgeSelection';
import { Age5to7Page } from './components/Age5to7Page';
import { Navigation } from './components/Navigation';
import { CommunitySafetyModal } from './components/CommunitySafetyModal';
import { PhoneVerificationModal } from './components/PhoneVerificationModal';
import { FeaturedSection } from './components/FeaturedSection';
import { CategoryCards } from './components/CategoryCards';
import { GameGrid } from './components/GameGrid';
import { SearchBar } from './components/SearchBar';
import { GameModal } from './components/GameModal';
import { games, Game } from './data/games';
import { appContent } from './data/appContent';
import kidsbg from './assets/kidsbg.jpg';
import { ReportBadTouchButton } from './components/ReportBadTouchButton';
import { AdultReportButton } from './components/AdultReportButton';
import { engagementService } from './services/engagementService';

type AgeGroup = 'early' | 'middle' | 'teen' | null;

function AppContent() {
  const { selectedLanguage } = useAudio();
  const { trackInteraction, updateLanguage, updateAgeGroup } = useEngagement();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommunitySafetyOpen, setIsCommunitySafetyOpen] = useState(false);
  const [isPhoneVerificationOpen, setIsPhoneVerificationOpen] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Initialize engagement tracking when age group is selected
  useEffect(() => {
    if (selectedAgeGroup) {
      engagementService.initializeSession(selectedAgeGroup, selectedLanguage);
    }
  }, [selectedAgeGroup, selectedLanguage]);

  // Track language changes
  useEffect(() => {
    if (selectedAgeGroup) {
      updateLanguage(selectedLanguage);
    }
  }, [selectedLanguage, selectedAgeGroup, updateLanguage]);

  // Filter games based on selected age group
  const filteredGames = useMemo(() => {
    let filtered = games;
    
    // Filter by age group if selected
    if (selectedAgeGroup) {
      filtered = filtered.filter(game => game.ageGroup === selectedAgeGroup);
    }
    
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
  }, [searchQuery, selectedCategory, selectedAgeGroup]);

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
    // Track game modal open
    trackInteraction('game_modal_open', {
      game_id: game.id,
      game_title: game.title[selectedLanguage]
    });
  };

  const handleGameClickById = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      handleGameClick(game);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? '' : category);
    // Track category selection
    trackInteraction('category_click', {
      category: category,
      selected: selectedCategory !== category
    });
  };

  const handleSurpriseMe = () => {
    const randomGame = games[Math.floor(Math.random() * games.length)];
    handleGameClick(randomGame);
    // Track surprise me usage
    trackInteraction('surprise_me_click', {
      selected_game_id: randomGame.id
    });
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

  const handleAgeSelect = (ageGroup: AgeGroup) => {
    setSelectedAgeGroup(ageGroup);
    if (ageGroup) {
      updateAgeGroup(ageGroup);
    }
  };

  const handleBackToAgeSelection = () => {
    setSelectedAgeGroup(null);
    setSearchQuery('');
    setSelectedCategory('');
    // Track back to age selection
    trackInteraction('back_to_age_selection');
  };

  // Show analytics dashboard
  if (showAnalytics) {
    return <AnalyticsDashboard />;
  }

  // Show age selection if no age group is selected
  if (!selectedAgeGroup) {
    return <AgeSelection onAgeSelect={handleAgeSelect} />;
  }

  // Show dedicated page for 5-7 age group
  if (selectedAgeGroup === 'early') {
    return (
      <Age5to7Page 
        onBackToAgeSelection={handleBackToAgeSelection}
        onCommunitySafetyClick={handleCommunitySafetyClick}
      />
    );
  }

  return (
      <div className="min-h-screen bg-yellow-300">
        <div className="relative z-10">
          <Navigation onBackToAgeSelection={handleBackToAgeSelection} />
          <div className="w-full"
          style={{
                  backgroundImage: `url(${kidsbg})`, 
                  backgroundSize: 'cover',}}> 
              <div className="text-center py-8">
                {/* Hero text and button container */}
                <div className="flex flex-col items-center justify-center mb-6">
                  {/* Main heading and button row */}
                  <div className="flex items-center justify-between w-full max-w-4xl px-8 mb-4">
                    <AdultReportButton onClick={handleCommunitySafetyClick} />
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
  );
}

function App() {
  return (
    <AudioProvider>
      <EngagementProvider>
        <AppContent />
      </EngagementProvider>
    </AudioProvider>
  );
}

export default App;