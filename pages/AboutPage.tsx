import React from 'react';
import { PageView } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageView) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="font-display">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center bg-background-light dark:bg-background-dark overflow-hidden">
        <div className="absolute inset-0">
            <div 
                className="w-full h-full bg-cover bg-center opacity-40 dark:opacity-20 grayscale" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_ndNtzKNopBXrBqewayISjSa2cr3XhNmqK3T6sB-MA6pFeBfb3Pgljs2R_KH_yhBGncAUrdlblfL8fj2p2UYynK0d3fdw6uIAC-xWqvFTJbgcvqVlPE0a54yL0feHnK0kpgg1xZxUXBUM9T1DBUC-91gGcRCkmbueU-8JC1Oi8DrLwxih37NF5gC5A5fFpNR8VUlyLsAvnewyum0Y-rXm1oyuXiS2F3nPHBPjvaELmdhIrlENmmdTvFVuNr7G3vw9aLnm9ItVHa4")' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl px-6 text-center">
            <h1 className="animate-slideUp delay-100 text-5xl md:text-7xl font-serif text-gray-900 dark:text-white mb-6">Beauty Rooted in Nature</h1>
            <p className="animate-slideUp delay-200 text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light max-w-2xl mx-auto">
                Faceneed was born from a simple belief: that skincare should be effective, ethical, and effortless.
            </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 lg:px-10 max-w-[1280px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
                <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Our Mission</span>
                <h2 className="text-4xl font-serif text-gray-900 dark:text-white mb-8">Science meets Soul.</h2>
                <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    <p>
                        We started Faceneed because we were tired of choosing between natural ingredients that didn't work and clinical formulas that felt harsh.
                    </p>
                    <p>
                        Our mission is to bridge that gap. We rigorously test every botanical extract and active ingredient to ensure they deliver visible results without compromising your skin barrier or our planet.
                    </p>
                    <p>
                        Every product we make is 100% vegan, cruelty-free, and packaged in sustainable materials.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] rounded-2xl bg-gray-100 overflow-hidden mt-12">
                     <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAchRdyKkv02pUAScnNtjiay_ORc4zYUeOjK7hqYUydk0pUh98w9BfuL6XDITJD7f8TxK985Y81A9veKpb1uJlxIZ_LEJBO5wmbTkcZ94bxa0senYR6JvomxTgGlqijy_bM2EmrwehRT3Re2SfV0s4EtKHo7sJg81UWtW45GiJLFSVoEnapuXxWHeIA7nd2SZefyVjJ1w95nzqU1s8HgOwh5Jk3NuXya0GiojkCsEjBq2ZlA9H6VLAlMHeMC6ig8DafDJZXgE7vhxk")' }}></div>
                </div>
                <div className="aspect-[3/4] rounded-2xl bg-gray-100 overflow-hidden">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLl0G7eJsEBfZgXQ9-byifxkqUfBxojVvYtHoSAFypbLRZMpkW0IKD6PM2TDva4bnm2vvwgGNDifLgghmk76nU7dlXsZw3AvMPWNvX6H8gNM0IX69p5n14Lme4uDPuSePZ3wit1B5tivwafxsYCHy2Br5sMhW1QQjTAjqdnPj-AnDfZSrgetZfXfLJzun2EgXMvKulqDjWZYx_fpVNCP8D6_V1n78ZsGAjtEjiKgxgl8YtGg-4QksmMyNvS1r846HWckCksiHg4Pw")' }}></div>
                </div>
            </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-primary/5 dark:bg-primary/10 py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <h2 className="text-3xl font-serif text-center text-gray-900 dark:text-white mb-16">The Faceneed Standard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6">
                        <span className="material-symbols-outlined">water_drop</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Clean Ingredients</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We ban over 1,500 questionable ingredients. No parabens, sulfates, phthalates, or synthetic fragrances.
                    </p>
                </div>
                <div className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6">
                        <span className="material-symbols-outlined">science</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Clinical Results</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Our formulas are backed by third-party clinical studies to ensure they perform as promised.
                    </p>
                </div>
                <div className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6">
                        <span className="material-symbols-outlined">favorite</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Community First</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        1% of every purchase goes towards supporting women's education initiatives worldwide.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6">
        <h2 className="text-4xl font-serif text-gray-900 dark:text-white mb-6">Ready to find your glow?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">Start your journey with our best-selling essentials.</p>
        <button onClick={() => onNavigate('shop')} className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg transform hover:scale-105">
            Shop the Collection
        </button>
      </section>
    </div>
  );
};

export default AboutPage;