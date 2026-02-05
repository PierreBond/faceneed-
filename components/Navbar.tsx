import React from 'react';
import { PageView } from '../types';

interface NavbarProps {
  cartCount: number;
  onNavigate: (page: PageView) => void;
  currentPage: PageView;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onNavigate, currentPage }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between whitespace-nowrap">
        <div className="flex items-center gap-12">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => onNavigate('home')}
          >
            <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">spa</span>
            <h2 className={`text-2xl font-bold tracking-tight text-gray-900 dark:text-white ${currentPage === 'product' ? 'font-newsreader' : 'font-serif'}`}>Faceneed</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button 
                onClick={() => onNavigate('shop')} 
                className={`text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest ${currentPage === 'shop' ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}
            >
                Shop All
            </button>
            <button 
                onClick={() => onNavigate('skincare')} 
                className={`text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest ${currentPage === 'skincare' ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}
            >
                Skincare
            </button>
            <button 
                onClick={() => onNavigate('makeup')} 
                className={`text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest ${currentPage === 'makeup' ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}
            >
                Makeup
            </button>
            <button 
                onClick={() => onNavigate('about')} 
                className={`text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest ${currentPage === 'about' ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}
            >
                About
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <label className="hidden lg:flex items-center relative min-w-48 group">
            <span className="material-symbols-outlined absolute left-3 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
            <input 
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-500" 
              placeholder="Search products..." 
              type="text"
            />
          </label>
          <div className="flex gap-4">
            <button 
              className="flex items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
              onClick={() => onNavigate('cart')}
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
                className="flex items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-900 dark:text-white"
                onClick={() => onNavigate('profile')}
            >
              <span className={`material-symbols-outlined ${currentPage === 'profile' ? 'fill-icon' : ''}`}>person</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;