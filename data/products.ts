import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
    // Skincare
    {
        id: 's1',
        name: 'Glow Radiance Oil Cleanser',
        description: 'Deeply cleanses without stripping moisture.',
        price: 34.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIvu7u3XspEhcS2ePj6iAS-1xuno5JF-oX57WRIo3R1ijIBApJQpHUI76WtWBCd8LKD1HXJz17KcUnlTkqmod4PpV79DGMQZnrq8K4ai1Oa1MPOqHlCdT7Ubp3NeH5Czef05vDY-QF8BcA5k8JcXC_99nCcUdqg7ubDp6vFMLjpBaKaX9aZ7emYKFEJllIxnhSL47jfNtOCFqJvGzQ09EuCBgN-dSufbZ79erYItM9yNgoyR1Kj_bKSuVUbzq3yhVbk4fUuvh4HkI',
        category: 'Cleansers',
        isBestSeller: true,
        rating: 4.8,
        reviews: 120,
        inStock: true
    },
    {
        id: 's2',
        name: 'Vitamin C Brightening Serum',
        description: '15% pure Vitamin C for instant luminosity.',
        price: 48.00,
        originalPrice: 62.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAa_N4wJRrF1aCsH9jIdYwix99Zn19HJq4zyOznoRBrpm1NH_JuZM54ZdBn6HrLRYo8xyt2ctnQXjKukKrOOVx89UYcxLdBrsPDY6yJds6W7Mju_OhvT41cWeVBkmQJRFVcYHsiBWkV0OcGbPRJ11oyRI4pIti10qyHF_yc01eMu4LL6Md2eFFMjurtpmxUcGWSItC484kquaP-jG4Q0gMMG-w0lZCM_diRPTuCgqMtLkvqKJBXS-CeV1ZmJj6vgspGM5o7sFBuWw',
        category: 'Serums',
        rating: 4.9,
        reviews: 85,
        inStock: true
    },
    {
        id: 's3',
        name: 'Hyaluronic Barrier Cream',
        description: '24-hour hydration with triple ceramides.',
        price: 42.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0GAYfh8VC8d354RIZYdotQgDrUG4RRrgxIqzX1XMrpt7zWnbiqgCvVWnQOqUXJXUuQ6hadkwsc5coHrHwev2JynBCxkoFz9ESemXd0j21M7wK34vdS4-rsOsaGm5gPPcBkjXGaU8aM01dwJuJKkfH7DRdJnpNKkiwlp7ick96yi7jXqS1ClFHJ-CwxQ_BUQMHOnAZUpgYRZ01iS1WLNWWDrrXZf6DqA-jHw_Utm1A5G7B8hZxDNmfYbVnJ_iZr6rMXzTwzmj0xmk',
        category: 'Moisturizers',
        rating: 4.7,
        reviews: 204,
        inStock: true
    },
    {
        id: 's4',
        name: 'Purifying Green Clay Mask',
        description: 'Refines pores and removes impurities.',
        price: 28.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATekgycab1Z3UZoQiZbAUWWah96cFtQeYtChiFEd8ZLf8cBjRWLqEpsusx83azCsL_7nrma99p2PvbnukHls7LdOGP-OwktBe6d9DbTS_CMuR_9W_Xd8cjiyg1PUsWxwnUBcnB4eUGU02R5ic2AcxDXTJ5syc6SnlhtBGRohHmNkOAwYOmBzyd_xo8VoeC7R6aa2Cuxeb6FpNsXi-FOQnOHZ866kwZ9kipXW6jK1Dn60N_in063x7mb_x74kIapQnLlJJ-F53ZuhM',
        category: 'Treatments',
        rating: 4.5,
        reviews: 63,
        inStock: true
    },
    {
        id: 's5',
        name: 'Caffeine Infused Eye Revive',
        description: 'Reduces puffiness and dark circles.',
        price: 36.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn99k47i1pMgOy9r7-Zh3jgWNR7NRmBG9-ICaVv1yLJmQUaJmxv0FPFGERsHldQSofhgz1s96OT3DPdbWpLAM0Po0x5w6TOGlx0z5XI6Dwi_W86CT40iaFhzqmkejBTwXYt5lyI6aDl2CsfYO-8-WC9zf6s1loydope2j79T4nekyo4-LxFCWyGq7kDE_3KbHuo_xUxNXmwH7Fs2_OuZAYzEvSyGrQuoklkQH_wa6JIDjSt8Dw1CMlfoaRiTyHQ2jBe3PFZygPv4w',
        category: 'Eye Care',
        isNew: true,
        rating: 5.0,
        reviews: 12,
        inStock: true
    },
    {
        id: 's6',
        name: 'Invisible Shield SPF 50+',
        description: 'Zero white cast, lightweight daily defense.',
        price: 30.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAchRdyKkv02pUAScnNtjiay_ORc4zYUeOjK7hqYUydk0pUh98w9BfuL6XDITJD7f8TxK985Y81A9veKpb1uJlxIZ_LEJBO5wmbTkcZ94bxa0senYR6JvomxTgGlqijy_bM2EmrwehRT3Re2SfV0s4EtKHo7sJg81UWtW45GiJLFSVoEnapuXxWHeIA7nd2SZefyVjJ1w95nzqU1s8HgOwh5Jk3NuXya0GiojkCsEjBq2ZlA9H6VLAlMHeMC6ig8DafDJZXgE7vhxk',
        category: 'Sun Protection',
        rating: 4.6,
        reviews: 156,
        inStock: true
    },
    // Makeup
    {
        id: 'm1',
        name: 'Velvet Soft Matte Lipstick',
        description: 'Weightless long-wear color in 6 shades.',
        price: 26.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2VYiq1oS976pecnT8VgQtDhfXIGU_c7KzEoUgv6BWTWmIwYRBcM5W3i-X1sbu_XKMfRhRON5CovnLcO6uDEeYlEs74dlGtrGkwihlBlF7x2wMpsX3dqzWwFRmLFgwgs1UfyRz_FMQf_aXkP1-tZTYjZpMWU0O7pNKmqRXJPrN73qEtLq5X8lMu-u38IFaVXd3muZrd4pUQMZqlDRSCvhnSYgEI0zvyVICgqSvXBwBoSnG78by9PUbKf26h5MqcDM4ALF0hRwbLtk',
        category: 'Lips',
        isBestSeller: true,
        rating: 4.8,
        reviews: 342,
        inStock: true
    },
    {
        id: 'm2',
        name: 'Second Skin Serum Foundation',
        description: 'Medium coverage with a dewy finish.',
        price: 45.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA1uG98aJzTz-eJ5Y0_q9X2m2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3',
        category: 'Face',
        rating: 4.7,
        reviews: 89,
        inStock: false
    },
    {
        id: 'm3',
        name: 'Cloud Tint Blush',
        description: 'Buildable gel-cream cheek color.',
        price: 24.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_ndNtzKNopBXrBqewayISjSa2cr3XhNmqK3T6sB-MA6pFeBfb3Pgljs2R_KH_yhBGncAUrdlblfL8fj2p2UYynK0d3fdw6uIAC-xWqvFTJbgcvqVlPE0a54yL0feHnK0kpgg1xZxUXBUM9T1DBUC-91gGcRCkmbueU-8JC1Oi8DrLwxih37NF5gC5A5fFpNR8VUlyLsAvnewyum0Y-rXm1oyuXiS2F3nPHBPjvaELmdhIrlENmmdTvFVuNr7G3vw9aLnm9ItVHa4',
        category: 'Cheek',
        isNew: true,
        rating: 4.9,
        reviews: 45,
        inStock: true
    },
    {
        id: 'm4',
        name: 'Lash Lift Volumizing Mascara',
        description: 'Clean formula for massive volume.',
        price: 28.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkeeePlrD_gL8RIra75SZLP_CpLS6UdSOESBHFQ_wXoFa6fs2F74FmBzGeZeoVWnFHn2eQfGx7_x64hpYV60mujNlhjt1PwVR_cRERhWYheDO4vapxY-au0Yqw8IB9MraZ3GsVh_7HNXM8bOXuz3if-Lc825s8tcnUE5qB998suMVUc7MxjA6IoT5h4Lu7fOz-k28iwBnvHZVou-INoGLdamkxtUAGeC1b-gKFsapWSTfH5mg6UuWiuUnvqqsQCp7tE4zHCMk7M_s',
        category: 'Eyes',
        rating: 4.5,
        reviews: 112,
        inStock: true
    }
];
