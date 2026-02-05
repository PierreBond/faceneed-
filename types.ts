export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
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
  | 'product' 
  | 'cart' 
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