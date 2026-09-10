import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const shippingCustom = req.scope.resolve("shipping-custom")
  const { id } = req.params

  try {
    await shippingCustom.initializeDistrictConfigs()
    const status = await shippingCustom.windowManager.getWindowStatus(id)

    if (!status) {
      return res.status(404).json({ error: "Window not found" })
    }

    res.json({ window: status })
  } catch (error) {
    console.error("Error fetching window status:", error)
    res.status(500).json({ error: "Failed to fetch window status" })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const shippingCustom = req.scope.resolve("shipping-custom")
  const { id } = req.params
  const { action } = req.body as { action: "close" | "recalculate" }

  if (!action || !["close", "recalculate"].includes(action)) {
    return res.status(400).json({ error: "Invalid action. Use 'close' or 'recalculate'" })
  }

  try {
    await shippingCustom.initializeDistrictConfigs()

    let result
    if (action === "close") {
      result = await shippingCustom.windowManager.closeWindow(id)
    } else {
      const fee = await shippingCustom.windowManager.recalculateWindow(id)
      result = { final_fee_per_order: fee }
    }

    if (!result) {
      return res.status(404).json({ error: "Window not found or cannot be processed" })
    }

    res.json({ success: true, ...result })
  } catch (error) {
    console.error(`Error ${action} window:`, error)
    res.status(500).json({ error: `Failed to ${action} window` })
  }
}