import React from 'react';
import { ArrowLeft, Facebook, Instagram, Twitter } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useEngagement } from '../contexts/EngagementContext';

interface CardGamesBlankPageProps {
  onBack: () => void;
}

export function CardGamesBlankPage({ onBack }: CardGamesBlankPageProps) {
  const { selectedLanguage } = useAudio();
  const { trackInteraction } = useEngagement();
  const [showHowToPlay, setShowHowToPlay] = React.useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = React.useState(false);
  const [selectedGameLanguage, setSelectedGameLanguage] = React.useState('english');
  const [quantity, setQuantity] = React.useState(1);

  const gameLanguages = [
    { code: 'english', name: 'English' },
    { code: 'zulu', name: 'Zulu' },
    { code: 'xhosa', name: 'Xhosa' },
    { code: 'sesotho', name: 'Sesotho' },
    { code: 'setswana', name: 'Setswana' },
    { code: 'tsonga', name: 'Tsonga' },
    { code: 'south_ndebele', name: 'South Ndebele' },
    { code: 'venda', name: 'Venda' },
    { code: 'northern_sotho', name: 'Northern Sotho (Sepedi)' }
  ];

  const gamePrice = 150; // R150 per box
  const totalPrice = gamePrice * quantity;

  // Content translations
  const content = {
    title: {
      en: "HELPLINE HEROES",
      af: "HULPLYN HELDE",
      zu: "AMAQHAWE OMUGQA WOSIZO",
      xh: "AMAQHAWE OMGCA WONCEDO",
      st: "LIQHAWE TSA MOHALA WA THUSO",
      tn: "DIQHAKGA TSA MOGALA WA THUSO",
      ts: "TIQHAKGA TA RIQINGHO RA MPFUNO",
      ve: "MAGWALA A LUTINGO LWA THUSO",
      nr: "AMAQHAWE OMUGQA WOSIZO",
      nso: "MAGWALA A MOGALA WA THUŠO"
    },
    subtitle: {
      en: "where kids learn to recognize, resist & report",
      af: "waar kinders leer om te herken, weerstand te bied en te rapporteer",
      zu: "lapho izingane zifunda ukubona, ukumelana nokubika",
      xh: "apho abantwana bafunda ukuqonda, ukumelana nokuxela",
      st: "moo bana ba ithutang ho tseba, ho hanyetsa le ho bega",
      tn: "koo bana ba ithutang go lemoga, go lwantsha le go begela",
      ts: "laha vana va dyondzaka ku vona, ku lwisana na ku vika",
      ve: "hune vhana vha gudaho u divha, u lwisana na u pfi",
      nr: "lapho izingane zifunda ukubona, ukumelana nokubika",
      nso: "moo bana ba ithutago go lemoga, go lwantšha le go begela"
    },
    howToPlay: {
      en: "How To Play",
      af: "Hoe Om Te Speel",
      zu: "Indlela Yokudlala",
      xh: "Indlela Yokudlala",
      st: "Tsela ea ho Bapala",
      tn: "Tsela ya go Tshameka",
      ts: "Ndlela yo Tlanga",
      ve: "Ndila ya u Tamba",
      nr: "Indlela Yokudlala",
      nso: "Tsela ya go Bapalela"
    },
    buyTheGames: {
      en: "Buy the Games",
      af: "Koop die Speletjies",
      zu: "Thenga Imidlalo",
      xh: "Thenga Imidlalo",
      st: "Reka Lipapali",
      tn: "Reka Metshameko",
      ts: "Xava Mintlangu",
      ve: "Rengelani Mitambo",
      nr: "Thenga Imidlalo",
      nso: "Reka Metshameko"
    },
    mainDescription: {
      en: "Trustline heroes is engaging, empowering & simple to play. An awareness-building board game that helps kids learn to recognize, resist & report unsafe situations.",
      af: "Trustline heroes is boeiend, bemagtigend en maklik om te speel. 'n Bewustheidsbou-bordspel wat kinders help om onveilige situasies te herken, weerstand te bied en te rapporteer.",
      zu: "I-Trustline heroes iyabandakanya, inikeza amandla futhi ilula ukuyidlala. Umdlalo webhodi owakha ukuqwashisa osiza izingane ukuthi zifunde ukubona, ukumelana nokubika izimo ezingaphephile.",
      xh: "I-Trustline heroes iyabandakanya, inika amandla kwaye ilula ukuyidlala. Umdlalo webhodi owakha ulwazi onceda abantwana ukuba bafunde ukuqonda, ukumelana nokuxela iimeko ezingakhuselekanga.",
      st: "Trustline heroes e khahlang, e matlafatsa 'me e bonolo ho e bapala. Papali ea boto e ahang tlhokomeliso e thusang bana ho ithuta ho tseba, ho hanyetsa le ho bega maemo a sa sireletsehang.",
      tn: "Trustline heroes e kgatlhang, e nonofileng mme e motlhofo go e tshameka. Motshameko wa boto o o agang temogo o o thusang bana go ithuta go lemoga, go lwantsha le go begela maemo a a sa babalesegang.",
      ts: "Trustline heroes yi tsakisa, yi pfumelela naswona yi olova ku yi tlanga. Ntlangu wa boto lowu akaka ku tiva lowu pfunaka vana ku dyondza ku vona, ku lwisana na ku vika swiyimo leswi nga hlayisekangiki.",
      ve: "Trustline heroes yo takadza, yo fhulufhedzea nahone yo lalama u tamba. Mutambo wa boto u akaho ndivho u thusaho vhana u guda u divha, u lwisana na u pfi zwithu zwo sa vhushaaho.",
      nr: "I-Trustline heroes iyabandakanya, inikeza amandla futhi ilula ukuyidlala. Umdlalo webhodi owakha ukuqwashisa osiza izingane ukuthi zifunde ukubona, ukumelana nokubika izimo ezingaphephile.",
      nso: "Trustline heroes e kgahlišago, e maatlafatšago gomme e bonolo go e bapalela. Papadi ya boto ye e agago temogo ye e thušago bana go ithuta go lemoga, go lwantšha le go begela maemo a a sa šireletšegago."
    },
    howDoYouPlay: {
      en: "How Do You Play?",
      af: "Hoe Speel Jy?",
      zu: "Udlala Kanjani?",
      xh: "Udlala Njani?",
      st: "U bapala Joang?",
      tn: "O tshameka Jang?",
      ts: "U tlanga Njhani?",
      ve: "Ni tamba Hani?",
      nr: "Udlala Kanjani?",
      nso: "O bapalela Bjang?"
    }
  };

  // Track language-aware interactions
  const handleHowToPlayClick = () => {
    setShowHowToPlay(true);
    trackInteraction('how_to_play_click', {
      page: 'card_games',
      language: selectedLanguage
    });
  };

  const handlePurchaseClick = () => {
    setShowPurchaseModal(true);
    trackInteraction('purchase_modal_open', {
      page: 'card_games',
      language: selectedLanguage,
      selected_game_language: selectedGameLanguage,
      quantity: quantity
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-200 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Large hourglass background - positioned like in reference */}
        <div className="absolute top-40 left-32 opacity-30">
          <div className="text-yellow-600/50 text-9xl transform rotate-12">⏳</div>
        </div>
        
        {/* Additional decorative circles */}
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-yellow-500/20 rounded-full"></div>
        <div className="absolute top-60 right-40 w-32 h-32 bg-orange-400/20 rounded-full"></div>
        <div className="absolute bottom-20 right-32 w-16 h-16 bg-yellow-600/20 rounded-full"></div>
        
        {/* Subtle wave pattern at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 opacity-80"></div>
      </div>

      {/* Header */}
      <header className="bg-black text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side - Logo and branding */}
            <div className="flex items-center space-x-4">
              {/* Irish flag */}
             <div className="flex">
                <div className="w-6 h-4 bg-white"></div>
                <div className="w-6 h-4 bg-red-600"></div>
              </div>
              
              {/* Blue smiley face logo */}
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="text-white text-xl">😊</div>
              </div>
              
              <div className="text-white text-sm font-semibold">ENGLISH Edition</div>
            </div>

            {/* Center - Main logo */}
            <div className="text-center">
              <h1 className="text-4xl font-black text-yellow-400">{content.title[selectedLanguage]}</h1>
              <p className="text-sm text-red-400 italic font-medium">{content.subtitle[selectedLanguage]}</p>
            </div>

            {/* Right side - Social media icons */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                <Facebook className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer">
                <Instagram className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                <Twitter className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Navigation menu */}
          <div className="border-t border-gray-700 py-3">
            <nav className="flex justify-center space-x-8 text-yellow-400 text-sm font-semibold">
              <span 
                onClick={handleHowToPlayClick}
                className="hover:text-yellow-300 cursor-pointer transition-colors"
              >
                {content.howToPlay[selectedLanguage]}
              </span>
              <span 
                onClick={handlePurchaseClick}
                className="hover:text-yellow-300 cursor-pointer transition-colors"
              >
                {content.buyTheGames[selectedLanguage]}
              </span>

            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10">
        {/* Back Button */}
        <div className="absolute top-8 left-8 z-20">
          <button
            onClick={onBack}
            className="bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 font-bold p-3 rounded-full shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center min-h-[600px]">
            
            {/* Left - Main game box */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative transform hover:scale-105 transition-transform duration-300">
                {/* Box shadow */}
                <div className="absolute inset-0 rounded-lg transform translate-x-3 translate-y-3"></div>
                
                <div className="relative w-80 h-[480px] rounded-lg shadow-2xl p-6 flex flex-col">
                  <img 
                    src="https://trustlineheroes.s3.eu-north-1.amazonaws.com/gamecards.png"
                    alt="Game Card"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Center - Main text and button */}
            <div className="text-center">
              <h1 className="text-5xl lg:text-5xl font-black text-white mb-12 leading-tight drop-shadow-2xl">
                {content.mainDescription[selectedLanguage]}
              </h1>
              
              <button 
                onClick={handleHowToPlayClick}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-black text-2xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200 border-4 border-white"
              >
                {content.howDoYouPlay[selectedLanguage]}
              </button>
            </div>

            {/* Right - Junior game box and board */}
            <div className="flex flex-col items-center lg:items-start space-y-8">
              {/* Junior game box */}
              <div className="relative transform rotate-12 hover:rotate-6 transition-transform duration-300">
                {/* Box shadow */}
                <div className="absolute inset-0 bg-purple-800/40 rounded-lg transform translate-x-3 translate-y-3"></div>
                
                <div className="relative w-72 h-80 bg-purple-600 rounded-lg shadow-2xl p-4 flex flex-col">
                  {/* Irish flag on junior box */}
                  <div className="flex mb-2">
                        <div className="w-4 h-3 bg-black"></div>
                        <div className="w-4 h-3 bg-green-500"></div>
                        <div className="w-4 h-3 bg-yellow-400"></div>
                        <div className="w-4 h-3 bg-white"></div>
                        <div className="w-4 h-3 bg-red-600"></div>
                        <div className="w-4 h-3 bg-blue-600"></div>
                      </div>

                  
                  
                  {/* Game board preview inside box */}
                  <div className="flex-1 bg-purple-700 rounded-lg p-3">
                    <img 
                      src="https://trustlineheroes.s3.eu-north-1.amazonaws.com/gamebaord.png"
                      alt="Game Board"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Ages indicator */}
                  <div className="text-white text-xs mt-2 opacity-80">
                    Ages 6+
                  </div>
                </div>
              </div>

              {/* Separate game board - positioned to match reference */}
              <div className="relative transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                {/* Board shadow */}
                <div className="absolute inset-0 bg-purple-800/40 rounded-lg transform translate-x-3 translate-y-3"></div>
                
                <div className="relative bg-purple-600 rounded-lg p-6 w-80 h-80 shadow-2xl">
                  {/* Board header */}
                  <div className="text-center mb-4">
                    <h3 className="text-yellow-400 text-2xl font-black">GAME CARD</h3>
          
                  </div>
                  
                  {/* Main game board grid */}
                  <div className="bg-purple-700 rounded-lg p-4 h-56">
                    <img 
                      src="https://trustlineheroes.s3.eu-north-1.amazonaws.com/carddemo.png"
                      alt="Game Board"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Board footer */}
                  <div className="text-center mt-3">
                    <p className="text-white text-sm font-bold">Roll dice & answer questions!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shopping cart icon (bottom right) */}
        <div className="fixed bottom-8 right-8 z-20">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-all duration-200">
              <div className="text-white font-bold text-lg">🛒</div>
            </div>
            {/* Cart count badge */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{quantity}</span>
            </div>
          </div>
        </div>
      </main>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black">How to Play Helpline Heroes</h2>
                <button
                  onClick={() => setShowHowToPlay(false)}
                  className="text-white hover:text-gray-200 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                  aria-label="Close how to play"
                >
                  <ArrowLeft className="w-8 h-8" />
                </button>
              </div>
              <p className="text-blue-100 text-lg font-semibold mt-2">
                The awareness-building board game that helps kids learn to recognize, resist & report unsafe situations
              </p>
            </div>

            <div className="p-8 space-y-8">
              {/* Game Overview */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
                <h3 className="text-2xl font-bold text-yellow-800 mb-4">🎯 Game Overview</h3>
                <p className="text-yellow-700 text-lg leading-relaxed">
                  Helpline Heroes uses the same educational content from our digital safety games in a fun, 
                  interactive card format. Players learn about body safety, trusted adults, and speaking up 
                  while playing together in groups or classrooms.
                </p>
              </div>

              {/* Basic Setup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-black">1</span>
                    Basic Setup
                  </h3>
                  <ul className="text-blue-700 space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>2-6 players (or teams in classroom setting)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Question cards organized by safety topics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Game board with topic progression path</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Dice for movement</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-black">2</span>
                    How to Play
                  </h3>
                  <ul className="text-green-700 space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>One player reads question to another</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>If answer matches card, player moves forward</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Wrong answer? Reader shares correct answer</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>Complete all topic questions to advance</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Classroom Mode */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🏫</span>
                  Classroom & Group Play
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-purple-800 mb-3">👩‍🏫 Teacher/Facilitator Role:</h4>
                    <ul className="text-purple-700 space-y-2 text-sm">
                      <li>• Acts as the question reader for all teams</li>
                      <li>• Guides discussion after each answer</li>
                      <li>• Provides correct answers when needed</li>
                      <li>• Ensures safe, supportive learning environment</li>
                      <li>• Facilitates group reflection on safety topics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-800 mb-3">👥 Team Play:</h4>
                    <ul className="text-purple-700 space-y-2 text-sm">
                      <li>• Divide class into small teams (3-5 students)</li>
                      <li>• Teams work together to answer questions</li>
                      <li>• Encourage discussion within teams</li>
                      <li>• Teams can challenge each other</li>
                      <li>• Celebrate learning, not just winning</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Safety Topics */}
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                <h3 className="text-2xl font-bold text-orange-800 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🛡️</span>
                  Safety Topics Covered
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-green-800 mb-2">🕵️ Safe Touch Detective</h4>
                    <p className="text-green-700 text-sm">Learn about good touch vs bad touch and body safety</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-blue-800 mb-2">💖 Trusted Heroes Circle</h4>
                    <p className="text-blue-700 text-sm">Identify trusted adults and recognize warning signs</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-purple-800 mb-2">🎤 Brave Voice</h4>
                    <p className="text-purple-700 text-sm">Practice speaking up and reporting unsafe situations</p>
                  </div>
                </div>
              </div>

              {/* Game Rules */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-3xl mr-3">📋</span>
                  Detailed Game Rules
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border-l-4 border-blue-400">
                    <h4 className="font-bold text-blue-800 mb-2">🎲 Turn Sequence:</h4>
                    <ol className="text-gray-700 space-y-1 text-sm list-decimal list-inside">
                      <li>Player rolls dice to determine movement</li>
                      <li>Another player (or facilitator) reads question card</li>
                      <li>Player gives their answer</li>
                      <li>Check answer against card solution</li>
                      <li>Move forward if correct, stay if incorrect</li>
                      <li>Discuss the safety lesson together</li>
                    </ol>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border-l-4 border-green-400">
                    <h4 className="font-bold text-green-800 mb-2">🏆 Winning Conditions:</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Complete ALL questions in each safety topic deck</li>
                      <li>• Progress through: Recognition → Response → Reporting → Support</li>
                      <li>• Everyone wins when everyone learns!</li>
                      <li>• Focus on understanding, not speed</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border-l-4 border-red-400">
                    <h4 className="font-bold text-red-800 mb-2">❤️ Important Reminders:</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Create a safe, non-judgmental environment</li>
                      <li>• Encourage questions and discussion</li>
                      <li>• Remind players they can talk to trusted adults anytime</li>
                      <li>• Emphasize that learning about safety is brave and important</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Age Recommendations */}
              <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
                <h3 className="text-2xl font-bold text-cyan-800 mb-4 flex items-center">
                  <span className="text-3xl mr-3">👶</span>
                  Age Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl text-center">
                    <div className="text-2xl mb-2">🌟</div>
                    <h4 className="font-bold text-cyan-800 mb-1">Ages 6-8</h4>
                    <p className="text-cyan-700 text-sm">Basic safety concepts with adult guidance</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-bold text-cyan-800 mb-1">Ages 9-11</h4>
                    <p className="text-cyan-700 text-sm">Independent play with peer discussion</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center">
                    <div className="text-2xl mb-2">🚀</div>
                    <h4 className="font-bold text-cyan-800 mb-1">Ages 12-14</h4>
                    <p className="text-cyan-700 text-sm">Advanced scenarios and leadership roles</p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Playing?</h3>
                <p className="text-blue-100 mb-6">
                  Get your Helpline Heroes card game and start building safety awareness in your community!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setShowPurchaseModal(true)}
                    className="bg-white text-purple-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    Buy the Game
                  </button>
                  <button 
                    onClick={() => setShowHowToPlay(false)}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
                  >
                    Back to Games
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black">Buy Helpline Heroes Card Game</h2>
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="text-white hover:text-gray-200 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                  aria-label="Close purchase modal"
                >
                  <ArrowLeft className="w-8 h-8" />
                </button>
              </div>
              <p className="text-blue-100 text-lg font-semibold mt-2">
                The complete physical card game for home, school, or community use
              </p>
            </div>

            <div className="p-8 space-y-6">
              {/* Product Overview */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl">
                <h3 className="text-2xl font-bold text-blue-800 mb-4">📦 What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                    <div className="text-3xl mb-2">🎲</div>
                    <h4 className="font-bold text-blue-800 mb-1">Game Board</h4>
                    <p className="text-blue-700 text-sm">Colorful safety topic progression board</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                    <div className="text-3xl mb-2">🃏</div>
                    <h4 className="font-bold text-blue-800 mb-1">Question Cards</h4>
                    <p className="text-blue-700 text-sm">100+ educational safety questions</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-center shadow-sm">
                    <div className="text-3xl mb-2">🎯</div>
                    <h4 className="font-bold text-blue-800 mb-1">Game Pieces</h4>
                    <p className="text-blue-700 text-sm">Dice and player tokens included</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-black text-green-800 mb-2">💰 Pricing</h3>
                  <div className="text-6xl font-black text-green-600 mb-2">R{gamePrice}</div>
                  <p className="text-green-700 text-lg font-semibold">per complete game box</p>
                  <p className="text-green-600 text-sm">Includes board, cards, dice & instructions</p>
                </div>
              </div>

              {/* Language Selection */}
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🌍</span>
                  Choose Your Game Language
                </h3>
                <p className="text-purple-700 mb-4">
                  Select the language for your card game. All questions, instructions, and game materials will be in your chosen language.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {gameLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedGameLanguage(lang.code)}
                      className={`p-3 rounded-xl font-semibold transition-all duration-200 ${
                        selectedGameLanguage === lang.code
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-200'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-orange-800 mb-4 flex items-center">
                  <span className="text-3xl mr-3">📊</span>
                  Quantity
                </h3>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-12 h-12 rounded-full transition-colors duration-200"
                  >
                    -
                  </button>
                  <div className="bg-white border-2 border-orange-300 rounded-xl px-6 py-3 min-w-[80px] text-center">
                    <span className="text-2xl font-bold text-orange-800">{quantity}</span>
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-12 h-12 rounded-full transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
                <p className="text-center text-orange-700 mt-3 font-semibold">
                  Perfect for classrooms - order multiple sets for group activities!
                </p>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">📋 Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Game Language:</span>
                    <span className="text-gray-800 font-bold">
                      {gameLanguages.find(lang => lang.code === selectedGameLanguage)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Quantity:</span>
                    <span className="text-gray-800 font-bold">{quantity} box{quantity > 1 ? 'es' : ''}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Price per box:</span>
                    <span className="text-gray-800 font-bold">R{gamePrice}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Total:</span>
                      <span className="text-3xl font-black text-green-600">R{totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Educational Benefits */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🎓</span>
                  Educational Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-yellow-800 mb-2">🏠 For Families:</h4>
                    <ul className="text-yellow-700 space-y-1 text-sm">
                      <li>• Start important safety conversations at home</li>
                      <li>• Age-appropriate content for different children</li>
                      <li>• Fun way to reinforce digital safety lessons</li>
                      <li>• Quality family bonding time</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-800 mb-2">🏫 For Educators:</h4>
                    <ul className="text-yellow-700 space-y-1 text-sm">
                      <li>• Curriculum-aligned safety education</li>
                      <li>• Interactive group learning activities</li>
                      <li>• Facilitator guide included</li>
                      <li>• Supports classroom discussions</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">Ready to Order?</h3>
                <p className="text-blue-100 mb-6">
                  Get your Helpline Heroes card game delivered to your door!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-200 text-lg">
                    🛒 Add to Cart - R{totalPrice}
                  </button>
                  <button 
                    onClick={() => setShowPurchaseModal(false)}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-colors duration-200 text-lg"
                  >
                    Continue Browsing
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-4">
                  Free shipping within South Africa • 30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}