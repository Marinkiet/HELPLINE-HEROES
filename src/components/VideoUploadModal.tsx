import React, { useState } from 'react';
import { X, Play, Volume2, Maximize } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useEngagement } from '../contexts/EngagementContext';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  gameId?: string;
}

export function VideoUploadModal({ isOpen, onClose, gameTitle, gameId }: VideoUploadModalProps) {
  const { selectedLanguage } = useAudio();
  const { trackGameStart, trackGameEnd, trackInteraction } = useEngagement();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  if (!isOpen) return null;

  // Get video content based on game ID
  const getVideoContent = () => {
    switch (gameId) {
      case '1': // Safe Touch Detective
        return {
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1&modestbranding=1&rel=0",
          title: "🕵️ Safe Touch Detective: Good Touch vs Bad Touch",
          description: "Learn the difference between safe touches and unsafe touches to keep your body safe!",
          duration: "4:32",
          infoTitle: "Safe Touch Education Video",
          infoDescription: "This educational video teaches children about the difference between good touches and bad touches. Learn about private parts, trusted adults, and how to say \"NO\" to unsafe touches."
        };
      case '2': // Trusted Heroes Circle
        return {
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1&modestbranding=1&rel=0",
          title: "💖 Trusted Heroes Circle: Who Can You Trust?",
          description: "Meet your trusted heroes and learn who you can talk to when you need help!",
          duration: "3:45",
          infoTitle: "Trusted Adults Education Video",
          infoDescription: "This educational video helps children identify trusted adults in their lives. Learn about parents, teachers, doctors, and other safe adults who can help you."
        };
      case '3': // Brave Voice
        return {
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1&modestbranding=1&rel=0",
          title: "🎤 Brave Voice: Speaking Up for Safety",
          description: "Learn how to use your brave voice to stay safe and help others!",
          duration: "4:15",
          infoTitle: "Brave Voice Education Video",
          infoDescription: "This educational video teaches children how to use their voice to speak up when something doesn't feel right. Learn when and how to tell trusted adults about unsafe situations."
        };
      default:
        return {
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1&modestbranding=1&rel=0",
          title: gameTitle,
          description: "Educational safety video for children.",
          duration: "4:00",
          infoTitle: "Safety Education Video",
          infoDescription: "This educational video teaches important safety concepts to help keep children safe."
        };
    }
  };

  const videoContent = getVideoContent();
  
  const handlePlayClick = () => {
    setIsPlaying(true);
    setShowControls(false);
    
    // Track video start
    if (gameId) {
      trackGameStart(gameId, gameTitle);
      trackInteraction('video_play', {
        game_id: gameId,
        game_title: gameTitle
      });
    }
  };

  const handleClose = () => {
    setIsPlaying(false);
    setShowControls(true);
    
    // Track video completion (assuming they watched it if they close)
    if (gameId && isPlaying) {
      trackGameEnd(50, true); // 50 points for watching video
      trackInteraction('video_complete', {
        game_id: gameId,
        game_title: gameTitle
      });
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] shadow-2xl transform animate-bounce-in overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-gray-800">{gameTitle}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close video modal"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
          {!isPlaying ? (
            // Video Thumbnail/Preview with Play Button
            <div className="relative w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              {/* Thumbnail Background */}
              <div className="absolute inset-0 bg-black/20"></div>
              
              {/* Play Button */}
              <button
                onClick={handlePlayClick}
                className="relative z-10 bg-white/90 hover:bg-white rounded-full p-8 shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 group"
                aria-label="Play video"
              >
                <Play className="w-16 h-16 text-blue-600 ml-2 group-hover:text-blue-700" />
              </button>
              
              {/* Video Title Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-2xl font-bold mb-2">
                  {videoContent.title}
                </h3>
                <p className="text-white/90 text-lg">
                  {videoContent.description}
                </p>
              </div>
              
              {/* Duration Badge */}
              <div className="absolute top-6 right-6 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ⏱️ {videoContent.duration}
              </div>
            </div>
          ) : (
            // Actual Video Player
            <div className="w-full h-full">
              <iframe
                src={videoContent.url}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={gameTitle}
              />
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
          <div className="flex items-center mb-2">
            <Volume2 className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-bold text-blue-800">{videoContent.infoTitle}</h4>
          </div>
          <p className="text-blue-700">
            {videoContent.infoDescription}
          </p>
        </div>
      </div>
    </div>
  );
}