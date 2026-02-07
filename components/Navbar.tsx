import React, { useState, useEffect } from 'react';
import { PageView } from '../types';

interface NavbarProps {
  cartCount: number;
  onNavigate: (page: PageView) => void;
  currentPage: PageView;
  onSearch: (query: string) => void;
  searchQuery: string;
  wishlistCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onNavigate, currentPage, onSearch, searchQuery, wishlistCount = 0 }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const handleMobileNavigate = (page: PageView) => {
      onNavigate(page);
      setMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? 'glass-panel py-3' : 'bg-transparent py-4 md:py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 flex items-center justify-between h-full">
          
          {/* Mobile Menu Button */}
          <button 
              className="md:hidden p-2 -ml-2 text-gray-900 dark:text-white active:scale-95 transition-transform"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
          >
              <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          {/* Left Nav (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
              {['Shop', 'Skincare', 'Makeup'].map((item) => (
                  <button 
                      key={item}
                      onClick={() => onNavigate(item.toLowerCase() as PageView)} 
                      className="text-xs font-semibold uppercase tracking-[0.15em] hover:text-primary transition-colors text-gray-900 dark:text-white btn-squish"
                  >
                      {item}
                  </button>
              ))}
          </nav>

          {/* Center Logo */}
          <div 
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer group ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'} transition-all duration-500`}
            onClick={() => onNavigate('home')}
          >
            <span className={`material-symbols-outlined text-primary transition-all duration-500 ${scrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>spa</span>
            <h2 className={`font-serif font-semibold tracking-tight text-gray-900 dark:text-white transition-all duration-500 ${scrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
              Faceneed
            </h2>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-0">
            {/* Desktop Search */}
            <div className={`hidden md:flex items-center transition-all duration-300 ${scrolled ? 'bg-black/5 dark:bg-white/10' : 'bg-white/50 dark:bg-black/20'} rounded-full px-3 py-1.5`}>
              <span className="material-symbols-outlined text-gray-500 text-lg">search</span>
              <input 
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent border-none focus:ring-0 text-sm w-20 md:w-32 placeholder:text-gray-400 p-0 ml-2"
              />
            </div>

            {/* Mobile Search Icon */}
            <button 
              className="md:hidden p-2 text-gray-900 dark:text-white"
              onClick={() => onNavigate('shop')}
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>

            <div className="flex items-center gap-1">
              {/* Wishlist */}
              <button 
                className="btn-squish p-2 md:p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative text-gray-900 dark:text-white hidden sm:flex"
                onClick={() => onNavigate('wishlist')}
              >
                <span className={`material-symbols-outlined text-[20px] ${currentPage === 'wishlist' ? 'fill-icon text-primary' : ''}`}>favorite</span>
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button 
                className="btn-squish p-2 md:p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative text-gray-900 dark:text-white"
                onClick={() => onNavigate('cart')}
              >
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 md:top-1 md:right-1 bg-primary text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {/* Profile */}
              <button 
                  className="btn-squish p-2 md:p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-900 dark:text-white hidden sm:flex"
                  onClick={() => onNavigate('profile')}
              >
                <span className={`material-symbols-outlined text-[20px] ${currentPage === 'profile' ? 'fill-icon' : ''}`}>person</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-white dark:bg-black transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
          <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-2xl">spa</span>
                      <h2 className="font-serif font-semibold text-2xl text-gray-900 dark:text-white">Faceneed</h2>
                  </div>
                  <button 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                      <span className="material-symbols-outlined">close</span>
                  </button>
              </div>

              <div className="relative mb-8">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                  <input 
                      value={searchQuery}
                      onChange={(e) => onSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-full py-4 pl-12 pr-4 text-base focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  />
              </div>

              <nav className="flex flex-col gap-6 overflow-y-auto">
                  {['Home', 'Shop', 'Skincare', 'Makeup', 'Wishlist', 'Profile'].map((item) => (
                      <button 
                          key={item}
                          onClick={() => handleMobileNavigate(item.toLowerCase() as PageView)}
                          className="text-3xl font-serif text-left text-gray-900 dark:text-white hover:text-primary transition-colors flex justify-between items-center group py-2"
                      >
                          {item}
                          <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-primary">arrow_forward</span>
                      </button>
                  ))}
              </nav>

              <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <button onClick={() => handleMobileNavigate('about')}>About Us</button>
                  <button>Support</button>
                  <button>Instagram</button>
              </div>
          </div>
      </div>
    </>
  );
};

export default Navbar;