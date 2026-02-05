import React from 'react';
import { PageView } from '../types';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 py-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate('home')}>
              <span className="material-symbols-outlined text-primary text-2xl">spa</span>
              <h2 className="text-xl font-serif font-bold tracking-tight text-gray-900 dark:text-white">Faceneed</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
              The ultimate destination for modern, clean skincare. Our mission is to enhance your natural beauty with pure, effective ingredients.
            </p>
            <div className="flex gap-4">
              <a className="text-gray-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
              <a className="text-gray-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">camera</span></a>
              <a className="text-gray-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Shop</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400">
              <li><button onClick={() => onNavigate('shop')} className="hover:text-primary text-left">All Products</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-primary text-left">Best Sellers</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-primary text-left">New Arrivals</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-primary text-left">Gift Cards</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Support</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400">
              <li><a className="hover:text-primary" href="#">Track Order</a></li>
              <li><a className="hover:text-primary" href="#">Shipping Info</a></li>
              <li><a className="hover:text-primary" href="#">Returns</a></li>
              <li><a className="hover:text-primary" href="#">Contact Us</a></li>
            </ul>
          </div>
          <div className="col-span-2">
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Our Store</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">123 Beauty Lane, Glow District</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">New York, NY 10001</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">hello@faceneed.com</p>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between gap-6">
          <p className="text-xs text-gray-400">© 2024 Faceneed Cosmetics. All rights reserved.</p>
          <div className="flex gap-8 text-xs text-gray-400">
            <a className="hover:text-primary" href="#">Privacy Policy</a>
            <a className="hover:text-primary" href="#">Terms of Service</a>
            <a className="hover:text-primary" href="#">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;