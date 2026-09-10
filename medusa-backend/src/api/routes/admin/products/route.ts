import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"

const createProductSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  handle: z.string().min(1).max(100).optional(),
  price: z.number().positive(),
  compare_at_price: z.number().positive().optional(),
  category_id: z.string().uuid(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
  })).min(1).max(10),
  status: z.enum(["draft", "published"]).default("draft"),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string()).optional(),
  seo_title: z.string().max(60).optional(),
  seo_description: z.string().max(160).optional(),
})

const updateProductSchema = createProductSchema.partial()

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { status, category_id, limit = "20", offset = "0", q } = req.query

  try {
    const filters: Record<string, any> = {}
    if (status) filters.status = status
    if (category_id) filters.category_id = category_id
    if (q) filters.$or = [
      { title: { $ilike: `%${q}%` } },
      { description: { $ilike: `%${q}%` } },
    ]

    const { data: products, metadata } = await query.graph({
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
      filters,
      pagination: {
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      },
      order: { created_at: "DESC" },
    })

    const productsWithPrice = products.map((p: any) => ({
      ...p,
      price: p.variants?.[0]?.prices?.[0]?.amount || 0,
      currency_code: p.variants?.[0]?.prices?.[0]?.currency_code || "ghs",
      compare_at_price: p.variants?.[0]?.prices?.[1]?.amount || null,
    }))

    res.json({
      products: productsWithPrice,
      count: metadata?.count || products.length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ error: "Failed to fetch products" })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const productModule = req.scope.resolve("product")
  const fileModule = req.scope.resolve("file")

  const validation = createProductSchema.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid input", details: validation.error.flatten() })
  }

  const data = validation.data

  try {
    // Create product
    const product = await productModule.createProducts([{
      title: data.title,
      description: data.description,
      handle: data.handle || data.title.toLowerCase().replace(/\s+/g, "-"),
      status: data.status,
      thumbnail: data.images[0]?.url,
      images: data.images.map((img, i) => ({
        url: img.url,
        alt: img.alt || `${data.title} image ${i + 1}`,
      })),
      category_ids: [data.category_id],
      tags: data.tags || [],
      metadata: data.metadata || {},
      options: [], // No variants for cosmetics
    }])

    const created = product[0]

    // Create single variant with price
    await productModule.createProductVariants([{
      product_id: created.id,
      title: "Default",
      prices: [
        {
          amount: Math.round(data.price * 100),
          currency_code: "ghs",
        },
        ...(data.compare_at_price ? [{
          amount: Math.round(data.compare_at_price * 100),
          currency_code: "ghs",
        }] : []),
      ],
      manage_inventory: true,
      inventory_quantity: 100,
      allow_backorder: false,
    }])

    // Fetch complete product
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { data: fullProduct } = await query.graph({
      entity: "product",
      fields: ["*"],
      filters: { id: created.id },
    })

    res.status(201).json({ product: fullProduct[0] })
  } catch (error) {
    console.error("Error creating product:", error)
    res.status(500).json({ error: "Failed to create product" })
  }
}