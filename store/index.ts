import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, UserInfo, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { ApiService } from '../services/api';

// --- Cart Store ---
interface CartState {
  cart: CartItem[];
  cartId: string | null;
  isLoading: boolean;
  initCart: () => Promise<void>;
  addItem: (product: Product, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, delta: number) => Promise<void>;
  clearCart: () => void;
}

const mapMedusaItemToCartItem = (item: any): CartItem => ({
  id: item.id, // Line Item ID
  name: item.title,
  description: '',
  price: item.unit_price / 100,
  image: item.thumbnail || '',
  category: '',
  quantity: item.quantity,
  // We might need the product_id or variant_id for navigation from cart
});

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      cartId: null,
      isLoading: false,

      initCart: async () => {
        const { cartId } = get();
        set({ isLoading: true });
        try {
          let medusaCart;
          if (cartId) {
            const { cart } = await ApiService.cart.retrieve(cartId);
            medusaCart = cart;
          } else {
            const { cart } = await ApiService.cart.create();
            medusaCart = cart;
          }
          
          set({ 
            cartId: medusaCart.id, 
            cart: medusaCart.items.map(mapMedusaItemToCartItem),
            isLoading: false 
          });
        } catch (err) {
          console.error("Failed to initialize Medusa cart:", err);
          set({ isLoading: false });
        }
      },

      addItem: async (product, quantity) => {
        const { cartId, initCart } = get();
        if (!cartId) await initCart();
        
        const currentCartId = get().cartId;
        if (!currentCartId) return;

        set({ isLoading: true });
        try {
          // Use variantId if available (from Medusa), fallback to product.id for mock interactions
          const idToUse = product.variantId || product.id;
          const { cart } = await ApiService.cart.addItem(currentCartId, idToUse, quantity);
          set({ cart: cart.items.map(mapMedusaItemToCartItem), isLoading: false });
        } catch (err) {
          console.error("Failed to add item to Medusa cart:", err);
          set({ isLoading: false });
        }
      },

      removeItem: async (lineItemId) => {
        const { cartId } = get();
        if (!cartId) return;

        set({ isLoading: true });
        try {
          const { cart } = await ApiService.cart.removeItem(cartId, lineItemId);
          set({ cart: cart.items.map(mapMedusaItemToCartItem), isLoading: false });
        } catch (err) {
          console.error("Failed to remove item from Medusa cart:", err);
          set({ isLoading: false });
        }
      },

      updateQuantity: async (lineItemId, delta) => {
        const { cartId, cart } = get();
        if (!cartId) return;

        const item = cart.find(i => i.id === lineItemId);
        if (!item) return;

        const newQuantity = Math.max(1, item.quantity + delta);
        
        set({ isLoading: true });
        try {
          const { cart: updatedCart } = await ApiService.cart.updateItem(cartId, lineItemId, newQuantity);
          set({ cart: updatedCart.items.map(mapMedusaItemToCartItem), isLoading: false });
        } catch (err) {
          console.error("Failed to update quantity in Medusa cart:", err);
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ cart: [], cartId: null }),
    }),
    { name: 'faceneed-cart', partialize: (state) => ({ cartId: state.cartId }) }
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
  initUser: () => Promise<void>;
  logout: () => Promise<void>;
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

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userInfo: DEFAULT_USER_INFO,
      setUserInfo: (info) =>
        set((state) => ({
          userInfo: typeof info === 'function' ? info(state.userInfo) : info,
        })),
        
      initUser: async () => {
        try {
            const { customer } = await ApiService.customers.retrieve();
            if (customer) {
                set({ userInfo: {
                    email: customer.email,
                    firstName: customer.first_name || '',
                    lastName: customer.last_name || '',
                    address: customer.billing_address?.address_1 || '',
                    city: customer.billing_address?.city || '',
                    state: customer.billing_address?.province || '',
                    zip: customer.billing_address?.postal_code || '',
                    phone: customer.phone || '',
                }});
            }
        } catch (err) {
            // Not logged in or error
            console.log("No active customer session found.");
        }
      },
      
      logout: async () => {
        try {
            await ApiService.customers.logout();
            set({ userInfo: DEFAULT_USER_INFO });
        } catch (err) {
            console.error("Logout failed:", err);
            set({ userInfo: DEFAULT_USER_INFO });
        }
      }
    }),
    { name: 'faceneed-user' }
  )
);

// --- Product Store ---
interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  updateProduct: (updated: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: INITIAL_PRODUCTS,
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { products } = await ApiService.products.list();
      
      // Map Medusa products to our internal Product type
      const mappedProducts: Product[] = products.map((p: any) => ({
        id: p.id,
        name: p.title,
        description: p.description || '',
        image: p.thumbnail || '',
        price: p.variants?.[0]?.prices?.[0]?.amount ? p.variants[0].prices[0].amount / 100 : 0,
        category: p.collection?.title || 'Uncategorized',
        rating: 5,
        reviews: 0,
        inStock: p.variants?.[0]?.inventory_quantity > 0 || true,
        variantId: p.variants?.[0]?.id // Store variant ID for cart operations
      }));

      set({ products: mappedProducts.length > 0 ? mappedProducts : INITIAL_PRODUCTS, isLoading: false });
    } catch (err: any) {
      console.error("Failed to fetch products from Medusa:", err);
      set({ error: err.message, isLoading: false, products: INITIAL_PRODUCTS });
    }
  },
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
