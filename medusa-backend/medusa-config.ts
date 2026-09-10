import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:3000",
      jwtSecret: process.env.JWT_SECRET || "super-secret-jwt-token-change-in-production",
      cookieSecret: process.env.COOKIE_SECRET || "super-secret-cookie-token-change-in-production",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "@medusajs/fulfillment-manual",
            id: "manual",
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
            },
          },
          {
            resolve: "@medusajs/payment-paystack",
            id: "paystack",
            options: {
              secretKey: process.env.PAYSTACK_SECRET_KEY,
            },
          },
        ],
      },
    },
    {
      resolve: "./src/modules/shipping-custom",
      options: {},
    },
    {
      resolve: "./src/modules/admin-products",
      options: {},
    },
  ],
  plugins: [],
})