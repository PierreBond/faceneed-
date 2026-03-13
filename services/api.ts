import Medusa from "@medusajs/medusa-js";

// Use environment variable or default to local Medusa server
const MEDUSA_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const medusa = new Medusa({ 
  baseUrl: MEDUSA_URL, 
  maxRetries: 3 
});

/**
 * API Service Layer to abstract Medusa calls.
 * This provides a single point of interaction for the frontend components.
 */
export const ApiService = {
  // Products
  products: {
    list: async (params = {}) => {
      return await medusa.products.list(params);
    },
    retrieve: async (id: string) => {
      return await medusa.products.retrieve(id);
    },
    listCategories: async () => {
      return await medusa.productCategories.list();
    }
  },

  // Collections
  collections: {
    list: async () => {
        return await medusa.collections.list();
    }
  },

  // Cart
  cart: {
    create: async () => {
      return await medusa.carts.create();
    },
    retrieve: async (cartId: string) => {
      return await medusa.carts.retrieve(cartId);
    },
    addItem: async (cartId: string, variantId: string, quantity: number) => {
      return await medusa.carts.lineItems.create(cartId, {
        variant_id: variantId,
        quantity
      });
    },
    updateItem: async (cartId: string, lineId: string, quantity: number) => {
        return await medusa.carts.lineItems.update(cartId, lineId, {
            quantity
        });
    },
    removeItem: async (cartId: string, lineId: string) => {
        return await medusa.carts.lineItems.delete(cartId, lineId);
    },
    updateAddress: async (cartId: string, address: any) => {
        return await medusa.carts.update(cartId, {
            shipping_address: address,
            billing_address: address
        });
    },
    listShippingOptions: async (cartId: string) => {
        return await medusa.shippingOptions.listCartOptions(cartId);
    },
    addShippingMethod: async (cartId: string, optionId: string) => {
        return await medusa.carts.addShippingMethod(cartId, {
            option_id: optionId
        });
    },
    createPaymentSessions: async (cartId: string) => {
        return await medusa.carts.createPaymentSessions(cartId);
    },
    setPaymentSession: async (cartId: string, providerId: string) => {
        return await medusa.carts.setPaymentSession(cartId, {
            provider_id: providerId
        });
    },
    complete: async (cartId: string) => {
        return await medusa.carts.complete(cartId);
    }
  },

  // Customers
  customers: {
    login: async (email: string, password: string) => {
      return await medusa.auth.authenticate({
        email,
        password
      });
    },
    register: async (customerData: any) => {
      return await medusa.customers.create(customerData);
    },
    getCurrent: async () => {
      return await medusa.auth.getSession();
    },
    retrieve: async () => {
      return await medusa.customers.retrieve();
    },
    logout: async () => {
      return await medusa.auth.deleteSession();
    }
  }
};
