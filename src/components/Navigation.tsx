import React from 'react';
import { Shield, Menu, Home, Phone, BookOpen } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-blue-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Helpline Heroes
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#home" className="flex items-center space-x-2 text-white font-bold hover:text-yellow-300 transition-colors duration-200">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </a>
            <a href="#help" className="flex items-center space-x-2 text-white font-bold hover:text-yellow-300 transition-colors duration-200">
              <Phone className="w-5 h-5" />
              <span>Get Help</span>
            </a>
            <a href="#resources" className="flex items-center space-x-2 text-white font-bold hover:text-yellow-300 transition-colors duration-200">
              <BookOpen className="w-5 h-5" />
              <span>Resources</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white hover:text-yellow-300 transition-colors duration-200">
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}