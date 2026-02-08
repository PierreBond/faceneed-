import React from 'react';
import { PageView, Product } from '../types';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  onProductClick: (product: Product) => void;
  addToCart: (product: Product) => void;
  products: Product[];
  wishlist?: string[];
  toggleWishlist?: (id: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onProductClick, products, wishlist = [], toggleWishlist }) => {
  // Select specific assets for the bento grid
  const heroProduct = products.find(p => p.id === 's2') || products[1];
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 2);

  const marqueeItems = [
    { serif: "Clean", sans: "Formulas" },
    { serif: "Potent", sans: "Actives" },
    { serif: "Sustainable", sans: "Luxury" },
    { serif: "Sensory", sans: "Rituals" },
    { serif: "Clinical", sans: "Results" },
    { serif: "Cruelty", sans: "Free" }
  ];

  return (
    <div className="pt-28 md:pt-36 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto space-y-8 md:space-y-12">
      
      {/* SECTION 1: Antigravity Hero */}
      <section className="relative rounded-4xl md:rounded-5xl overflow-hidden bg-[#F3F1EF] dark:bg-[#1A1A1A] ambient-shadow min-h-[85vh] flex items-center">
         {/* Background Subtle Gradient */}
         <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-primary/5 pointer-events-none"></div>

         <div className="w-full h-full grid lg:grid-cols-2 gap-12 items-center p-8 md:p-16 relative z-10">
            {/* Typography */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 order-2 lg:order-1">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm animate-slideUp">
                   <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                   <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-600 dark:text-gray-300">The 2026 Collection</span>
                </div>
                
                <h1 className="animate-slideUp delay-100 font-serif font-medium text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-gray-900 dark:text-white tracking-tighter">
                   Elevate <br/>
                   <span className="italic font-light text-primary">Your Ritual.</span>
                </h1>

                <p className="animate-slideUp delay-200 text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-md font-light leading-relaxed">
                   Experience the intersection of clinical precision and botanical soul. Skincare designed for the modern minimalist.
                </p>

                <div className="animate-slideUp delay-300 pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button 
                        onClick={() => onNavigate('shop')}
                        className="btn-squish bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs"
                    >
                        Shop The Collection
                    </button>
                    <button 
                        onClick={() => onNavigate('about')}
                        className="btn-squish border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                        Our Philosophy
                    </button>
                </div>
            </div>

            {/* Antigravity Asset */}
            <div className="relative h-[50vh] lg:h-full w-full flex items-center justify-center order-1 lg:order-2">
                 {/* Decorative Circle */}
                 <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-gray-900/5 dark:border-white/5 animate-[spin_60s_linear_infinite]"></div>
                 <div className="absolute w-[280px] h-[280px] md:w-[480px] md:h-[480px] rounded-full border border-gray-900/5 dark:border-white/5 animate-[spin_40s_linear_infinite_reverse]"></div>
                 
                 {/* Floating Image */}
                 <img 
                    src={heroProduct.image} 
                    alt="Hero Product" 
                    className="relative z-10 w-auto h-[80%] max-h-[600px] object-contain drop-shadow-2xl animate-float"
                    style={{ filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.15))' }}
                 />
            </div>
         </div>
      </section>

      {/* SECTION 2: Bento Grid 2.0 */}
      <section className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-3 gap-4 md:gap-6 min-h-[1200px] md:min-h-[900px]">
          
          {/* Card 1: Feature Product (Large) */}
          <div 
            onClick={() => onProductClick(heroProduct)}
            className="group md:col-span-2 md:row-span-2 rounded-4xl bg-white dark:bg-[#1E1E1E] ambient-shadow relative overflow-hidden cursor-pointer border border-black/5 dark:border-white/5"
          >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-90"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAAa_N4wJRrF1aCsH9jIdYwix99Zn19HJq4zyOznoRBrpm1NH_JuZM54ZdBn6HrLRYo8xyt2ctnQXjKukKrOOVx89UYcxLdBrsPDY6yJds6W7Mju_OhvT41cWeVBkmQJRFVcYHsiBWkV0OcGbPRJ11oyRI4pIti10qyHF_yc01eMu4LL6Md2eFFMjurtpmxUcGWSItC484kquaP-jG4Q0gMMG-w0lZCM_diRPTuCgqMtLkvqKJBXS-CeV1ZmJj6vgspGM5o7sFBuWw")' }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10 text-white">
                  <div className="bg-white/20 backdrop-blur-md inline-block px-3 py-1 rounded-full mb-4 border border-white/20">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Iconic</span>
                  </div>
                  <h3 className="text-4xl font-serif mb-2">{heroProduct.name}</h3>
                  <p className="text-white/80 font-light max-w-sm text-sm line-clamp-2 mb-6">{heroProduct.description}</p>
                  <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
                      Shop Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
              </div>
          </div>

          {/* Card 2: Skincare Category */}
          <div 
            onClick={() => onNavigate('skincare')}
            className="group md:col-span-1 md:row-span-1 rounded-4xl bg-[#F0EEEB] dark:bg-[#252525] relative overflow-hidden cursor-pointer border border-black/5 dark:border-white/5 btn-squish"
          >
             <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-9xl">water_drop</span>
             </div>
             <div className="absolute inset-0 flex flex-col justify-between p-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</span>
                <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-serif text-gray-900 dark:text-white">Skincare</h3>
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-black flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">arrow_outward</span>
                    </div>
                </div>
             </div>
          </div>

          {/* Card 3: Makeup Category */}
          <div 
            onClick={() => onNavigate('makeup')}
            className="group md:col-span-1 md:row-span-1 rounded-4xl bg-[#EBE6E4] dark:bg-[#2A2A2A] relative overflow-hidden cursor-pointer border border-black/5 dark:border-white/5 btn-squish"
          >
             <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-9xl">brush</span>
             </div>
             <div className="absolute inset-0 flex flex-col justify-between p-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</span>
                <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-serif text-gray-900 dark:text-white">Makeup</h3>
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-black flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">arrow_outward</span>
                    </div>
                </div>
             </div>
          </div>

          {/* Card 4: Best Seller List (Vertical) */}
          <div className="md:col-span-1 md:row-span-2 rounded-4xl bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/5 p-8 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-serif text-gray-900 dark:text-white">Trending</h3>
                  <button onClick={() => onNavigate('shop')} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary">View All</button>
              </div>
              <div className="flex-1 flex flex-col gap-6">
                  {bestSellers.map((product) => (
                      <div key={product.id} className="group flex gap-4 cursor-pointer" onClick={() => onProductClick(product)}>
                          <div className="w-16 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                              <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name}/>
                          </div>
                          <div className="flex flex-col justify-center">
                              <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{product.name}</p>
                              <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                              <p className="text-xs font-bold text-gray-900 dark:text-white">${product.price}</p>
                          </div>
                      </div>
                  ))}
                  
                  {/* Mini CTA Card inside list */}
                  <div className="mt-auto bg-primary/5 rounded-2xl p-4 text-center">
                      <p className="text-xs font-bold text-primary mb-2">Free Shipping on $50+</p>
                      <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-2/3"></div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Card 5: Brand Value (Cruelty Free) */}
          <div className="group md:col-span-1 md:row-span-1 rounded-4xl bg-[#FDFBF7] dark:bg-[#222] border border-black/5 dark:border-white/5 p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-primary/20 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-black shadow-sm flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">cruelty_free</span>
              </div>
              <div>
                  <h4 className="font-serif text-lg text-gray-900 dark:text-white">Cruelty Free</h4>
                  <p className="text-xs text-gray-500 mt-1">Certified Ethical</p>
              </div>
          </div>

          {/* Card 6: Brand Value (Organic) */}
          <div className="group md:col-span-1 md:row-span-1 rounded-4xl bg-[#FDFBF7] dark:bg-[#222] border border-black/5 dark:border-white/5 p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-primary/20 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-black shadow-sm flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">eco</span>
              </div>
              <div>
                  <h4 className="font-serif text-lg text-gray-900 dark:text-white">Organic</h4>
                  <p className="text-xs text-gray-500 mt-1">100% Plant Based</p>
              </div>
          </div>

           {/* Card 7: Newsletter (Wide) */}
           <div className="md:col-span-2 md:row-span-1 rounded-4xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
               {/* Decorative Blur */}
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary rounded-full blur-[80px] opacity-30"></div>
               
               <div className="relative z-10 text-center md:text-left">
                   <h3 className="text-3xl font-serif mb-2">The Glow Club</h3>
                   <p className="text-white/70 dark:text-black/70 text-sm max-w-xs font-light">Join 50,000+ minimalists. Get 15% off your first ritual.</p>
               </div>
               <div className="relative z-10 w-full md:w-auto flex-1 max-w-sm">
                   <div className="flex gap-2 bg-white/10 dark:bg-black/5 p-1.5 rounded-full border border-white/10 dark:border-black/10 backdrop-blur-sm">
                       <input 
                          type="email" 
                          placeholder="Email Address" 
                          className="bg-transparent border-none text-white dark:text-black placeholder:text-white/50 dark:placeholder:text-black/50 text-sm flex-1 px-4 focus:ring-0"
                        />
                       <button className="bg-white dark:bg-black text-black dark:text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">Join</button>
                   </div>
               </div>
           </div>

      </section>

      {/* SECTION 1.5: Minimalist Infinite Marquee */}
      <div className="relative border-y border-gray-900/5 dark:border-white/5 bg-transparent py-4 -mx-4 md:-mx-8 overflow-hidden hover-pause z-20">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#FAFAF9] dark:from-[#121212] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#FAFAF9] dark:from-[#121212] to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex w-max animate-marquee">
              {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center shrink-0">
                      {[...marqueeItems].map((item, j) => (
                          <div key={j} className="flex items-center px-6 md:px-10">
                              <div className="flex items-baseline gap-2 text-gray-900 dark:text-white">
                                  <span className="font-serif italic text-lg text-gray-500 dark:text-gray-400">{item.serif}</span>
                                  <span className="font-display font-bold uppercase tracking-[0.15em] text-xs">{item.sans}</span>
                              </div>
                              <span className="ml-12 md:ml-20 w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                          </div>
                      ))}
                  </div>
              ))}
          </div>
      </div>

      {/* Footer Minimalist Note */}
      <div className="text-center py-12">
          <span className="material-symbols-outlined text-gray-300 dark:text-gray-700 text-3xl mb-4">spa</span>
          <p className="text-xs text-gray-400 uppercase tracking-[0.3em]">Faceneed © 2026</p>
      </div>
    </div>
  );
};

export default HomePage;