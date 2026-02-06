import React, { useMemo } from 'react';
import { PageView, Product } from '../types';

interface ShopPageProps {
  onNavigate: (page: PageView) => void;
  onProductClick: (product: Product) => void;
  addToCart: (product: Product) => void;
  category?: 'all' | 'skincare' | 'makeup';
  searchQuery?: string;
  products: Product[];
  wishlist: string[];
  toggleWishlist: (id: string) => void;
}

// Helper to determine product main category
const getProductType = (category: string) => {
    if (['Cleansers', 'Serums', 'Moisturizers', 'Treatments', 'Eye Care', 'Sun Protection'].includes(category)) return 'skincare';
    if (['Lips', 'Face', 'Cheek', 'Eyes'].includes(category)) return 'makeup';
    return 'other';
}

const ShopPage: React.FC<ShopPageProps> = ({ 
    onNavigate, 
    onProductClick, 
    addToCart, 
    category = 'all', 
    searchQuery = '', 
    products, 
    wishlist, 
    toggleWishlist 
}) => {
  
  const displayedProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by Category
    if (category !== 'all') {
      filtered = filtered.filter(p => getProductType(p.category) === category);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
    }
    
    return filtered;
  }, [category, searchQuery, products]);

  let pageTitle = '';
  let pageDescription = '';

  if (searchQuery) {
    pageTitle = `Results for "${searchQuery}"`;
    pageDescription = `Showing results for your search.`;
  } else {
    pageTitle = category === 'all' ? 'All Products' : category === 'skincare' ? 'Skincare Essentials' : 'Makeup Collection';
    pageDescription = category === 'all' 
      ? "Explore our full range of clean, effective beauty products." 
      : category === 'skincare' 
          ? "Harnessing nature's finest ingredients to reveal your most radiant skin."
          : "Enhance your natural beauty with our skin-loving color cosmetics.";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Breadcrumbs & Title */}
      <div className="mb-8">
        <nav className="flex text-sm text-slate-500 mb-4 gap-2">
          <button onClick={() => onNavigate('home')} className="hover:text-primary">Home</button>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium capitalize">{category === 'all' ? 'Shop' : category}</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2 font-display">{pageTitle}</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">{pageDescription}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500">Showing {displayedProducts.length} products</span>
            <select className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary">
              <option>Recommended</option>
              <option>Newest Arrivals</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-4">Filters</h3>
              {/* Filter Group: Category (Dynamic based on page) */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                <button className="flex items-center justify-between w-full text-left font-semibold text-slate-800 dark:text-slate-200 py-2">
                  <span>Category</span>
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
                <div className="mt-2 space-y-2">
                  {(category === 'skincare' || category === 'all' 
                    ? ['Cleansers', 'Serums', 'Moisturizers', 'Treatments', 'Eye Care', 'Sun Protection'] 
                    : []).concat(
                        category === 'makeup' || category === 'all' 
                        ? ['Face', 'Lips', 'Cheek', 'Eyes'] 
                        : []
                    ).map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary w-5 h-5"/>
                      <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
               {/* Filter Group: Price Range */}
               <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                <button className="flex items-center justify-between w-full text-left font-semibold text-slate-800 dark:text-slate-200 py-2">
                  <span>Price Range</span>
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
                <div className="mt-4">
                  <input type="range" className="w-full accent-primary" />
                  <div className="flex items-center justify-between mt-2 text-xs font-bold text-slate-500">
                    <span>$0</span>
                    <span>$200+</span>
                  </div>
                </div>
              </div>
            </div>
             {/* Promo Banner in Sidebar */}
             <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-xl border border-primary/20">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Join Our Rewards</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">Earn points for every purchase!</p>
              <button className="w-full bg-primary text-white text-sm font-bold py-2 rounded-lg hover:bg-primary/90 transition-colors">Learn More</button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {displayedProducts.map(product => (
                <div key={product.id} className="group product-card cursor-pointer" onClick={() => onProductClick(product)}>
                  <div className="relative aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden mb-4">
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: `url('${product.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA1uG98aJzTz-eJ5Y0_q9X2m2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3'}'})`}}></div>
                    
                    {/* Wishlist Button */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                        }}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black transition-colors"
                    >
                         <span className={`material-symbols-outlined text-xl ${wishlist.includes(product.id) ? 'fill-icon text-primary' : 'text-gray-600 dark:text-gray-300'}`}>favorite</span>
                    </button>

                    {/* Out of Stock Overlay */}
                    {product.inStock === false && (
                      <div className="absolute inset-0 bg-white/70 dark:bg-black/60 flex items-center justify-center">
                        <span className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 font-bold uppercase text-xs tracking-widest">Out of Stock</span>
                      </div>
                    )}

                    {product.inStock !== false && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="quick-buy-btn opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 py-3 rounded-lg text-sm font-bold shadow-lg transition-all duration-300 hover:bg-primary hover:text-white flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                        Quick Buy
                      </button>
                    )}
                    
                    {product.isBestSeller && (
                      <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Best Seller</div>
                    )}
                    {product.isNew && (
                      <div className="absolute top-4 left-4 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">New</div>
                    )}
                  </div>
                  <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">{product.category}</p>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 line-clamp-1">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-slate-400 line-through">${product.originalPrice.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">search_off</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</p>
              <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
          
          {/* Pagination - Only show if we have products */}
          {displayedProducts.length > 0 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-all">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;