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
  metadata?: Record<string, any>;
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

// Shipping Types
export type ShippingType = 'fixed' | 'shared';

export interface ShippingOption {
  id: string;
  name: 'Express' | 'Shared';
  type: ShippingType;
  amount: number; // in pesewas
  district?: string;
  metadata?: {
    window_id?: string;
    min_orders?: number;
    current_orders?: number;
    estimated_delivery?: string;
    fee_range?: { min: number; max: number };
  };
}

export interface ShippingWindowStatus {
  window_id: string;
  district: string;
  status: 'open' | 'closing' | 'closed' | 'processing' | 'completed';
  current_orders: number;
  min_orders: number;
  base_fee: number;
  estimated_fee_range: { min: number; max: number };
  window_closes_in: string;
  final_fee_per_order?: number;
}

export interface OrderShippingWindowInfo {
  order_id: string;
  window_id: string;
  district: string;
  status: 'pending' | 'confirmed' | 'processing' | 'completed';
  estimated_fee: number;
  final_fee?: number;
}

// Ghana districts for shipping
export const GHANA_DISTRICTS = [
  // Greater Accra
  'Sowutuom', 'East Legon', 'Adenta', 'Madina', 'Tema', 'Ashaiman', 
  'Accra Central', 'Dansoman', 'Laterbiokorshie', 'Ablekuma',
  // Ashanti
  'Kumasi Central', 'Suame', 'Tafo', 'Asokwa', 'Kwadaso',
  // Western
  'Takoradi', 'Sekondi',
  // Central
  'Cape Coast',
  // Northern
  'Tamale',
  // Volta
  'Ho',
  // Eastern
  'Koforidua',
  // Bono
  'Sunyani',
  // Upper East
  'Bolgatanga',
  // Upper West
  'Wa',
] as const;

export type GhanaDistrict = typeof GHANA_DISTRICTS[number];

export function detectDistrict(address: string): GhanaDistrict | null {
  const lowerAddress = address.toLowerCase();
  for (const district of GHANA_DISTRICTS) {
    if (lowerAddress.includes(district.toLowerCase())) {
      return district;
    }
  }
  return null;
}