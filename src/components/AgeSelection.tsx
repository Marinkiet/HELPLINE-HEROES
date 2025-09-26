import React from 'react';
import { useAudio } from '../contexts/AudioContext';
import kidsbg from '../assets/kidsbg.jpg';
import starImg from '../assets/star.jpg';
import bookImg from '../assets/book.jpg';
import backpackImg from '../assets/backpack.jpg';

interface AgeSelectionProps {
  onAgeSelect: (ageGroup: 'early' | 'middle' | 'teen') => void;
}

export function AgeSelection({ onAgeSelect }: AgeSelectionProps) {
  const { selectedLanguage } = useAudio();

  const ageGroups = [
    {
      id: 'early' as const,
      ageRange: '5-7',
      title: {
        en: 'Little Heroes',
        af: 'Klein Helde',
        zu: 'Amaqhawe Amancane',
        xh: 'Amaqhawe Amancinci',
        st: 'Liqhawe tse Nyane',
        tn: 'Diqhakga tse Dinnye',
        ts: 'Tiqhakga ta le Hansi',
        ve: 'Magwala Maduku',
        nr: 'Amaqhawe Amancane',
        nso: 'Magwala a Mannye'
      },
      description: {
        en: 'Fun activities for young children',
        af: 'Prettige aktiwiteite vir jong kinders',
        zu: 'Imisebenzi ejabulisayo yezingane ezincane',
        xh: 'Imisebenzi emnandi yabantwana abancinci',
        st: 'Mesebetsi e monate ea bana ba banyane',
        tn: 'Ditiro tse di monate tsa bana ba bannye',
        ts: 'Mintirho ya ntsakiso ya vana va vatsongo',
        ve: 'Mishumo ya u tsakisa ya vhana vhaduku',
        nr: 'Imisebenzi ejabulisayo yezingane ezincane',
        nso: 'Mešomo ye mebotse ya bana ba bannye'
      },
      image: starImg,
      bgColor: 'from-yellow-400 to-orange-500',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'middle' as const,
      ageRange: '8-11',
      title: {
        en: 'Smart Explorers',
        af: 'Slim Ontdekkers',
        zu: 'Abaphenyi Abahlakaniphile',
        xh: 'Abaphandi Abahlakaniphileyo',
        st: 'Bafuputsi ba Bohlale',
        tn: 'Batlhatlhobi ba Botlhale',
        ts: 'Vafuputsi va Vutlhari',
        ve: 'Vhafuputsi vha Vhutshilo',
        nr: 'Abaphenyi Abahlakaniphile',
        nso: 'Bafuputši ba Bohlale'
      },
      description: {
        en: 'Learning adventures for school-age kids',
        af: 'Leeravonture vir skoolkinders',
        zu: 'Izigigaba zokufunda zezingane zasesikoleni',
        xh: 'Uhambo lokufunda lwabantwana abasesikolweni',
        st: 'Dipalangwang tsa ho ithuta tsa bana ba sekolo',
        tn: 'Dipalangwa tsa go ithuta tsa bana ba sekolo',
        ts: 'Maendzo ya ku dyondza ya vana va xikolo',
        ve: 'Zwiendedzo zwa u guda zwa vhana vha tshikolo',
        nr: 'Izigigaba zokufunda zezingane zasesikoleni',
        nso: 'Dipalangwa tša go ithuta tša bana ba sekolo'
      },
      image: bookImg,
      bgColor: 'from-blue-400 to-purple-500',
      iconColor: 'text-blue-600'
    },
    {
      id: 'teen' as const,
      ageRange: '12-14',
      title: {
        en: 'Young Leaders',
        af: 'Jong Leiers',
        zu: 'Abaholi Abasha',
        xh: 'Iinkokeli Ezintsha',
        st: 'Baetapele ba Bacha',
        tn: 'Baeteledipele ba Basha',
        ts: 'Varhangeri va Vantshwa',
        ve: 'Vharangaphanḓa vha Vhatshena',
        nr: 'Abaholi Abasha',
        nso: 'Baetapele ba Baša'
      },
      description: {
        en: 'Advanced safety skills for teens',
        af: 'Gevorderde veiligheidsvaardighede vir tieners',
        zu: 'Amakhono okuphepha aphakeme entsheni',
        xh: 'Izakhono eziphakamileyo zokhuseleko kolutsha',
        st: 'Tsebo e phahameng ea polokeho ea bacha',
        tn: 'Bokgoni jo bo kwa godimo jwa pabalesego jwa basha',
        ts: 'Vuswikoti bya le henhla bya vuhlayiseki bya vantshwa',
        ve: 'Zwikili zwa nṱha zwa vhushai ha vhatshena',
        nr: 'Amakhono okuphepha aphakeme entsheni',
        nso: 'Bokgoni bjo bo phagamego bja polokego bja baša'
      },
      image: backpackImg,
      bgColor: 'from-purple-400 to-pink-500',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${kidsbg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10"></div>
      
     <div className="bg-white/40 rounded-3xl p-8 max-w-4xl w-full shadow-2xl">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-800 mb-4">
            🛡️ Trustline Heroes 🛡️
          </h1>
          <p className="text-2xl text-gray-600 font-bold mb-2">
            {selectedLanguage === 'en' && 'Choose Your Age Group'}
            {selectedLanguage === 'af' && 'Kies Jou Ouderdomsgroep'}
            {selectedLanguage === 'zu' && 'Khetha Iqembu Lakho Leminyaka'}
            {selectedLanguage === 'xh' && 'Khetha Iqela Lakho Leminyaka'}
            {selectedLanguage === 'st' && 'Khetha Sehlopha sa Hao sa Lilemo'}
            {selectedLanguage === 'tn' && 'Tlhopha Setlhopha sa Gago sa Dingwaga'}
            {selectedLanguage === 'ts' && 'Hlawula Ntlawa wa Wena wa Malembe'}
            {selectedLanguage === 've' && 'Nangani Tshigwada Tshaṋu tsha Minwaha'}
            {selectedLanguage === 'nr' && 'Khetha Iqembu Lakho Leminyaka'}
            {selectedLanguage === 'nso' && 'Kgetha Sehlopha sa Gago sa Mengwaga'}
          </p>
          <p className="text-lg text-gray-500">
            {selectedLanguage === 'en' && 'Select your age to see activities designed just for you!'}
            {selectedLanguage === 'af' && 'Kies jou ouderdom om aktiwiteite te sien wat net vir jou ontwerp is!'}
            {selectedLanguage === 'zu' && 'Khetha iminyaka yakho ukuze ubone imisebenzi eyenzelwe wena kuphela!'}
            {selectedLanguage === 'xh' && 'Khetha iminyaka yakho ukuze ubone imisebenzi eyenzelwe wena kuphela!'}
            {selectedLanguage === 'st' && 'Khetha lilemo tsa hao ho bona mesebetsi e entsoeng bakeng sa uena feela!'}
            {selectedLanguage === 'tn' && 'Tlhopha dingwaga tsa gago go bona ditiro tse di diretsweng wena fela!'}
            {selectedLanguage === 'ts' && 'Hlawula malembe ya wena ku vona mintirho leyi endleriweke wena ntsena!'}
            {selectedLanguage === 've' && 'Nangani minwaha yaṋu u vhona mishumo yo itirelwa niṅe fhedzi!'}
            {selectedLanguage === 'nr' && 'Khetha iminyaka yakho ukuze ubone imisebenzi eyenzelwe wena kuphela!'}
            {selectedLanguage === 'nso' && 'Kgetha mengwaga ya gago go bona mešomo ye e diretšwego wena fela!'}
          </p>
        </div>

        {/* Age Group Cards */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 py-8">
          {ageGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => onAgeSelect(group.id)}
              className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white transform transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 group flex flex-col items-center justify-center"
            >
              {/* Large Image */}
              <div className="mb-4 group-hover:animate-bounce">
                <img 
                  src={group.image} 
                  alt={group.title[selectedLanguage]}
                  className="w-12 h-12 md:w-20 md:h-20 object-cover rounded-full"
                />
              </div>
              
              {/* Age Range */}
              <div className="text-center">
                <span className="text-2xl md:text-3xl font-black text-white">
                  {group.ageRange}
                </span>
                <p className="text-sm md:text-lg font-bold text-white/90 mt-1">
                  {group.title[selectedLanguage]}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            {selectedLanguage === 'en' && 'Don\'t worry, you can always change your age group later!'}
            {selectedLanguage === 'af' && 'Moenie bekommerd wees nie, jy kan altyd jou ouderdomsgroep later verander!'}
            {selectedLanguage === 'zu' && 'Ungakhathazeki, ungahlala ushintsha iqembu lakho leminyaka kamuva!'}
            {selectedLanguage === 'xh' && 'Ungakhathazeki, usenokutshintsha iqela lakho leminyaka kamva!'}
            {selectedLanguage === 'st' && 'Se tšoenyehe, u ka lula u fetola sehlopha sa hao sa lilemo hamorao!'}
            {selectedLanguage === 'tn' && 'Se tshwenyege, o ka nna wa fetola setlhopha sa gago sa dingwaga moragonyana!'}
            {selectedLanguage === 'ts' && 'U nga vileli, u nga ha cinca ntlawa wa wena wa malembe endzhaku!'}
            {selectedLanguage === 've' && 'Ni songo vhavha, ni nga dovha na shandukisa tshigwada tshaṋu tsha minwaha mulandu!'}
            {selectedLanguage === 'nr' && 'Ungakhathazeki, ungahlala ushintsha iqembu lakho leminyaka kamuva!'}
            {selectedLanguage === 'nso' && 'Se tshwenyege, o ka fetola sehlopha sa gago sa mengwaga ka morago!'}
          </p>
        </div>
      </div>
    </div>
  );
}