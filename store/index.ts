import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, UserInfo, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

// --- Cart Store ---
interface CartState {
  cart: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addItem: (product, quantity) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity }] };
        }),
      removeItem: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, delta) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
            )
        })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'faceneed-cart' }
  )
);

// --- Wishlist Store ---
interface WishlistState {
  wishlist: string[]; // Store IDs
  toggleWishlist: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      wishlist: [],
      toggleWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.includes(id)
            ? state.wishlist.filter((itemId) => itemId !== id)
            : [...state.wishlist, id],
        })),
    }),
    { name: 'faceneed-wishlist' }
  )
);

// --- Theme Store ---
interface ThemeState {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  darkMode: false,
  setDarkMode: (dark) => set({ darkMode: dark }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));

// --- User Store ---
interface UserState {
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo | ((prev: UserInfo) => UserInfo)) => void;
}

const DEFAULT_USER_INFO: UserInfo = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
};

export const useUserStore = create<UserState>((set) => ({
  userInfo: DEFAULT_USER_INFO,
  setUserInfo: (info) =>
    set((state) => ({
      userInfo: typeof info === 'function' ? info(state.userInfo) : info,
    })),
}));

// --- Product Store ---
interface ProductState {
  products: Product[];
  updateProduct: (updated: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: INITIAL_PRODUCTS,
  updateProduct: (updated) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === updated.id ? updated : p)),
    })),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  deleteProduct: (id) =>
    set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
}));

// --- Order Store ---
interface OrderState {
  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [], // Will be initialized or fetched
  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),
}));
