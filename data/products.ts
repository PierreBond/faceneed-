import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
    // === International Skincare ===
    {
        id: 's1',
        name: 'Vaseline Cocoa Radiant Lotion',
        description: 'Deeply moisturizes with pure cocoa butter for 72hr radiant skin.',
        price: 35.00,
        image: '/data/images/skincare/vaseline-cocoa-radiant.jpg',
        category: 'Moisturizers',
        rating: 4.8,
        reviews: 204,
        isBestSeller: true,
        inStock: true
    },
    {
        id: 's2',
        name: 'Nivea Perfect & Radiant Lotion',
        description: 'Even-toned radiance with liquorice and UVA/UVB filters.',
        price: 45.00,
        image: '/data/images/skincare/nivea-radiant-lotion.jpg',
        category: 'Moisturizers',
        rating: 4.7,
        reviews: 156,
        inStock: true
    },
    {
        id: 's3',
        name: "Palmer's Cocoa Butter Lotion",
        description: 'Heals and softens rough, dry skin with pure cocoa butter.',
        price: 55.00,
        originalPrice: 65.00,
        image: '/data/images/skincare/palmers-cocoa-butter.jpg',
        category: 'Moisturizers',
        rating: 4.9,
        reviews: 312,
        isBestSeller: true,
        inStock: true
    },
    {
        id: 's4',
        name: 'CeraVe Foaming Cleanser',
        description: 'Gentle gel cleanser with ceramides for normal to oily skin.',
        price: 80.00,
        image: '/data/images/skincare/cerave-foaming-cleanser.jpg',
        category: 'Cleansers',
        rating: 4.8,
        reviews: 189,
        inStock: true
    },
    {
        id: 's5',
        name: 'COSRX Snail 92 All-in-One Cream',
        description: '92% snail mucin for deep hydration and glass skin finish.',
        price: 95.00,
        image: '/data/images/skincare/cosrx-snail-92.jpg',
        category: 'Moisturizers',
        rating: 4.9,
        reviews: 267,
        isNew: true,
        inStock: true
    },

    // === Local West African Skincare ===
    {
        id: 'l1',
        name: 'Dang! Vitamin C Serum',
        description: '7% L-Ascorbic Acid serum for bright, even-toned skin.',
        price: 150.00,
        image: '/data/images/local/dang-vitamin-c-serum.jpg',
        category: 'Serums',
        rating: 4.8,
        reviews: 89,
        isNew: true,
        inStock: true
    },
    {
        id: 'l2',
        name: 'Nokware Raw Shea Butter',
        description: '100% organic shea butter sourced from Northern Ghana cooperatives.',
        price: 85.00,
        image: '/data/images/local/nokware-shea-butter.jpg',
        category: 'Moisturizers',
        rating: 4.7,
        reviews: 134,
        inStock: true
    },
    {
        id: 'l3',
        name: 'R&R Luxury Shea Body Oil',
        description: 'Plant-based luxury oil from ethically sourced Ghanaian shea.',
        price: 120.00,
        image: '/data/images/local/rr-luxury-shea-oil.jpg',
        category: 'Treatments',
        rating: 4.6,
        reviews: 78,
        inStock: true
    },
    {
        id: 'l4',
        name: 'Skin Gourmet Cocoa & Shea Cream',
        description: 'Raw handmade cream with zero preservatives or additives.',
        price: 95.00,
        image: '/data/images/local/skingourmet-cocoa-shea.jpg',
        category: 'Moisturizers',
        rating: 4.8,
        reviews: 102,
        isBestSeller: true,
        inStock: true
    },
    {
        id: 'l5',
        name: 'Arami Essentials Glow Oil',
        description: 'Nourishing body oil blended from African botanical extracts.',
        price: 120.00,
        originalPrice: 145.00,
        image: '/data/images/local/arami-glow-oil.jpg',
        category: 'Treatments',
        rating: 4.7,
        reviews: 67,
        inStock: true
    },

    // === Makeup ===
    {
        id: 'm1',
        name: 'MAC Studio Fix Fluid Foundation',
        description: '24hr breathable matte foundation with 87% skincare ingredients.',
        price: 350.00,
        image: '/data/images/makeup/mac-studio-fix.jpg',
        category: 'Face',
        rating: 4.9,
        reviews: 342,
        isBestSeller: true,
        inStock: true
    },
    {
        id: 'm2',
        name: 'Milani Conceal + Perfect Foundation',
        description: 'Medium-to-full coverage with a natural matte finish.',
        price: 150.00,
        image: '/data/images/makeup/milani-conceal-perfect.jpg',
        category: 'Face',
        rating: 4.7,
        reviews: 178,
        inStock: true
    },
    {
        id: 'm3',
        name: 'Black Opal ColorSplurge Lipstick',
        description: 'Rich creamy color with vitamins C and E for all-day wear.',
        price: 80.00,
        image: '/data/images/makeup/black-opal-lipstick.jpg',
        category: 'Lips',
        rating: 4.6,
        reviews: 112,
        inStock: true
    },
    {
        id: 'm4',
        name: 'Zikel Cosmetics Contour Palette',
        description: 'Professional contour and highlight palette for all skin tones.',
        price: 120.00,
        image: '/data/images/makeup/zikel-contour-palette.jpg',
        category: 'Cheek',
        rating: 4.5,
        reviews: 89,
        isNew: true,
        inStock: true
    },
    {
        id: 'm5',
        name: 'Maybelline Lash Sensational Mascara',
        description: 'Clean formula for fanned-out, voluminous lashes.',
        price: 100.00,
        image: '/data/images/makeup/maybelline-mascara.jpg',
        category: 'Eyes',
        rating: 4.7,
        reviews: 223,
        isBestSeller: true,
        inStock: true
    }
];
