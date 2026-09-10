import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const { data: categories } = await query.graph({
      entity: "product_category",
      fields: ["id", "name", "handle", "parent_category_id", "is_active", "category_children"],
      filters: { is_active: true },
      order: { name: "ASC" },
    })

    // Build hierarchy
    const categoryMap = new Map(categories.map(c => [c.id, { ...c, children: [] }]))
    const rootCategories = []

    for (const cat of categories) {
      const withChildren = categoryMap.get(cat.id)!
      if (cat.parent_category_id) {
        const parent = categoryMap.get(cat.parent_category_id)
        if (parent) parent.children.push(withChildren)
      } else {
        rootCategories.push(withChildren)
      }
    }

    res.json({ categories: rootCategories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
}