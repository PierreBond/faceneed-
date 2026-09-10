import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function seedData({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const shippingCustom = container.resolve("shipping-custom")
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  logger.info("🌱 Seeding Faceneed data...")

  // 1. Create regions and currencies
  await createRegions({ container, logger })

  // 2. Create product categories
  await createCategories({ container, logger })

  // 3. Initialize shipping district configs
  await initializeShippingConfigs({ container, logger })

  // 4. Create sales channels
  await createSalesChannels({ container, logger })

  logger.info("✅ Seeding completed!")
}

async function createRegions({ container, logger }: { container: MedusaContainer; logger: any }) {
  const regionModule = container.resolve("region")

  const ghana = await regionModule.createRegions([
    {
      name: "Ghana",
      currency_code: "ghs",
      countries: ["gh"],
      payment_providers: ["pp_stripe", "pp_paystack"],
      fulfillment_providers: ["manual"],
    },
  ])

  logger.info(`Created region: ${ghana[0].name} (${ghana[0].currency_code})`)
}

async function createCategories({ container, logger }: { container: MedusaContainer; logger: any }) {
  const productCategoryModule = container.resolve("product-category")

  const categories = [
    { name: "Skincare", handle: "skincare", is_active: true },
    { name: "Makeup", handle: "makeup", is_active: true },
    { name: "Local Brands", handle: "local-brands", is_active: true },
    { name: "Serums", handle: "serums", is_active: true, parent_category_id: null },
    { name: "Moisturizers", handle: "moisturizers", is_active: true, parent_category_id: null },
    { name: "Cleansers", handle: "cleansers", is_active: true, parent_category_id: null },
    { name: "Treatments", handle: "treatments", is_active: true, parent_category_id: null },
    { name: "Face", handle: "face", is_active: true, parent_category_id: null },
    { name: "Lips", handle: "lips", is_active: true, parent_category_id: null },
    { name: "Cheek", handle: "cheek", is_active: true, parent_category_id: null },
    { name: "Eyes", handle: "eyes", is_active: true, parent_category_id: null },
  ]

  for (const cat of categories) {
    try {
      await productCategoryModule.createProductCategories(cat)
      logger.info(`Created category: ${cat.name}`)
    } catch (e) {
      logger.info(`Category ${cat.name} already exists`)
    }
  }
}

async function initializeShippingConfigs({ container, logger }: { container: MedusaContainer; logger: any }) {
  const shippingCustom = container.resolve("shipping-custom")
  
  await shippingCustom.initializeDistrictConfigs()
  logger.info("Initialized shipping district configurations")
}

async function createSalesChannels({ container, logger }: { container: MedusaContainer; logger: any }) {
  const salesChannelModule = container.resolve("sales-channel")

  try {
    await salesChannelModule.createSalesChannels([
      {
        name: "Faceneed Web Store",
        description: "Main web storefront",
      },
    ])
    logger.info("Created sales channel: Faceneed Web Store")
  } catch (e) {
    logger.info("Sales channel already exists")
  }
}