import { defineMiddlewares } from "@medusajs/framework/http"
import { adminGuard } from "../middlewares/admin-guard"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/shipping-windows*",
      middlewares: [adminGuard],
    },
    {
      matcher: "/admin/shipping-districts*",
      middlewares: [adminGuard],
    },
    {
      matcher: "/admin/products*",
      middlewares: [adminGuard],
    },
    {
      matcher: "/admin/categories*",
      middlewares: [adminGuard],
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