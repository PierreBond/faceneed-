import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"

const updateProductSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  compare_at_price: z.number().positive().optional(),
  category_id: z.string().uuid().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
  })).min(1).max(10).optional(),
  status: z.enum(["draft", "published"]).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string()).optional(),
  seo_title: z.string().max(60).optional(),
  seo_description: z.string().max(160).optional(),
})

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params

  try {
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "handle",
        "description",
        "status",
        "thumbnail",
        "images",
        "categories",
        "variants",
        "tags",
        "metadata",
        "created_at",
        "updated_at",
      ],
      filters: { id },
    })

    if (!products.length) {
      return res.status(404).json({ error: "Product not found" })
    }

    const product = products[0]
    const variant = product.variants?.[0]

    res.json({
      product: {
        ...product,
        price: variant?.prices?.[0]?.amount || 0,
        currency_code: variant?.prices?.[0]?.currency_code || "ghs",
        compare_at_price: variant?.prices?.[1]?.amount || null,
        inventory_quantity: variant?.inventory_quantity || 0,
      },
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ error: "Failed to fetch product" })
  }
}

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  const productModule = req.scope.resolve("product")
  const { id } = req.params

  const validation = updateProductSchema.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid input", details: validation.error.flatten() })
  }

  const data = validation.data

  try {
    const updateData: any = {}
    if (data.title) updateData.title = data.title
    if (data.description) updateData.description = data.description
    if (data.status) updateData.status = data.status
    if (data.thumbnail !== undefined) updateData.thumbnail = data.images?.[0]?.url
    if (data.images) updateData.images = data.images.map((img, i) => ({
      url: img.url,
      alt: img.alt || `Image ${i + 1}`,
    }))
    if (data.category_id) updateData.category_ids = [data.category_id]
    if (data.tags) updateData.tags = data.tags
    if (data.metadata) updateData.metadata = data.metadata

    await productModule.updateProducts({ id }, updateData)

    // Update variant price if provided
    if (data.price !== undefined || data.compare_at_price !== undefined) {
      const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
      const { data: products } = await query.graph({
        entity: "product",
        fields: ["variants.id"],
        filters: { id },
      })
      
      const variant = products[0]?.variants?.[0]
      if (variant) {
        const prices = []
        if (data.price !== undefined) {
          prices.push({ amount: Math.round(data.price * 100), currency_code: "ghs" })
        }
        if (data.compare_at_price !== undefined) {
          prices.push({ amount: Math.round(data.compare_at_price * 100), currency_code: "ghs" })
        }
        
        if (prices.length > 0) {
          await productModule.updateProductVariants({ id: variant.id }, { prices })
        }
      }
    }

    res.json({ success: true })
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ error: "Failed to update product" })
  }
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const productModule = req.scope.resolve("product")
  const { id } = req.params

  try {
    await productModule.deleteProducts([id])
    res.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({ error: "Failed to delete product" })
  }
}