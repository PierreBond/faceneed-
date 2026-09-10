import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const shippingCustom = req.scope.resolve("shipping-custom")
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { district, status, limit = "20", offset = "0" } = req.query

  try {
    await shippingCustom.initializeDistrictConfigs()

    const filters: Record<string, any> = {}
    if (district) filters.district = district
    if (status) filters.status = status

    const { data: windows, metadata } = await query.graph({
      entity: "shipping_window",
      fields: [
        "id",
        "district",
        "region",
        "window_start",
        "window_end",
        "status",
        "order_ids",
        "min_orders",
        "base_fee",
        "estimated_total_cost",
        "final_fee_per_order",
        "created_at",
        "updated_at",
      ],
      filters,
      pagination: {
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      },
      order: { created_at: "DESC" },
    })

    const windowsWithCounts = windows.map((w: any) => ({
      ...w,
      current_orders: w.order_ids?.length || 0,
    }))

    res.json({
      windows: windowsWithCounts,
      count: metadata?.count || windows.length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error) {
    console.error("Error fetching shipping windows:", error)
    res.status(500).json({ error: "Failed to fetch shipping windows" })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const shippingCustom = req.scope.resolve("shipping-custom")
  const { district, region, window_duration_hours, min_orders, base_logistics_cost } = req.body as {
    district: string
    region: string
    window_duration_hours?: number
    min_orders?: number
    base_logistics_cost?: number
  }

  if (!district || !region) {
    return res.status(400).json({ error: "District and region are required" })
  }

  try {
    const config = await shippingCustom.windowManager.updateDistrictConfig({
      district,
      region,
      window_duration_hours: window_duration_hours || 24,
      min_orders: min_orders || 5,
      base_logistics_cost: base_logistics_cost || 10000,
      is_active: true,
    })

    await shippingCustom.initializeDistrictConfigs()

    res.status(201).json({ config })
  } catch (error) {
    console.error("Error creating district config:", error)
    res.status(500).json({ error: "Failed to create district config" })
  }
}