import { defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/shipping-windows*",
      middlewares: ["auth", "admin"],
    },
    {
      matcher: "/admin/shipping-districts*",
      middlewares: ["auth", "admin"],
    },
    {
      matcher: "/store/shipping-options*",
      middlewares: ["cors"],
    },
    {
      matcher: "/store/shipping-windows*",
      middlewares: ["cors"],
    },
  ],
})