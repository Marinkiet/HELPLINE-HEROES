import React, { useState } from 'react';
import { X, Upload, Play, FileVideo } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
}

export function VideoUploadModal({ isOpen, onClose, gameTitle }: VideoUploadModalProps) {
  const { selectedLanguage } = useAudio();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid video file.');
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid video file.');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          alert('Video uploaded successfully!');
          onClose();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl transform animate-bounce-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-gray-800">{gameTitle} - Video Upload</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close video upload"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-600 mb-4">
            Upload a video for the Safe Touch Detective game. This video will be shown to children as part of their safety education.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl mb-6">
            <h4 className="font-bold text-blue-800 mb-2">Video Guidelines:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Keep videos under 5 minutes for young attention spans</li>
              <li>• Use age-appropriate language and content</li>
              <li>• Ensure good audio quality for clear understanding</li>
              <li>• Include positive, encouraging messaging</li>
            </ul>
          </div>
        </div>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : selectedFile 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <FileVideo className="w-16 h-16 text-green-600 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-green-800">{selectedFile.name}</h3>
                <p className="text-green-600">{formatFileSize(selectedFile.size)}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Duration: {selectedFile.type} • Ready to upload
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-16 h-16 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  Drop your video here or click to browse
                </h3>
                <p className="text-gray-500">
                  Supports MP4, MOV, AVI, and other video formats
                </p>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl cursor-pointer transition-colors duration-200"
              >
                Choose Video File
              </label>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Uploading...</span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          {selectedFile && !isUploading && (
            <button 
              onClick={handleUpload}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 text-lg"
            >
              <Upload className="w-6 h-6" />
              <span>Upload Video</span>
            </button>
          )}
          
          <button 
            onClick={onClose}
            className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl transition-colors duration-200 text-lg"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Cancel'}
          </button>
        </div>

        {/* Video Preview Area */}
        {selectedFile && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Video Preview
            </h4>
            <video 
              controls 
              className="w-full max-h-64 rounded-lg"
              src={URL.createObjectURL(selectedFile)}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}