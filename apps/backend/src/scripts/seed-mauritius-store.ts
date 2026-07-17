import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows"

const MUR_PRICE = (amount: number) => ({
  amount,
  currency_code: "mur",
})

export default async function seedMauritiusStore({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  )

  logger.info("Seeding Mauritius Mall store data...")

  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Mauritius Mall",
          description: "Primary online storefront for Mauritius Mall",
        },
      ],
    },
  })

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Mauritius Mall Publishable Key",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  })

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  })

  await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "Mauritius Mall",
          supported_currencies: [
            {
              currency_code: "mur",
              is_default: true,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  })

  logger.info("Creating Mauritius region and tax configuration...")
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Mauritius",
          currency_code: "mur",
          countries: ["mu"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  })
  const region = regionResult[0]

  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "mu", provider_id: "tp_system" }],
  })

  logger.info("Creating stock location and fulfillment...")
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Port Louis Fulfillment Centre",
          address: {
            city: "Port Louis",
            country_code: "MU",
            address_1: "Caudan Waterfront",
          },
        },
      ],
    },
  })
  const stockLocation = stockLocationResult[0]

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  })

  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfileResult[0]

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Mauritius Island Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Mauritius",
        geo_zones: [
          {
            country_code: "mu",
            type: "country",
          },
        ],
      },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  })

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Island Standard Delivery",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Delivered in 2-4 business days across Mauritius.",
          code: "standard",
        },
        prices: [
          MUR_PRICE(150),
          {
            region_id: region.id,
            amount: 150,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Port-to-Door",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Next-day delivery in Port Louis and surrounding areas.",
          code: "express",
        },
        prices: [
          MUR_PRICE(350),
          {
            region_id: region.id,
            amount: 350,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  })

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  })

  logger.info("Creating categories, collections, and products...")

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Clothing", is_active: true },
        { name: "Electronics", is_active: true },
        { name: "Home & Living", is_active: true },
        { name: "Toys", is_active: true },
      ],
    },
  })

  const { result: collectionResult } = await createCollectionsWorkflow(
    container
  ).run({
    input: {
      collections: [
        {
          title: "New In",
          handle: "new-in",
          metadata: { segment_label: "New In", is_hot: "true" },
        },
        {
          title: "Hot Deals",
          handle: "hot-deals",
          metadata: { segment_label: "Hot Deals", is_hot: "true" },
        },
        {
          title: "Trending",
          handle: "trending",
          metadata: { segment_label: "Trending" },
        },
      ],
    },
  })

  const categoryByName = (name: string) =>
    categoryResult.find((category) => category.name === name)!.id

  const collectionByHandle = (handle: string) =>
    collectionResult.find((collection) => collection.handle === handle)!.id

  const { result: productOptionsResult } = await createProductOptionsWorkflow(
    container
  ).run({
    input: {
      product_options: [
        {
          title: "Size",
          values: ["S", "M", "L", "XL"],
        },
        {
          title: "Color",
          values: ["Black", "White", "Blue"],
        },
      ],
    },
  })

  const sizeOption = productOptionsResult.find(
    (option) => option.title === "Size"
  )!
  const colorOption = productOptionsResult.find(
    (option) => option.title === "Color"
  )!

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Classic Cotton Polo Shirt",
          category_ids: [categoryByName("Clothing")],
          collection_id: collectionByHandle("new-in"),
          description:
            "Breathable cotton polo designed for Mauritius' warm climate. Perfect for casual office days and weekend outings.",
          handle: "classic-cotton-polo",
          weight: 250,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          metadata: {
            subtitle: "Lightweight essentials for island living.",
          },
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
            },
          ],
          options: [{ id: sizeOption.id }, { id: colorOption.id }],
          variants: [
            {
              title: "M / Blue",
              sku: "POLO-M-BLUE",
              options: { Size: "M", Color: "Blue" },
              prices: [MUR_PRICE(899)],
            },
            {
              title: "L / Blue",
              sku: "POLO-L-BLUE",
              options: { Size: "L", Color: "Blue" },
              prices: [MUR_PRICE(899)],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Wireless Bluetooth Earbuds",
          category_ids: [categoryByName("Electronics")],
          collection_id: collectionByHandle("hot-deals"),
          description:
            "Compact true wireless earbuds with 24-hour battery case and sweat resistance for active island lifestyles.",
          handle: "wireless-bluetooth-earbuds",
          weight: 120,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
            },
          ],
          options: [{ id: colorOption.id }],
          variants: [
            {
              title: "Black",
              sku: "EARBUDS-BLACK",
              options: { Color: "Black" },
              prices: [MUR_PRICE(2499)],
            },
            {
              title: "White",
              sku: "EARBUDS-WHITE",
              options: { Color: "White" },
              prices: [MUR_PRICE(2499)],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Non-Stick Cookware Set",
          category_ids: [categoryByName("Home & Living")],
          collection_id: collectionByHandle("trending"),
          description:
            "Five-piece non-stick cookware set ideal for everyday Mauritian home cooking.",
          handle: "non-stick-cookware-set",
          weight: 4200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
            },
          ],
          variants: [
            {
              title: "Default",
              sku: "COOKWARE-SET",
              prices: [MUR_PRICE(3499)],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Creative Building Blocks Set",
          category_ids: [categoryByName("Toys")],
          collection_id: collectionByHandle("new-in"),
          description:
            "120-piece building blocks set that encourages creativity for children aged 4 and up.",
          handle: "creative-building-blocks",
          weight: 900,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
            },
          ],
          variants: [
            {
              title: "Default",
              sku: "BLOCKS-120",
              prices: [MUR_PRICE(1299)],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Lightweight Running Sneakers",
          category_ids: [categoryByName("Clothing")],
          collection_id: collectionByHandle("trending"),
          description:
            "Cushioned running sneakers with breathable mesh upper, built for coastal walks and morning jogs.",
          handle: "lightweight-running-sneakers",
          weight: 680,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png",
            },
          ],
          options: [{ id: sizeOption.id }],
          variants: [
            {
              title: "Size 40",
              sku: "SNEAKER-40",
              options: { Size: "M" },
              prices: [MUR_PRICE(2199)],
            },
            {
              title: "Size 42",
              sku: "SNEAKER-42",
              options: { Size: "L" },
              prices: [MUR_PRICE(2199)],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "10000mAh Portable Power Bank",
          category_ids: [categoryByName("Electronics")],
          collection_id: collectionByHandle("hot-deals"),
          description:
            "Fast-charging power bank with dual USB ports — essential for travel across the island.",
          handle: "portable-power-bank",
          weight: 240,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png",
            },
          ],
          variants: [
            {
              title: "Default",
              sku: "POWERBANK-10K",
              prices: [MUR_PRICE(1599)],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
      ],
    },
  })

  logger.info("Seeding inventory levels...")
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 1000,
        inventory_item_id: item.id,
      })),
    },
  })

  logger.info("Mauritius Mall seed completed successfully.")
  logger.info(
    `Publishable API Key (save to storefront .env): ${publishableApiKey.id}`
  )
}
