import React, { useState, useEffect } from 'react';
import { Shield, Users, Phone, BookOpen } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { getTopics } from '../services/supabaseService';

interface Topic {
  id: string;
  name: string;
  description: string;
  title: Record<string, string>;
}

interface CategoryCardsProps {
  onCategoryClick: (category: string) => void;
}

export function CategoryCards({ onCategoryClick }: CategoryCardsProps) {
  const { selectedLanguage } = useAudio();
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTopics();
      setTopics(data);
    };
    fetchTopics();
  }, []);
  
  const categoryConfig = {
    recognition: {
      icon: <Shield className="w-8 h-8" />,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
    },
    response: {
      icon: <Users className="w-8 h-8" />,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    reporting: {
      icon: <Phone className="w-8 h-8" />,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
    support: {
      icon: <BookOpen className="w-8 h-8" />,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-pink-500 to-pink-600',
    },
  };

  type CategoryName = keyof typeof categoryConfig;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {topics.map((topic) => {
        const topicName = topic.name as CategoryName;
        return (
        <div
          key={topic.id}
          onClick={() => onCategoryClick(topic.name)}
          className={`${categoryConfig[topicName]?.bgColor} rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl group`}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-3 group-hover:animate-pulse">
              <div className={categoryConfig[topicName]?.color}>
                {categoryConfig[topicName]?.icon}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">{topic.title[selectedLanguage]}</h3>
            </div>
          </div>
        </div>
      )})}
    </div>
  );
}