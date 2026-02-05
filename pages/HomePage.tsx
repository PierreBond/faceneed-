import React from 'react';
import { PageView, Product } from '../types';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  onProductClick: (product: Product) => void;
  addToCart: (product: Product) => void;
}

// Reusing product data for display
const products: Product[] = [
  {
    id: '1',
    name: 'Hydrating Serum',
    description: 'Intense 24h Moisture',
    price: 42.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLl0G7eJsEBfZgXQ9-byifxkqUfBxojVvYtHoSAFypbLRZMpkW0IKD6PM2TDva4bnm2vvwgGNDifLgghmk76nU7dlXsZw3AvMPWNvX6H8gNM0IX69p5n14Lme4uDPuSePZ3wit1B5tivwafxsYCHy2Br5sMhW1QQjTAjqdnPj-AnDfZSrgetZfXfLJzun2EgXMvKulqDjWZYx_fpVNCP8D6_V1n78ZsGAjtEjiKgxgl8YtGg-4QksmMyNvS1r846HWckCksiHg4Pw',
    category: 'Serum',
    rating: 4.8,
    reviews: 342
  },
  {
    id: '2',
    name: 'Radiance Cream',
    description: 'Illuminating Face Care',
    price: 58.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY9P9Vvd56ou_YPoVuaD-0mveo4sNcJpkvxi0suacNHcxNqaTfSZWl0p1DPYvsLj4wA2a-asOii0OsDrDlY4JQZ8w6D955kYZfqTG3Z-rQGt-iIKOz9RNblXCQ9nre1v0NTbyrW2dKmRmSCyGtPUts1P-gh40sTAE94u8-H6bRSH88mZ6hmGVJqG28vurSFQQdjCWKO2rT3TnD1xJD_gDbSq3IZxunlpwBlWXBSI4FL7Fs8pUPs2dofAvdcxV_kjUHUaX_Qr5KCuA',
    category: 'Cream',
    rating: 4.9,
    reviews: 128
  },
  {
    id: '3',
    name: 'Velvet Lip Tint',
    description: 'Matte finish long-wear',
    price: 24.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2VYiq1oS976pecnT8VgQtDhfXIGU_c7KzEoUgv6BWTWmIwYRBcM5W3i-X1sbu_XKMfRhRON5CovnLcO6uDEeYlEs74dlGtrGkwihlBlF7x2wMpsX3dqzWwFRmLFgwgs1UfyRz_FMQf_aXkP1-tZTYjZpMWU0O7pNKmqRXJPrN73qEtLq5X8lMu-u38IFaVXd3muZrd4pUQMZqlDRSCvhnSYgEI0zvyVICgqSvXBwBoSnG78by9PUbKf26h5MqcDM4ALF0hRwbLtk',
    category: 'Lip',
    rating: 4.7,
    reviews: 856
  },
  {
    id: '4',
    name: 'Glow Oil',
    description: 'Overnight Repair Serum',
    price: 45.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOVQmYVCR90RGzCGMmHpo0UXP7S3INDW9oySSiAWDjM7sTSdXrFSOSiF_iRdzIahwhN4bLSc0nByKpdQAN-N73vQ-1OctIrDYRzxBUuEVdFhoy-7j0UTm0vR1RbtVW2jkn6rGZKtMIXvZzYrRq4zR5kYg82xBZkD1HiVPlWyPw6JmyWNu9Q5GBgWBdXk_Rd-OJ-KIf4vQxixgEMWlTJgCA-JEzPKyVVmKlHZcg3OCVdDdcEgNA5szBp-F6jixBTUL_girFb_snsYE',
    category: 'Oil',
    rating: 5.0,
    reviews: 92
  },
];

const categories = [
    { name: 'Serums', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLl0G7eJsEBfZgXQ9-byifxkqUfBxojVvYtHoSAFypbLRZMpkW0IKD6PM2TDva4bnm2vvwgGNDifLgghmk76nU7dlXsZw3AvMPWNvX6H8gNM0IX69p5n14Lme4uDPuSePZ3wit1B5tivwafxsYCHy2Br5sMhW1QQjTAjqdnPj-AnDfZSrgetZfXfLJzun2EgXMvKulqDjWZYx_fpVNCP8D6_V1n78ZsGAjtEjiKgxgl8YtGg-4QksmMyNvS1r846HWckCksiHg4Pw' },
    { name: 'Moisturizers', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY9P9Vvd56ou_YPoVuaD-0mveo4sNcJpkvxi0suacNHcxNqaTfSZWl0p1DPYvsLj4wA2a-asOii0OsDrDlY4JQZ8w6D955kYZfqTG3Z-rQGt-iIKOz9RNblXCQ9nre1v0NTbyrW2dKmRmSCyGtPUts1P-gh40sTAE94u8-H6bRSH88mZ6hmGVJqG28vurSFQQdjCWKO2rT3TnD1xJD_gDbSq3IZxunlpwBlWXBSI4FL7Fs8pUPs2dofAvdcxV_kjUHUaX_Qr5KCuA' },
    { name: 'Sun Care', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAchRdyKkv02pUAScnNtjiay_ORc4zYUeOjK7hqYUydk0pUh98w9BfuL6XDITJD7f8TxK985Y81A9veKpb1uJlxIZ_LEJBO5wmbTkcZ94bxa0senYR6JvomxTgGlqijy_bM2EmrwehRT3Re2SfV0s4EtKHo7sJg81UWtW45GiJLFSVoEnapuXxWHeIA7nd2SZefyVjJ1w95nzqU1s8HgOwh5Jk3NuXya0GiojkCsEjBq2ZlA9H6VLAlMHeMC6ig8DafDJZXgE7vhxk' },
    { name: 'Treatments', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATekgycab1Z3UZoQiZbAUWWah96cFtQeYtChiFEd8ZLf8cBjRWLqEpsusx83azCsL_7nrma99p2PvbnukHls7LdOGP-OwktBe6d9DbTS_CMuR_9W_Xd8cjiyg1PUsWxwnUBcnB4eUGU02R5ic2AcxDXTJ5syc6SnlhtBGRohHmNkOAwYOmBzyd_xo8VoeC7R6aa2Cuxeb6FpNsXi-FOQnOHZ866kwZ9kipXW6jK1Dn60N_in063x7mb_x74kIapQnLlJJ-F53ZuhM' },
];

const testimonials = [
  { text: "This serum completely changed my texture. I can't live without it now.", author: "Jessica K.", location: "New York, NY" },
  { text: "Finally a clean beauty brand that actually delivers results. The packaging is gorgeous too!", author: "Amanda L.", location: "Austin, TX" },
  { text: "My skin has never felt so hydrated. The Glow Oil is absolute magic in a bottle.", author: "Sarah M.", location: "London, UK" },
];

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onProductClick, addToCart }) => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[650px] flex items-center justify-center lg:justify-start">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="w-full h-full bg-center bg-cover animate-[fadeIn_1.5s_ease-out] scale-105" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAYjyAKqambmXPaTIZls7A-knP5OLyy6BqLiuuURgxBJjIkcZuQBNh6xf5y-r5U1UlJ_NMSUNO-q4bNctXOIlN0nfWvspUZP1nprQaAOQt6vt3unDax7Qhb09jtfDjhbDDFnka3RXLIg_kv86sgrJ89tNzSJmPx6mIVVHGIbIx4YMYJ982r7BfLogasbgoPnXOJ_6AqTyzRw3u7ZomCzyp3NMLzcJnFOZPIljvu6G8l8j0Ncftd1XwHZoPjl-_dEeN-U7sbHxLUqoA")' }}
          >
          </div>
          <div className="absolute inset-0 bg-black/10 dark:bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent dark:from-background-dark/80"></div>
        </div>
        
        <div className="relative max-w-[1280px] w-full mx-auto px-6 lg:px-10 flex flex-col items-center lg:items-start text-center lg:text-left pt-20">
          <div className="max-w-4xl">
            <div className="animate-slideUp delay-100 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-900 dark:text-white">New Collection Available</span>
            </div>
            <h1 className="animate-slideUp delay-200 text-gray-900 dark:text-white text-6xl md:text-8xl lg:text-9xl font-serif font-light leading-[0.9] mb-8 tracking-tighter">
              Skincare that <br/>
              <span className="italic text-primary font-serif font-normal">understands</span> you.
            </h1>
            <p className="animate-slideUp delay-300 text-gray-800 dark:text-gray-200 text-lg md:text-xl max-w-lg mb-12 leading-relaxed font-light mx-auto lg:mx-0 tracking-wide">
              Clinically proven, naturally sourced. Reveal your best skin with our award-winning formulas designed for modern life.
            </p>
            <div className="animate-slideUp delay-400 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <button onClick={() => onNavigate('shop')} className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all transform hover:scale-105 shadow-xl shadow-primary/30">
                Shop Best Sellers
              </button>
              <button className="bg-white/80 dark:bg-black/30 backdrop-blur-md border border-white/50 dark:border-white/20 text-gray-900 dark:text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white dark:hover:bg-white/10 transition-all">
                Take Skin Quiz
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="animate-slideUp delay-500 bg-primary text-white py-4 overflow-hidden whitespace-nowrap border-y border-white/10 relative z-10">
        <div className="flex animate-scroll hover:paused w-max">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 mx-6">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase">Free Shipping on orders over $50</span>
              <span className="material-symbols-outlined text-[10px]">star</span>
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase">Organic Ingredients</span>
              <span className="material-symbols-outlined text-[10px]">star</span>
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase">Cruelty Free</span>
              <span className="material-symbols-outlined text-[10px]">star</span>
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase">30-Day Money Back Guarantee</span>
              <span className="material-symbols-outlined text-[10px]">star</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="py-24 bg-white dark:bg-background-dark">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <h2 className="text-center text-4xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-16 tracking-tight">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((cat, idx) => (
                <div key={idx} className="group cursor-pointer flex flex-col items-center gap-6" onClick={() => onNavigate('shop')}>
                    <div className="w-full aspect-square rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 relative">
                        <div 
                            className="w-full h-full bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                            style={{ backgroundImage: `url('${cat.image}')` }}
                        ></div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <span className="font-medium text-xl font-serif italic text-gray-900 dark:text-white group-hover:text-primary transition-colors flex items-center gap-2">
                        {cat.name}
                        <span className="material-symbols-outlined text-base opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">arrow_forward</span>
                    </span>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight Feature */}
      <section className="bg-[#fcf8f2] dark:bg-[#1a1510] py-0">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-[600px] lg:h-auto overflow-hidden group">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAAa_N4wJRrF1aCsH9jIdYwix99Zn19HJq4zyOznoRBrpm1NH_JuZM54ZdBn6HrLRYo8xyt2ctnQXjKukKrOOVx89UYcxLdBrsPDY6yJds6W7Mju_OhvT41cWeVBkmQJRFVcYHsiBWkV0OcGbPRJ11oyRI4pIti10qyHF_yc01eMu4LL6Md2eFFMjurtpmxUcGWSItC484kquaP-jG4Q0gMMG-w0lZCM_diRPTuCgqMtLkvqKJBXS-CeV1ZmJj6vgspGM5o7sFBuWw')` }}
                ></div>
            </div>
            <div className="flex items-center justify-center p-12 lg:p-24">
                <div className="max-w-md">
                    <span className="animate-slideUp block text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-6">The Holy Grail</span>
                    <h2 className="animate-slideUp delay-100 text-5xl lg:text-7xl font-serif font-light text-gray-900 dark:text-white mb-8 leading-none">Vitamin C <span className="italic block">Brightening Serum</span></h2>
                    <p className="animate-slideUp delay-200 text-gray-600 dark:text-gray-400 text-lg mb-10 leading-relaxed font-light">
                        Our award-winning formula combines 15% pure Vitamin C with Ferulic Acid to visibly brighten skin, fade dark spots, and protect against environmental damage.
                    </p>
                    <div className="animate-slideUp delay-300 space-y-4 mb-12">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-primary font-light">check_circle</span>
                            <span className="text-gray-800 dark:text-gray-200 font-medium">Visibly brightens in 2 weeks</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-primary font-light">check_circle</span>
                            <span className="text-gray-800 dark:text-gray-200 font-medium">Protects against pollution</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-primary font-light">check_circle</span>
                            <span className="text-gray-800 dark:text-gray-200 font-medium">Safe for sensitive skin</span>
                        </div>
                    </div>
                    <button onClick={() => onNavigate('shop')} className="animate-slideUp delay-400 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity shadow-lg">
                        Shop Now • $48.00
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-32">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-4">Best Sellers</h2>
            <p className="text-gray-500 dark:text-gray-400 font-light text-lg">Our most-loved daily essentials.</p>
          </div>
          <button onClick={() => onNavigate('shop')} className="text-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2 group">
            View all products
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-sm">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col gap-5 cursor-pointer" onClick={() => onProductClick(product)}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-800">
                <div 
                  className="w-full h-full bg-center bg-cover transition-transform duration-1000 group-hover:scale-105" 
                  style={{ backgroundImage: `url("${product.image}")` }}
                ></div>
                {/* Badges */}
                <div className="absolute top-0 left-0 p-4 w-full flex justify-between items-start">
                    {product.id === '1' && <span className="bg-white/90 dark:bg-black/80 backdrop-blur text-[10px] font-bold px-3 py-1 uppercase tracking-widest text-gray-900 dark:text-white">Best Seller</span>}
                </div>
                {/* Quick Add Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-background-dark/95 py-3 rounded-full font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-primary hover:text-white text-gray-900 dark:text-white shadow-lg text-xs uppercase tracking-widest"
                >
                  Quick Add
                </button>
              </div>
              <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium font-serif text-gray-900 dark:text-white group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-primary font-bold">${product.price.toFixed(2)}</p>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-1 font-light">{product.description}</p>
                <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                             <span key={i} className={`material-symbols-outlined text-[14px] ${i < Math.floor(product.rating || 5) ? 'fill-icon' : ''}`}>star</span>
                        ))}
                    </div>
                    <span className="text-xs text-gray-400 ml-1 font-medium">({product.reviews})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Standards Section */}
      <section className="bg-white dark:bg-background-dark py-24 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="size-16 rounded-full border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
                <span className="material-symbols-outlined text-primary text-3xl font-light">verified</span>
              </div>
              <h3 className="text-lg font-serif font-bold mb-2 text-gray-900 dark:text-white">Dermatologist Tested</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-light">Safe for sensitive skin types.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="size-16 rounded-full border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
                <span className="material-symbols-outlined text-primary text-3xl font-light">eco</span>
              </div>
              <h3 className="text-lg font-serif font-bold mb-2 text-gray-900 dark:text-white">Sustainably Sourced</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-light">Ingredients that honor the earth.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="size-16 rounded-full border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
                <span className="material-symbols-outlined text-primary text-3xl font-light">cruelty_free</span>
              </div>
              <h3 className="text-lg font-serif font-bold mb-2 text-gray-900 dark:text-white">Cruelty Free</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-light">Never tested on animals, ever.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="size-16 rounded-full border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
                <span className="material-symbols-outlined text-primary text-3xl font-light">recycling</span>
              </div>
              <h3 className="text-lg font-serif font-bold mb-2 text-gray-900 dark:text-white">Recyclable</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-light">Packaging made from glass & PCR.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background-light dark:bg-[#151515] py-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 text-center">
            <h2 className="text-4xl font-serif text-gray-900 dark:text-white mb-20 italic">Loved by Thousands</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t, i) => (
                    <div key={i} className="bg-white dark:bg-[#222] p-10 rounded-sm shadow-sm border border-gray-100 dark:border-gray-800 text-left flex flex-col h-full hover:shadow-md transition-shadow">
                        <div className="flex text-primary mb-8 gap-1"><span className="material-symbols-outlined fill-icon text-sm">star</span><span className="material-symbols-outlined fill-icon text-sm">star</span><span className="material-symbols-outlined fill-icon text-sm">star</span><span className="material-symbols-outlined fill-icon text-sm">star</span><span className="material-symbols-outlined fill-icon text-sm">star</span></div>
                        <p className="text-gray-800 dark:text-gray-200 text-xl font-serif leading-relaxed mb-8 flex-1 italic">"{t.text}"</p>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white uppercase tracking-widest text-xs mb-1">{t.author}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">{t.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24">
        <div className="bg-primary rounded-2xl p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl translate-x-[-50%] translate-y-[-50%]"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl translate-x-[50%] translate-y-[50%]"></div>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="animate-slideUp text-white text-4xl md:text-6xl font-serif mb-8 italic">Join the Glow Circle</h2>
            <p className="animate-slideUp delay-100 text-white/90 text-lg mb-10 font-light leading-relaxed">Sign up for our newsletter to receive 15% off your first order, exclusive access to new launches, and expert skincare tips.</p>
            <form className="animate-slideUp delay-200 flex flex-col sm:flex-row gap-4 w-full" onSubmit={(e) => e.preventDefault()}>
              <input 
                className="flex-1 px-8 py-4 rounded-full border-2 border-white/20 bg-white/10 text-white placeholder:text-white/70 focus:outline-none focus:bg-white focus:text-primary focus:border-white transition-all backdrop-blur-sm font-light" 
                placeholder="Enter your email address" 
                type="email"
              />
              <button className="bg-white text-primary px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg uppercase tracking-widest text-xs" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;