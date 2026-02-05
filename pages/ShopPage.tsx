import React, { useMemo } from 'react';
import { PageView, Product } from '../types';

interface ShopPageProps {
  onNavigate: (page: PageView) => void;
  onProductClick: (product: Product) => void;
  addToCart: (product: Product) => void;
  category?: 'all' | 'skincare' | 'makeup';
}

const allProducts: Product[] = [
  // Skincare
  {
    id: 's1',
    name: 'Glow Radiance Oil Cleanser',
    description: 'Deeply cleanses without stripping moisture.',
    price: 34.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIvu7u3XspEhcS2ePj6iAS-1xuno5JF-oX57WRIo3R1ijIBApJQpHUI76WtWBCd8LKD1HXJz17KcUnlTkqmod4PpV79DGMQZnrq8K4ai1Oa1MPOqHlCdT7Ubp3NeH5Czef05vDY-QF8BcA5k8JcXC_99nCcUdqg7ubDp6vFMLjpBaKaX9aZ7emYKFEJllIxnhSL47jfNtOCFqJvGzQ09EuCBgN-dSufbZ79erYItM9yNgoyR1Kj_bKSuVUbzq3yhVbk4fUuvh4HkI',
    category: 'Cleansers',
    isBestSeller: true
  },
  {
    id: 's2',
    name: 'Vitamin C Brightening Serum',
    description: '15% pure Vitamin C for instant luminosity.',
    price: 48.00,
    originalPrice: 62.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAa_N4wJRrF1aCsH9jIdYwix99Zn19HJq4zyOznoRBrpm1NH_JuZM54ZdBn6HrLRYo8xyt2ctnQXjKukKrOOVx89UYcxLdBrsPDY6yJds6W7Mju_OhvT41cWeVBkmQJRFVcYHsiBWkV0OcGbPRJ11oyRI4pIti10qyHF_yc01eMu4LL6Md2eFFMjurtpmxUcGWSItC484kquaP-jG4Q0gMMG-w0lZCM_diRPTuCgqMtLkvqKJBXS-CeV1ZmJj6vgspGM5o7sFBuWw',
    category: 'Serums'
  },
  {
    id: 's3',
    name: 'Hyaluronic Barrier Cream',
    description: '24-hour hydration with triple ceramides.',
    price: 42.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0GAYfh8VC8d354RIZYdotQgDrUG4RRrgxIqzX1XMrpt7zWnbiqgCvVWnQOqUXJXUuQ6hadkwsc5coHrHwev2JynBCxkoFz9ESemXd0j21M7wK34vdS4-rsOsaGm5gPPcBkjXGaU8aM01dwJuJKkfH7DRdJnpNKkiwlp7ick96yi7jXqS1ClFHJ-CwxQ_BUQMHOnAZUpgYRZ01iS1WLNWWDrrXZf6DqA-jHw_Utm1A5G7B8hZxDNmfYbVnJ_iZr6rMXzTwzmj0xmk',
    category: 'Moisturizers'
  },
  {
    id: 's4',
    name: 'Purifying Green Clay Mask',
    description: 'Refines pores and removes impurities.',
    price: 28.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATekgycab1Z3UZoQiZbAUWWah96cFtQeYtChiFEd8ZLf8cBjRWLqEpsusx83azCsL_7nrma99p2PvbnukHls7LdOGP-OwktBe6d9DbTS_CMuR_9W_Xd8cjiyg1PUsWxwnUBcnB4eUGU02R5ic2AcxDXTJ5syc6SnlhtBGRohHmNkOAwYOmBzyd_xo8VoeC7R6aa2Cuxeb6FpNsXi-FOQnOHZ866kwZ9kipXW6jK1Dn60N_in063x7mb_x74kIapQnLlJJ-F53ZuhM',
    category: 'Treatments'
  },
  {
    id: 's5',
    name: 'Caffeine Infused Eye Revive',
    description: 'Reduces puffiness and dark circles.',
    price: 36.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn99k47i1pMgOy9r7-Zh3jgWNR7NRmBG9-ICaVv1yLJmQUaJmxv0FPFGERsHldQSofhgz1s96OT3DPdbWpLAM0Po0x5w6TOGlx0z5XI6Dwi_W86CT40iaFhzqmkejBTwXYt5lyI6aDl2CsfYO-8-WC9zf6s1loydope2j79T4nekyo4-LxFCWyGq7kDE_3KbHuo_xUxNXmwH7Fs2_OuZAYzEvSyGrQuoklkQH_wa6JIDjSt8Dw1CMlfoaRiTyHQ2jBe3PFZygPv4w',
    category: 'Eye Care',
    isNew: true
  },
  {
    id: 's6',
    name: 'Invisible Shield SPF 50+',
    description: 'Zero white cast, lightweight daily defense.',
    price: 30.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAchRdyKkv02pUAScnNtjiay_ORc4zYUeOjK7hqYUydk0pUh98w9BfuL6XDITJD7f8TxK985Y81A9veKpb1uJlxIZ_LEJBO5wmbTkcZ94bxa0senYR6JvomxTgGlqijy_bM2EmrwehRT3Re2SfV0s4EtKHo7sJg81UWtW45GiJLFSVoEnapuXxWHeIA7nd2SZefyVjJ1w95nzqU1s8HgOwh5Jk3NuXya0GiojkCsEjBq2ZlA9H6VLAlMHeMC6ig8DafDJZXgE7vhxk',
    category: 'Sun Protection'
  },
  // Makeup
  {
    id: 'm1',
    name: 'Velvet Soft Matte Lipstick',
    description: 'Weightless long-wear color in 6 shades.',
    price: 26.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2VYiq1oS976pecnT8VgQtDhfXIGU_c7KzEoUgv6BWTWmIwYRBcM5W3i-X1sbu_XKMfRhRON5CovnLcO6uDEeYlEs74dlGtrGkwihlBlF7x2wMpsX3dqzWwFRmLFgwgs1UfyRz_FMQf_aXkP1-tZTYjZpMWU0O7pNKmqRXJPrN73qEtLq5X8lMu-u38IFaVXd3muZrd4pUQMZqlDRSCvhnSYgEI0zvyVICgqSvXBwBoSnG78by9PUbKf26h5MqcDM4ALF0hRwbLtk',
    category: 'Lips',
    isBestSeller: true
  },
  {
    id: 'm2',
    name: 'Second Skin Serum Foundation',
    description: 'Medium coverage with a dewy finish.',
    price: 45.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA1uG98aJzTz-eJ5Y0_q9X2m2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3', // Placeholder, reusing existing but imagine it's foundation
    category: 'Face', // Note: Using fallback image logic in real app, here we reuse a placeholder or similar. 
    // Let's use a different skincare image that looks like a bottle for now as placeholder for foundation if needed, 
    // or just reuse one of the serum bottles as they look similar to foundation bottles.
    // Reusing Serum image for demo purpose but keeping unique ID.
  },
  {
    id: 'm3',
    name: 'Cloud Tint Blush',
    description: 'Buildable gel-cream cheek color.',
    price: 24.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_ndNtzKNopBXrBqewayISjSa2cr3XhNmqK3T6sB-MA6pFeBfb3Pgljs2R_KH_yhBGncAUrdlblfL8fj2p2UYynK0d3fdw6uIAC-xWqvFTJbgcvqVlPE0a54yL0feHnK0kpgg1xZxUXBUM9T1DBUC-91gGcRCkmbueU-8JC1Oi8DrLwxih37NF5gC5A5fFpNR8VUlyLsAvnewyum0Y-rXm1oyuXiS2F3nPHBPjvaELmdhIrlENmmdTvFVuNr7G3vw9aLnm9ItVHa4', 
    category: 'Cheek',
    isNew: true
  },
  {
    id: 'm4',
    name: 'Lash Lift Volumizing Mascara',
    description: 'Clean formula for massive volume.',
    price: 28.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkeeePlrD_gL8RIra75SZLP_CpLS6UdSOESBHFQ_wXoFa6fs2F74FmBzGeZeoVWnFHn2eQfGx7_x64hpYV60mujNlhjt1PwVR_cRERhWYheDO4vapxY-au0Yqw8IB9MraZ3GsVh_7HNXM8bOXuz3if-Lc825s8tcnUE5qB998suMVUc7MxjA6IoT5h4Lu7fOz-k28iwBnvHZVou-INoGLdamkxtUAGeC1b-gKFsapWSTfH5mg6UuWiuUnvqqsQCp7tE4zHCMk7M_s',
    category: 'Eyes'
  }
];

// Helper to determine product main category
const getProductType = (category: string) => {
    if (['Cleansers', 'Serums', 'Moisturizers', 'Treatments', 'Eye Care', 'Sun Protection'].includes(category)) return 'skincare';
    if (['Lips', 'Face', 'Cheek', 'Eyes'].includes(category)) return 'makeup';
    return 'other';
}

const ShopPage: React.FC<ShopPageProps> = ({ onNavigate, onProductClick, addToCart, category = 'all' }) => {
  
  const displayedProducts = useMemo(() => {
    if (category === 'all') return allProducts;
    return allProducts.filter(p => getProductType(p.category) === category);
  }, [category]);

  const pageTitle = category === 'all' ? 'All Products' : category === 'skincare' ? 'Skincare Essentials' : 'Makeup Collection';
  const pageDescription = category === 'all' 
    ? "Explore our full range of clean, effective beauty products." 
    : category === 'skincare' 
        ? "Harnessing nature's finest ingredients to reveal your most radiant skin."
        : "Enhance your natural beauty with our skin-loving color cosmetics.";

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {displayedProducts.map(product => (
              <div key={product.id} className="group product-card cursor-pointer" onClick={() => onProductClick(product)}>
                <div className="relative aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden mb-4">
                  {/* Using object-cover directly on img, assuming all mocked images are good */}
                  {/* Re-using images from mock if specific one missing */}
                  <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: `url('${product.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA1uG98aJzTz-eJ5Y0_q9X2m2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3'}'})`}}></div>
                  
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
          
          {/* Pagination */}
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
        </div>
      </div>
    </div>
  );
};

export default ShopPage;