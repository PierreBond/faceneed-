import React, { useMemo } from 'react';
import { PageView, Product } from '../types';

interface WishlistPageProps {
  wishlist: string[];
  products: Product[];
  toggleWishlist: (id: string) => void;
  addToCart: (product: Product) => void;
  onNavigate: (page: PageView) => void;
  onProductClick: (product: Product) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ 
  wishlist, 
  products, 
  toggleWishlist, 
  addToCart, 
  onNavigate,
  onProductClick
}) => {
  const wishlistItems = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 animate-fadeIn min-h-[60vh]">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white mb-4">Your Wishlist</h1>
        <p className="text-gray-500 dark:text-gray-400">Save your favorites for later.</p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistItems.map(product => (
            <div 
              key={product.id} 
              className="group flex flex-col gap-4 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01]" 
              onClick={() => onProductClick(product)}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm transition-all duration-500 group-hover:shadow-2xl">
                <div 
                  className="w-full h-full bg-center bg-cover transition-transform duration-1000 group-hover:scale-105" 
                  style={{ backgroundImage: `url("${product.image}")` }}
                ></div>
                
                {/* Remove Button */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-black/70 hover:bg-red-50 dark:hover:bg-red-900/20 group/btn transition-colors"
                    title="Remove from wishlist"
                >
                    <span className="material-symbols-outlined text-lg text-red-500 fill-icon">close</span>
                </button>

                 {/* Quick Add Button */}
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-background-dark/95 py-3 rounded-full font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-primary hover:text-white text-gray-900 dark:text-white shadow-lg text-xs uppercase tracking-widest"
                >
                  Add to Bag
                </button>
              </div>
              
              <div>
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-medium font-serif text-gray-900 dark:text-white group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-primary font-bold">${product.price.toFixed(2)}</p>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-3xl text-gray-400">favorite</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-center">Heart items you love to save them here for later.</p>
          <button 
            onClick={() => onNavigate('shop')}
            className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;