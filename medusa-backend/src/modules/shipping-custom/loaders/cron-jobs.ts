import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function setupShippingCustomCronJobs({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const shippingCustom = container.resolve("shipping-custom")

  const closeWindows = async () => {
    try {
      logger.info("[Shipping Custom] Running window closing cron job")
      
      await shippingCustom.initializeDistrictConfigs()
      
      const closedWindows = await shippingCustom.windowManager.closeExpiredWindows()
      
      for (const window of closedWindows) {
        logger.info(`[Shipping Custom] Closed window ${window.id} for ${window.district} with ${window.order_ids.length} orders`)
      }
      
      await shippingCustom.windowManager.updateClosingSoonWindows()
      
      logger.info("[Shipping Custom] Window closing cron job completed")
    } catch (error) {
      logger.error("[Shipping Custom] Error in window closing cron job:", error)
    }
  }

  return {
    "shipping-custom.close-windows": {
      schedule: "*/15 * * * *",
      handler: closeWindows,
    },
  }
}