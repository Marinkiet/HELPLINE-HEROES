import React from 'react';
import { Shield, Users, Phone, BookOpen } from 'lucide-react';

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onClick: () => void;
}

interface CategoryCardsProps {
  onCategoryClick: (category: string) => void;
}

export function CategoryCards({ onCategoryClick }: CategoryCardsProps) {
  const categories: Category[] = [
    {
      id: 'recognition',
      title: 'Safety Recognition',
      icon: <Shield className="w-8 h-8" />,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      onClick: () => onCategoryClick('recognition')
    },
    {
      id: 'response',
      title: 'Response Skills',
      icon: <Users className="w-8 h-8" />,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      onClick: () => onCategoryClick('response')
    },
    {
      id: 'reporting',
      title: 'Getting Help',
      icon: <Phone className="w-8 h-8" />,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      onClick: () => onCategoryClick('reporting')
    },
    {
      id: 'support',
      title: 'Support Network',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-pink-500 to-pink-600',
      onClick: () => onCategoryClick('support')
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={category.onClick}
          className={`${category.bgColor} rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl group`}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-3 group-hover:animate-pulse">
              <div className={category.color}>
                {category.icon}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">{category.title}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}