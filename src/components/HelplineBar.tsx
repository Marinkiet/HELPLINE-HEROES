import React from 'react';
import { Phone, MessageCircle, Shield } from 'lucide-react';
import { helplineNumbers } from '../data/games';

export function HelplineBar() {
  return (
    <div className="bg-red-600 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span className="font-bold">Need Help Right Now?</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a 
            href={`tel:${helplineNumbers.childline}`}
            className="flex items-center space-x-2 bg-white text-red-600 px-3 py-1 rounded-full font-bold hover:bg-red-50 transition-colors duration-200 text-sm"
          >
            <Phone className="w-4 h-4" />
            <span>Call {helplineNumbers.childline}</span>
          </a>
          
          <a 
            href={`sms:741741?body=HOME`}
            className="flex items-center space-x-2 bg-white text-red-600 px-3 py-1 rounded-full font-bold hover:bg-red-50 transition-colors duration-200 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Text HOME to 741741</span>
          </a>
        </div>
      </div>
    </div>
  );
}