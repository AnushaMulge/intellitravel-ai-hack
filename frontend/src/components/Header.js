import React from 'react';
import { Button } from './ui/button';
import { Menu, Search, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative z-50">
      <nav className="backdrop-blur-md bg-amber-100/30 border-b border-amber-200/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IT</span>
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-amber-700 to-red-700 bg-clip-text text-transparent">
              IntelliTravel AI
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-amber-800 hover:text-red-700 transition-colors font-medium">
              Home
            </a>
            <a href="#destinations" className="text-amber-800 hover:text-red-700 transition-colors font-medium">
              Destinations
            </a>
            <a href="#features" className="text-amber-800 hover:text-red-700 transition-colors font-medium">
              About
            </a>
            <a href="#contact" className="text-amber-800 hover:text-red-700 transition-colors font-medium">
              Contact
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-amber-700 hover:text-red-700 hover:bg-amber-100">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            
            <Button variant="outline" size="sm" className="hidden sm:flex border-amber-300 text-amber-700 hover:bg-amber-100">
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            
            <Button size="sm" className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white border-0">
              Sign Up
            </Button>
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden text-amber-700">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
