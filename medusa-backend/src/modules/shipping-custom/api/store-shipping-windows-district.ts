import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const shippingCustom = req.scope.resolve("shipping-custom")
  const { district } = req.params

  try {
    await shippingCustom.initializeDistrictConfigs()
    const window = await shippingCustom.windowManager.getOrCreateWindow(district)
    const status = await shippingCustom.windowManager.getWindowStatus(window.id)

    res.json({ window: status })
  } catch (error) {
    console.error("Error fetching district window:", error)
    res.status(500).json({ error: "Failed to fetch window status" })
  }
}