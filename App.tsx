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
import { CartItem, Product, UserInfo, Order, OrderStatus } from './types';
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
  const navigate = useNavigate();
  const location = useLocation();
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

  // Persistence: Sync state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('faceneed_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('faceneed_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
        navigate('/shop');
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
    navigate(`/product/${product.id}`);
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

  const isCheckout = location.pathname.startsWith('/checkout') || location.pathname === '/success' || location.pathname === '/admin';
  const isImmersiveHeader = location.pathname === '/' || location.pathname === '/about';

  return (
    <div className={`relative min-h-screen flex flex-col ${location.pathname.startsWith('/product') ? 'font-newsreader' : 'font-display'}`}>
      {!isCheckout && <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} onNavigate={(path) => navigate(path)} currentPage={location.pathname} onSearch={handleSearch} searchQuery={searchQuery} wishlistCount={wishlist.length} />}
      <main className={`flex-1 ${!isCheckout && !isImmersiveHeader ? 'pt-32 md:pt-36' : ''}`}>
        <div key={location.pathname} className="animate-page">
          <Routes>
            <Route path="/" element={<HomePage onNavigate={navigate} onProductClick={navigateToProduct} addToCart={addToCart} products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
            <Route path="/shop" element={<ShopPage onNavigate={navigate} onProductClick={navigateToProduct} addToCart={addToCart} category="all" searchQuery={searchQuery} products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
            <Route path="/skincare" element={<ShopPage onNavigate={navigate} onProductClick={navigateToProduct} addToCart={addToCart} category="skincare" searchQuery={searchQuery} products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
            <Route path="/makeup" element={<ShopPage onNavigate={navigate} onProductClick={navigateToProduct} addToCart={addToCart} category="makeup" searchQuery={searchQuery} products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
            <Route path="/about" element={<AboutPage onNavigate={navigate} />} />
            <Route path="/profile" element={<ProfilePage userInfo={userInfo} setUserInfo={setUserInfo} onNavigate={navigate} orders={orders} />} />
            <Route path="/admin" element={<AdminPage
              products={products}
              orders={orders}
              onUpdateProduct={handleUpdateProduct}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onNavigate={navigate}
            />} />
            <Route path="/wishlist" element={<WishlistPage
              wishlist={wishlist}
              products={products}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
              onNavigate={navigate}
              onProductClick={navigateToProduct}
            />} />
            <Route path="/product/:id" element={<ProductPage
              product={selectedProduct}
              onNavigate={navigate}
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />} />
            <Route path="/cart" element={<CartPage
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              onNavigate={navigate}
            />} />
            <Route path="/checkout-shipping" element={<CheckoutShippingPage
              cart={cart}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              onNavigate={navigate}
            />} />
            <Route path="/checkout-payment" element={<CheckoutPaymentPage
              cart={cart}
              userInfo={userInfo}
              onNavigate={navigate}
            />} />
            <Route path="/success" element={<OrderSuccessPage userInfo={userInfo} onNavigate={navigate} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      {!isCheckout && <Footer onNavigate={navigate} />}
    </div>
  );
};

export default App;