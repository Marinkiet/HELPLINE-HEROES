import React, { useState } from 'react';
import { Phone, Shield, X, AlertTriangle } from 'lucide-react';

export function ReportBadTouchButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCall = () => {
    // Show additional confirmation before making the call
    const confirmed = window.confirm(
      '⚠️ IMPORTANT REMINDER ⚠️\n\n' +
      'You are about to call Childline (116).\n\n' +
      'This number is ONLY for children who:\n' +
      '• Feel unsafe or scared\n' +
      '• Have experienced bad touch\n' +
      '• Need help from a trusted adult\n\n' +
      'Calling for fun or games is wrong and stops other children from getting help.\n\n' +
      'Are you sure you need help right now?'
    );
    
    if (confirmed) {
      window.location.href = 'tel:116';
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Button */}
      <div
        className="relative flex items-center justify-center w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-110 group animate-pulse hover:animate-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
        aria-label="Report Bad Touch - Call for help"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsModalOpen(true);
          }
        }}
      >
        <Shield className="w-10 h-10 text-white" />
        
        {/* Tooltip on hover */}
        {isHovered && (
          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="font-bold">Report Bad Touch</div>
            <div className="text-xs">Call 116 for help</div>
            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform animate-bounce-in">
            {/* Close button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal content */}
            <div className="text-center mb-6">
              <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Phone className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-4">Need Help Right Now?</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Childline (116) is here to help children who feel unsafe, scared, or have experienced bad touch.
              </p>
              <p className="text-gray-600 leading-relaxed">
                A kind, trusted adult will listen to you and help you feel safe again. You are brave for asking for help.
              </p>
            </div>

            {/* Warning section */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl mb-6">
              <div className="flex items-start mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-yellow-800 mb-1">VERY IMPORTANT:</h3>
                  <p className="text-yellow-700 text-sm leading-relaxed">
                    This number is only for children who really need help. Calling for fun, games, or pranks is wrong and stops other children from getting the help they need. Only call if you truly need help.
                  </p>
                </div>
              </div>
            </div>

            {/* What happens when you call */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl mb-6">
              <h3 className="font-bold text-blue-800 mb-2">What happens when you call:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• A caring adult will answer and listen to you</li>
                <li>• They will believe you and take you seriously</li>
                <li>• They will help you figure out what to do</li>
                <li>• You can talk about anything that makes you feel unsafe</li>
                <li>• The call is free and confidential</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleCall}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 text-lg"
              >
                <Phone className="w-6 h-6" />
                <span>Call 116 Now - I Need Help</span>
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl transition-colors duration-200 text-lg"
              >
                Cancel - I Don't Need Help Right Now
              </button>
            </div>

            {/* Additional reassurance */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Remember: You are brave, you are important, and you deserve to feel safe. 💙
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}