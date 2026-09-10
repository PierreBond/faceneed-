import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const shippingCustom = req.scope.resolve("shipping-custom")
  const { district, cart_id } = req.query

  let targetDistrict = district as string

  if (!targetDistrict && cart_id) {
    // In production, fetch cart shipping address to determine district
    // For now, we'll require district parameter
  }

  if (!targetDistrict) {
    return res.status(400).json({ error: "District parameter is required" })
  }

  try {
    await shippingCustom.initializeDistrictConfigs()
    const options = await shippingCustom.getShippingOptions(targetDistrict)

    res.json({ shipping_options: options })
  } catch (error) {
    console.error("Error fetching shipping options:", error)
    res.status(500).json({ error: "Failed to fetch shipping options" })
  }
}