export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock?: boolean;
  variantId?: string; // Added for Medusa integration
}

export interface CartItem extends Product {
  quantity: number;
}

export type PageView = 
  | 'home' 
  | 'shop' 
  | 'skincare'
  | 'makeup'
  | 'about'
  | 'profile'
  | 'admin'
  | 'product' 
  | 'cart' 
  | 'wishlist'
  | 'checkout-shipping' 
  | 'checkout-payment' 
  | 'success';

export interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: string[]; // Image URLs for preview
  customerName: string; // Added for admin view
}