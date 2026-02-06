import React, { useState } from 'react';
import { PageView, Product } from '../types';

interface ProductPageProps {
  product: Product | null;
  onNavigate: (page: PageView) => void;
  addToCart: (product: Product, quantity: number) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, onNavigate, addToCart, wishlist, toggleWishlist }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    // Fallback if accessed directly without state, just go back to home or show default
    onNavigate('shop');
    return null;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const isWishlisted = wishlist.includes(product.id);

  // Hardcoded images for gallery simulation
  const images = [
      product.image,
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkeeePlrD_gL8RIra75SZLP_CpLS6UdSOESBHFQ_wXoFa6fs2F74FmBzGeZeoVWnFHn2eQfGx7_x64hpYV60mujNlhjt1PwVR_cRERhWYheDO4vapxY-au0Yqw8IB9MraZ3GsVh_7HNXM8bOXuz3if-Lc825s8tcnUE5qB998suMVUc7MxjA6IoT5h4Lu7fOz-k28iwBnvHZVou-INoGLdamkxtUAGeC1b-gKFsapWSTfH5mg6UuWiuUnvqqsQCp7tE4zHCMk7M_s',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_ndNtzKNopBXrBqewayISjSa2cr3XhNmqK3T6sB-MA6pFeBfb3Pgljs2R_KH_yhBGncAUrdlblfL8fj2p2UYynK0d3fdw6uIAC-xWqvFTJbgcvqVlPE0a54yL0feHnK0kpgg1xZxUXBUM9T1DBUC-91gGcRCkmbueU-8JC1Oi8DrLwxih37NF5gC5A5fFpNR8VUlyLsAvnewyum0Y-rXm1oyuXiS2F3nPHBPjvaELmdhIrlENmmdTvFVuNr7G3vw9aLnm9ItVHa4'
  ];

  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 font-newsreader">
      <nav className="flex items-center gap-2 text-sm text-[#977f4e] mb-12">
        <button onClick={() => onNavigate('home')} className="hover:underline">Home</button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <button onClick={() => onNavigate('shop')} className="hover:underline">{product.category}</button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-[#1b170e] dark:text-[#f8f7f6]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-x-visible">
            {images.map((img, idx) => (
                <div 
                    key={idx}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 overflow-hidden flex-shrink-0 cursor-pointer ${activeImage === img ? 'border-primary' : 'border-[#f3efe7] dark:border-[#3a3221]'}`}
                    onClick={() => setActiveImage(img)}
                >
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${img}')` }}></div>
                </div>
            ))}
          </div>
          <div className="flex-1 rounded-xl overflow-hidden aspect-[4/5] bg-[#f3efe7] dark:bg-[#3a3221]">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${activeImage}')` }}></div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-5 space-y-8">
            <div>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-[#1b170e] dark:text-[#f8f7f6]">{product.name}</h2>
                <div className="flex items-center gap-4 mt-4">
                    <p className="text-2xl text-primary font-medium">${product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1 text-primary">
                        {[1,2,3,4].map(i => <span key={i} className="material-symbols-outlined text-sm fill-icon">star</span>)}
                        <span className="material-symbols-outlined text-sm fill-icon">star_half</span>
                        <span className="text-sm text-[#977f4e] ml-2">(124 reviews)</span>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#1b170e] dark:text-white">Why it's special</h3>
                <p className="text-[#1b170e]/80 dark:text-[#f8f7f6]/80 leading-relaxed italic">
                    "{product.description} Infused with stabilized Vitamin C and botanical ferments, it targets dullness at the source for a lit-from-within glow."
                </p>
            </div>
            <div className="pt-4 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#f3efe7] dark:border-[#3a3221] rounded-xl px-4 py-3 gap-6">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-primary"><span className="material-symbols-outlined">remove</span></button>
                        <span className="font-bold w-4 text-center text-gray-900 dark:text-white">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="hover:text-primary"><span className="material-symbols-outlined">add</span></button>
                    </div>
                    <button onClick={handleAddToCart} className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-xl">shopping_cart</span>
                        Add to Bag
                    </button>
                    <button 
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-4 rounded-xl border border-[#f3efe7] dark:border-[#3a3221] transition-colors flex items-center justify-center ${isWishlisted ? 'text-primary border-primary bg-primary/5' : 'text-[#1b170e] dark:text-white hover:bg-[#f3efe7] dark:hover:bg-[#3a3221]'}`}
                    >
                         <span className={`material-symbols-outlined text-xl ${isWishlisted ? 'fill-icon' : ''}`}>favorite</span>
                    </button>
                </div>
                <button className="w-full border border-[#f3efe7] dark:border-[#3a3221] py-3 rounded-xl hover:bg-[#f3efe7] dark:hover:bg-[#3a3221] text-[#1b170e] dark:text-white transition-colors font-medium">
                    Buy Now
                </button>
            </div>

            {/* Accordion Details */}
            <div className="border-t border-[#f3efe7] dark:border-[#3a3221] pt-6 space-y-4">
                <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none py-2 text-[#1b170e] dark:text-white">
                        <span className="font-bold">How to Use</span>
                        <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="py-4 text-sm text-[#1b170e]/70 dark:text-[#f8f7f6]/70 space-y-2">
                        <p>Apply 3-4 drops to clean, dry skin every morning. Massage gently into face and neck using upward motions. Follow with moisturizer and SPF.</p>
                    </div>
                </details>
                <details className="group border-t border-[#f3efe7] dark:border-[#3a3221] pt-4">
                    <summary className="flex items-center justify-between cursor-pointer list-none py-2 text-[#1b170e] dark:text-white">
                        <span className="font-bold">Ingredients</span>
                        <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="py-4 text-sm text-[#1b170e]/70 dark:text-[#f8f7f6]/70 leading-relaxed">
                        Aqua, Vitamin C (L-Ascorbic Acid), Glycerin, Ferulic Acid, Hyaluronic Acid, Tocopherol, Licorice Root Extract, Niacinamide, Phenoxyethanol, Ethylhexylglycerin.
                    </div>
                </details>
            </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-24 pt-16 border-t border-[#f3efe7] dark:border-[#3a3221]">
        <h3 className="text-3xl font-bold mb-6 text-[#1b170e] dark:text-white">Customer Reviews</h3>
        <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/3">
                <div className="bg-[#f3efe7] dark:bg-[#3a3221] p-8 rounded-xl">
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-5xl font-bold text-[#1b170e] dark:text-white">4.8</span>
                        <span className="text-lg text-[#977f4e] mb-1">out of 5</span>
                    </div>
                    {/* Stars visual omitted for brevity, keeping it clean */}
                    <div className="text-primary flex gap-1 mb-6">
                        {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined fill-icon">star</span>)}
                    </div>
                    <button className="w-full mt-4 bg-[#1b170e] dark:bg-[#f8f7f6] text-white dark:text-[#1b170e] py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">Write a Review</button>
                </div>
            </div>
            <div className="flex-1 space-y-8">
                {/* Review Item */}
                <div className="border-b border-[#f3efe7] dark:border-[#3a3221] pb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">SM</div>
                            <div>
                                <h4 className="font-bold text-[#1b170e] dark:text-white">Sarah M.</h4>
                                <p className="text-xs text-[#977f4e]">Verified Buyer</p>
                            </div>
                        </div>
                        <div className="flex text-primary"><span className="material-symbols-outlined text-sm fill-icon">star</span><span className="material-symbols-outlined text-sm fill-icon">star</span><span className="material-symbols-outlined text-sm fill-icon">star</span><span className="material-symbols-outlined text-sm fill-icon">star</span><span className="material-symbols-outlined text-sm fill-icon">star</span></div>
                    </div>
                    <h5 className="font-bold text-lg mb-2 italic text-[#1b170e] dark:text-white">"Finally found my holy grail!"</h5>
                    <p className="text-[#1b170e]/70 dark:text-[#f8f7f6]/70 leading-relaxed">I've been using this for just 10 days and the difference in my skin texture is incredible.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;