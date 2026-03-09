import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutShippingPage from './pages/CheckoutShippingPage';
import CheckoutPaymentPage from './pages/CheckoutPaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import { PageView, CartItem, Product, UserInfo, Order, OrderStatus } from './types';
import { INITIAL_PRODUCTS } from './data/products';

const INITIAL_ORDERS: Order[] = [
  {
    id: 'FN-82934102',
    date: 'Oct 24, 2024',
    status: 'Processing',
    total: 124.50,
    customerName: 'Sarah Jenkins',
    items: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLl0G7eJsEBfZgXQ9-byifxkqUfBxojVvYtHoSAFypbLRZMpkW0IKD6PM2TDva4bnm2vvwgGNDifLgghmk76nU7dlXsZw3AvMPWNvX6H8gNM0IX69p5n14Lme4uDPuSePZ3wit1B5tivwafxsYCHy2Br5sMhW1QQjTAjqdnPj-AnDfZSrgetZfXfLJzun2EgXMvKulqDjWZYx_fpVNCP8D6_V1n78ZsGAjtEjiKgxgl8YtGg-4QksmMyNvS1r846HWckCksiHg4Pw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAchRdyKkv02pUAScnNtjiay_ORc4zYUeOjK7hqYUydk0pUh98w9BfuL6XDITJD7f8TxK985Y81A9veKpb1uJlxIZ_LEJBO5wmbTkcZ94bxa0senYR6JvomxTgGlqijy_bM2EmrwehRT3Re2SfV0s4EtKHo7sJg81UWtW45GiJLFSVoEnapuXxWHeIA7nd2SZefyVjJ1w95nzqU1s8HgOwh5Jk3NuXya0GiojkCsEjBq2ZlA9H6VLAlMHeMC6ig8DafDJZXgE7vhxk'
    ]
  },
  {
    id: 'FN-77283911',
    date: 'Sep 12, 2024',
    status: 'Delivered',
    total: 42.00,
    customerName: 'Sarah Jenkins',
    items: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA2VYiq1oS976pecnT8VgQtDhfXIGU_c7KzEoUgv6BWTWmIwYRBcM5W3i-X1sbu_XKMfRhRON5CovnLcO6uDEeYlEs74dlGtrGkwihlBlF7x2wMpsX3dqzWwFRmLFgwgs1UfyRz_FMQf_aXkP1-tZTYjZpMWU0O7pNKmqRXJPrN73qEtLq5X8lMu-u38IFaVXd3muZrd4pUQMZqlDRSCvhnSYgEI0zvyVICgqSvXBwBoSnG78by9PUbKf26h5MqcDM4ALF0hRwbLtk'
    ]
  },
  {
    id: 'FN-99214455',
    date: 'Oct 26, 2024',
    status: 'Shipped',
    total: 89.00,
    customerName: 'Mike Thompson',
    items: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAA1uG98aJzTz-eJ5Y0_q9X2m2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3C0q9p2C0d9T0p3'
    ]
  },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Persistence: Initialize state from localStorage if available
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('faceneed_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('faceneed_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: 'sarah.jenkins@example.com',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    address: '123 Serenity Boulevard',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90028',
    phone: '(555) 123-4567'
  });

  // Dynamic theme color based on page to match the screenshots provided
  useEffect(() => {
    const root = document.documentElement;
    switch (currentPage) {
      case 'home':
      case 'shop':
      case 'skincare':
      case 'makeup':
      case 'about':
      case 'profile':
      case 'admin':
      case 'checkout-payment':
      case 'wishlist':
        root.style.setProperty('--color-primary', '#ee2b6c'); // Pink
        break;
      case 'product':
        root.style.setProperty('--color-primary', '#e6a219'); // Gold
        break;
      case 'cart':
      case 'success':
        root.style.setProperty('--color-primary', '#eba747'); // Gold/Orange
        break;
      case 'checkout-shipping':
        root.style.setProperty('--color-primary', '#368ce2'); // Blue
        break;
      default:
        root.style.setProperty('--color-primary', '#ee2b6c');
    }
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Persistence: Sync state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('faceneed_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('faceneed_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleNavigate = (page: PageView) => {
    setSearchQuery('');
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      if (currentPage !== 'shop' && currentPage !== 'skincare' && currentPage !== 'makeup') {
        setCurrentPage('shop');
      } else if (currentPage === 'skincare' || currentPage === 'makeup') {
        setCurrentPage('shop');
      }
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    handleNavigate('product');
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onProductClick={navigateToProduct} addToCart={addToCart} products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />;
      case 'shop':
        return <ShopPage onNavigate={handleNavigate} onProductClick={navigateToProduct} addToCart={addToCart} category="all" searchQuery={searchQuery} products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />;
      case 'skincare':
        return <ShopPage onNavigate={handleNavigate} onProductClick={navigateToProduct} addToCart={addToCart} category="skincare" searchQuery={searchQuery} products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />;
      case 'makeup':
        return <ShopPage onNavigate={handleNavigate} onProductClick={navigateToProduct} addToCart={addToCart} category="makeup" searchQuery={searchQuery} products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage userInfo={userInfo} setUserInfo={setUserInfo} onNavigate={handleNavigate} orders={orders} />;
      case 'admin':
        return <AdminPage
          products={products}
          orders={orders}
          onUpdateProduct={handleUpdateProduct}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onNavigate={handleNavigate}
        />;
      case 'wishlist':
        return <WishlistPage
          wishlist={wishlist}
          products={products}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
          onNavigate={handleNavigate}
          onProductClick={navigateToProduct}
        />;
      case 'product':
        return <ProductPage
          product={selectedProduct}
          onNavigate={handleNavigate}
          addToCart={addToCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />;
      case 'cart':
        return <CartPage
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          onNavigate={handleNavigate}
        />;
      case 'checkout-shipping':
        return <CheckoutShippingPage
          cart={cart}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          onNavigate={handleNavigate}
        />;
      case 'checkout-payment':
        return <CheckoutPaymentPage
          cart={cart}
          userInfo={userInfo}
          onNavigate={handleNavigate}
        />;
      case 'success':
        return <OrderSuccessPage userInfo={userInfo} onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} onProductClick={navigateToProduct} addToCart={addToCart} products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />;
    }
  };

  const isCheckout = currentPage.startsWith('checkout') || currentPage === 'success' || currentPage === 'admin';
  const isImmersiveHeader = currentPage === 'home' || currentPage === 'about';

  return (
    <div className={`relative min-h-screen flex flex-col ${currentPage === 'product' ? 'font-newsreader' : 'font-display'}`}>
      {!isCheckout && <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} onNavigate={handleNavigate} currentPage={currentPage} onSearch={handleSearch} searchQuery={searchQuery} wishlistCount={wishlist.length} />}
      <main className={`flex-1 ${!isCheckout && !isImmersiveHeader ? 'pt-32 md:pt-36' : ''}`}>
        <div key={currentPage} className="animate-page">
          {renderPage()}
        </div>
      </main>
      {!isCheckout && <Footer onNavigate={handleNavigate} />}
    </div>
  );
};

export default App;