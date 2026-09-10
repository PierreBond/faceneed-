import { Module } from "@medusajs/framework/utils"
import AdminProductsService from "./services/admin-products"

export const ADMIN_PRODUCTS_MODULE = "admin-products"

@Module(ADMIN_PRODUCTS_MODULE, {
  service: AdminProductsService,
})
export default class AdminProductsModule {}