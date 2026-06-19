const MEDUSA_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${MEDUSA_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Medusa API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const ApiService = {
  // Products
  products: {
    list: async (params: Record<string, any> = {}) => {
      const qs = new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return request(`/store/products${qs ? `?${qs}` : ''}`);
    },
    retrieve: async (id: string) => {
      return request(`/store/products/${id}`);
    },
    listCategories: async () => {
      return request('/store/product-categories');
    }
  },

  // Collections
  collections: {
    list: async () => {
      return request('/store/collections');
    }
  },

  // Cart
  cart: {
    create: async () => {
      return request('/store/carts', { method: 'POST' });
    },
    retrieve: async (cartId: string) => {
      return request(`/store/carts/${cartId}`);
    },
    addItem: async (cartId: string, variantId: string, quantity: number) => {
      return request(`/store/carts/${cartId}/line-items`, {
        method: 'POST',
        body: JSON.stringify({ variant_id: variantId, quantity })
      });
    },
    updateItem: async (cartId: string, lineId: string, quantity: number) => {
      return request(`/store/carts/${cartId}/line-items/${lineId}`, {
        method: 'POST',
        body: JSON.stringify({ quantity })
      });
    },
    removeItem: async (cartId: string, lineId: string) => {
      return request(`/store/carts/${cartId}/line-items/${lineId}`, {
        method: 'DELETE'
      });
    },
    updateAddress: async (cartId: string, address: any) => {
      return request(`/store/carts/${cartId}`, {
        method: 'POST',
        body: JSON.stringify({
          shipping_address: address,
          billing_address: address
        })
      });
    },
    listShippingOptions: async (cartId: string) => {
      return request(`/store/shipping-options/${cartId}`);
    },
    addShippingMethod: async (cartId: string, optionId: string) => {
      return request(`/store/carts/${cartId}/shipping-methods`, {
        method: 'POST',
        body: JSON.stringify({ option_id: optionId })
      });
    },
    createPaymentSessions: async (cartId: string) => {
      return request(`/store/carts/${cartId}/payment-sessions`, {
        method: 'POST'
      });
    },
    setPaymentSession: async (cartId: string, providerId: string) => {
      return request(`/store/carts/${cartId}/payment-session`, {
        method: 'POST',
        body: JSON.stringify({ provider_id: providerId })
      });
    },
    complete: async (cartId: string) => {
      return request(`/store/carts/${cartId}/complete`, {
        method: 'POST'
      });
    }
  },

  // Customers
  customers: {
    login: async (email: string, password: string) => {
      return request('/store/auth', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },
    register: async (customerData: any) => {
      return request('/store/customers', {
        method: 'POST',
        body: JSON.stringify(customerData)
      });
    },
    getCurrent: async () => {
      return request('/store/auth');
    },
    retrieve: async () => {
      return request('/store/customers/me');
    },
    logout: async () => {
      return request('/store/auth', { method: 'DELETE' });
    }
  }
};
