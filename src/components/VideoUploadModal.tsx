import React, { useState } from 'react';
import { X, Link, Play, Video } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
}

export function VideoUploadModal({ isOpen, onClose, gameTitle }: VideoUploadModalProps) {
  const { selectedLanguage } = useAudio();
  const [videoUrl, setVideoUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoError, setVideoError] = useState('');

  if (!isOpen) return null;

  const validateVideoUrl = (url: string) => {
    // Basic URL validation and common video platforms
    const videoUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|.*\.(mp4|webm|ogg|mov|avi)).*$/i;
    return videoUrlPattern.test(url);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setVideoUrl(url);
    setVideoError('');
    
    if (url.trim()) {
      const isValid = validateVideoUrl(url);
      setIsValidUrl(isValid);
      if (!isValid) {
        setVideoError('Please enter a valid video URL (YouTube, Vimeo, or direct video link)');
      }
    } else {
      setIsValidUrl(false);
    }
  };

  const handleSaveVideo = async () => {
    if (!videoUrl.trim() || !isValidUrl) return;

    setIsLoading(true);

    // Simulate saving video link
    setTimeout(() => {
      setIsLoading(false);
      alert('Video link saved successfully!');
      onClose();
      setVideoUrl('');
      setIsValidUrl(false);
    }, 1500);
  };

  const getVideoEmbedUrl = (url: string) => {
    // Convert YouTube URLs to embed format
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Convert Vimeo URLs to embed format
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    // Return direct video URLs as-is
    return url;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl transform animate-bounce-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-gray-800">{gameTitle} - Add Video</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close video modal"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-600 mb-4">
            Add a video link for the Safe Touch Detective game. This video will be shown to children as part of their safety education.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl mb-6">
            <h4 className="font-bold text-blue-800 mb-2">Video Guidelines:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Keep videos under 5 minutes for young attention spans</li>
              <li>• Use age-appropriate language and content</li>
              <li>• Ensure good audio quality for clear understanding</li>
              <li>• Include positive, encouraging messaging</li>
              <li>• Supports YouTube, Vimeo, and direct video links</li>
            </ul>
          </div>
        </div>

        {/* Video URL Input Area */}
        <div
          className={`border-2 rounded-2xl p-6 transition-all duration-200 ${
            videoError 
              ? 'border-red-400 bg-red-50' 
              : isValidUrl 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 bg-gray-50'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Link className={`w-12 h-12 ${isValidUrl ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={handleUrlChange}
                placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none text-lg transition-colors duration-200 ${
                  videoError 
                    ? 'border-red-400 focus:border-red-500' 
                    : isValidUrl 
                      ? 'border-green-400 focus:border-green-500' 
                      : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {videoError && (
                <p className="text-red-600 text-sm mt-2">{videoError}</p>
              )}
              {isValidUrl && (
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <Video className="w-4 h-4 mr-1" />
                  Valid video URL detected
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Saving video link...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          {isValidUrl && !isLoading && (
            <button 
              onClick={handleSaveVideo}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 text-lg"
            >
              <Link className="w-6 h-6" />
              <span>Save Video Link</span>
            </button>
          )}
          
          <button 
            onClick={onClose}
            className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl transition-colors duration-200 text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Cancel'}
          </button>
        </div>

        {/* Video Preview Area */}
        {isValidUrl && videoUrl && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Video Preview
            </h4>
            {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com') ? (
              <iframe
                src={getVideoEmbedUrl(videoUrl)}
                className="w-full h-64 rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video Preview"
              />
            ) : (
              <video 
                controls 
                className="w-full max-h-64 rounded-lg"
                src={videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
      </div>
    </div>
  );
}