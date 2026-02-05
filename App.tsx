import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutShippingPage from './pages/CheckoutShippingPage';
import CheckoutPaymentPage from './pages/CheckoutPaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import { PageView, CartItem, Product, UserInfo } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
      case 'checkout-payment':
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
    // Optional: Auto navigate to cart or show toast
    // setCurrentPage('cart'); 
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

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} onProductClick={navigateToProduct} addToCart={addToCart} />;
      case 'shop':
        return <ShopPage onNavigate={setCurrentPage} onProductClick={navigateToProduct} addToCart={addToCart} category="all" />;
      case 'skincare':
        return <ShopPage onNavigate={setCurrentPage} onProductClick={navigateToProduct} addToCart={addToCart} category="skincare" />;
      case 'makeup':
        return <ShopPage onNavigate={setCurrentPage} onProductClick={navigateToProduct} addToCart={addToCart} category="makeup" />;
      case 'about':
        return <AboutPage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage userInfo={userInfo} setUserInfo={setUserInfo} onNavigate={setCurrentPage} />;
      case 'product':
        return <ProductPage 
          product={selectedProduct} 
          onNavigate={setCurrentPage} 
          addToCart={addToCart} 
        />;
      case 'cart':
        return <CartPage 
          cart={cart} 
          updateQuantity={updateQuantity} 
          removeFromCart={removeFromCart} 
          onNavigate={setCurrentPage} 
        />;
      case 'checkout-shipping':
        return <CheckoutShippingPage 
          cart={cart} 
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          onNavigate={setCurrentPage} 
        />;
      case 'checkout-payment':
        return <CheckoutPaymentPage 
          cart={cart} 
          userInfo={userInfo}
          onNavigate={setCurrentPage} 
        />;
      case 'success':
        return <OrderSuccessPage userInfo={userInfo} onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} onProductClick={navigateToProduct} addToCart={addToCart} />;
    }
  };

  // Some pages have specific layouts or headers, but we will wrap them all in the main layout structure
  // Exceptions can be handled inside the components if they need to hide the nav/footer
  const isCheckout = currentPage.startsWith('checkout') || currentPage === 'success';

  return (
    <div className={`relative min-h-screen flex flex-col ${currentPage === 'product' ? 'font-newsreader' : 'font-display'}`}>
      {!isCheckout && <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} onNavigate={setCurrentPage} currentPage={currentPage} />}
      <main className="flex-1">
        {/* The key ensures the animation plays when the page changes */}
        <div key={currentPage} className="animate-page">
          {renderPage()}
        </div>
      </main>
      {!isCheckout && <Footer onNavigate={setCurrentPage} />}
    </div>
  );
};

export default App;