import React, { useState, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { getAgeGroups } from '../services/supabaseService';
import kidsbg from '../assets/kidsbg.jpg';

interface AgeGroup {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  image_url: string;
  age_range: string;
}

interface AgeSelectionProps {
  onAgeSelect: (ageGroup: string) => void;
}

export function AgeSelection({ onAgeSelect }: AgeSelectionProps) {
  const { selectedLanguage } = useAudio();
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);

  useEffect(() => {
    const fetchAgeGroups = async () => {
      const data = await getAgeGroups();
      setAgeGroups(data);
    };
    fetchAgeGroups();
  }, []);

  

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
      
     <div className="bg-white/50 rounded-3xl p-8 max-w-4xl w-full shadow-2xl">

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
                  src={group.image_url} 
                  alt={group.name[selectedLanguage]}
                  className="w-12 h-12 md:w-20 md:h-20 object-cover rounded-full"
                />
              </div>
              
              {/* Age Range */}
              <div className="text-center">
                <span className="text-2xl md:text-3xl font-black text-white">
                  {group.age_range}
                </span>
                <p className="text-sm md:text-lg font-bold text-white/90 mt-1">
                  {group.name[selectedLanguage]}
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