import { Module } from "@medusajs/framework/utils"
import ShippingCustomService from "./services/shipping-custom"

export const SHIPPING_CUSTOM_MODULE = "shipping-custom"

@Module(SHIPPING_CUSTOM_MODULE, {
  service: ShippingCustomService,
})
export default class ShippingCustomModule {}