import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
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
import AuthPage from './pages/AuthPage';
import { Product, Order, OrderStatus } from './types';
import { 
  useCartStore, 
  useWishlistStore, 
  useUserStore, 
  useProductStore, 
  useOrderStore 
} from './store';



const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const { fetchProducts } = useProductStore();
  const { initCart } = useCartStore();
  const { initUser } = useUserStore();

  // Initial Data Fetch
  useEffect(() => {
    fetchProducts();
    initCart();
    initUser();
  }, [fetchProducts, initCart, initUser]);

  // Dynamic theme color based on current path
  useEffect(() => {
    const root = document.documentElement;
    const path = location.pathname;

    if (path === '/' || path.startsWith('/shop') || path === '/about' || path === '/profile' || path === '/admin' || path === '/wishlist' || path === '/checkout-payment') {
        root.style.setProperty('--color-primary', '#ee2b6c'); // Pink
    } else if (path.startsWith('/product')) {
        root.style.setProperty('--color-primary', '#e6a219'); // Gold
    } else if (path === '/cart' || path === '/success') {
        root.style.setProperty('--color-primary', '#eba747'); // Gold/Orange
    } else if (path === '/checkout-shipping') {
        root.style.setProperty('--color-primary', '#368ce2'); // Blue
    } else {
        root.style.setProperty('--color-primary', '#ee2b6c');
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);



  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
        navigate('/shop');
    }
  };

  const navigateToProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
  };



  const isCheckout = location.pathname.startsWith('/checkout') || location.pathname === '/success' || location.pathname === '/admin';
  const isImmersiveHeader = location.pathname === '/' || location.pathname === '/about';

  return (
    <div className={`relative min-h-screen flex flex-col ${location.pathname.startsWith('/product') ? 'font-newsreader' : 'font-display'}`}>
      {!isCheckout && <Navbar onSearch={handleSearch} searchQuery={searchQuery} />}
      <main className={`flex-1 ${!isCheckout && !isImmersiveHeader ? 'pt-32 md:pt-36' : ''}`}>
        <div key={location.pathname} className="animate-page">
          <Routes>
            <Route path="/" element={<HomePage onNavigate={navigate} onProductClick={navigateToProduct} />} />
            <Route path="/shop" element={<ShopPage onNavigate={navigate} onProductClick={navigateToProduct} category="all" searchQuery={searchQuery} />} />
            <Route path="/skincare" element={<ShopPage onNavigate={navigate} onProductClick={navigateToProduct} category="skincare" searchQuery={searchQuery} />} />
            <Route path="/makeup" element={<ShopPage onNavigate={navigate} onProductClick={navigateToProduct} category="makeup" searchQuery={searchQuery} />} />
            <Route path="/about" element={<AboutPage onNavigate={navigate} />} />
            <Route path="/profile" element={<ProfilePage onNavigate={navigate} />} />
            <Route path="/admin" element={<AdminPage onNavigate={navigate} />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/wishlist" element={<WishlistPage onNavigate={navigate} onProductClick={navigateToProduct} />} />
            <Route path="/product/:id" element={<ProductPage onNavigate={navigate} />} />
            <Route path="/cart" element={<CartPage onNavigate={navigate} />} />
            <Route path="/checkout-shipping" element={<CheckoutShippingPage onNavigate={navigate} />} />
            <Route path="/checkout-payment" element={<CheckoutPaymentPage onNavigate={navigate} />} />
            <Route path="/success" element={<OrderSuccessPage onNavigate={navigate} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      {!isCheckout && <Footer onNavigate={navigate} />}
    </div>
  );
};

export default App;