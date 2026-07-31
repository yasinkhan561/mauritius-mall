import { Metadata } from "next"

import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import HomeHero from "@modules/home/components/hero"
import ProductPreview from "@modules/products/components/product-preview"

export const metadata: Metadata = {
  title: "Mauritius Mall | Shop Online with Free Shipping",
  description:
    "Discover hot deals, new arrivals, and trending products. Shop local collections with fast delivery across Mauritius.",
}

const VALUE_PROPS = [
  {
    title: "Island-Wide Express",
    description: "Fast delivery to all districts",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h2v5H3v-5zm4-4h2v9H7V9zm4-4h2v13h-2V5zm4 6h2v7h-2v-7zm4-3h2v10h-2V8z" />
      </svg>
    ),
  },
  {
    title: "MCB Juice & Cards",
    description: "Secure local payment gateways",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    title: "Easy Returns",
    description: "Hassle-free local support",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
      </svg>
    ),
  },
  {
    title: "100% Authentic",
    description: "Genuine quality products",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" />
      </svg>
    ),
  },
]

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title, metadata, *products",
  })

  if (!region) {
    return null
  }

  const hotDeals =
    collections?.find(
      (c) =>
        c.handle === "hot-deals" ||
        c.metadata?.is_hot === true ||
        c.metadata?.is_hot === "true"
    ) ?? collections?.[0]

  const trending =
    collections?.find((c) => c.handle === "trending") ??
    collections?.[1] ??
    collections?.[0]

  const {
    response: { products: trendingProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 8,
      fields: "*variants.calculated_price",
      ...(trending?.id ? { collection_id: trending.id } : {}),
    },
  })

  // Prefer priced products from listProducts so the chip can show MUR amounts
  const featuredProduct = trendingProducts?.[0] ?? null
  const featuredPrice = featuredProduct
    ? getProductPrice({ product: featuredProduct }).cheapestPrice
    : null

  return (
    <div className="content-container py-6 md:py-8 flex flex-col gap-8 md:gap-10">
      <HomeHero
        featuredProduct={featuredProduct}
        featuredPrice={featuredPrice}
        hotDealsHref={hotDeals ? `/collections/${hotDeals.handle}` : "/store"}
        storeHref="/store"
      />

      {/* Value props */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {VALUE_PROPS.map((prop) => (
          <div
            key={prop.title}
            className="bg-surface-container-lowest p-6 rounded-xl shadow-ambient text-center flex flex-col items-center gap-3 transition-ambient shadow-ambient-hover border border-transparent hover:border-[rgba(0,168,150,0.2)]"
          >
            <div className="w-12 h-12 rounded-full bg-[rgba(2,128,144,0.1)] flex items-center justify-center text-primary-container mb-2">
              {prop.icon}
            </div>
            <h3 className="font-bold text-on-surface">{prop.title}</h3>
            <p className="text-sm text-on-surface-variant">{prop.description}</p>
          </div>
        ))}
      </section>

      {/* Trending */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-headline-lg text-on-surface">Trending Today</h2>
            <p className="text-on-surface-variant mt-1">
              Top picks loved by locals this week.
            </p>
          </div>
          <LocalizedClientLink
            href={trending ? `/collections/${trending.handle}` : "/store"}
            className="text-lagoon-teal text-label-md flex items-center gap-1 hover:underline shrink-0"
          >
            View All <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        </div>

        {trendingProducts?.length ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.slice(0, 4).map((product) => (
              <li key={product.id}>
                <ProductPreview product={product} region={region} isFeatured />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-on-surface-variant">
            No products yet. Check back soon.
          </p>
        )}
      </section>

      {/* Collection rails */}
      {collections && collections.length > 0 && (
        <section className="flex flex-col gap-stack-lg">
          {collections
            .filter((c) => c.id !== trending?.id)
            .slice(0, 2)
            .map((collection) => (
              <CollectionRail
                key={collection.id}
                collectionId={collection.id}
                title={collection.title}
                handle={collection.handle}
                regionId={region.id}
                region={region}
              />
            ))}
        </section>
      )}
    </div>
  )
}

async function CollectionRail({
  collectionId,
  title,
  handle,
  regionId,
  region,
}: {
  collectionId: string
  title: string
  handle: string
  regionId: string
  region: Awaited<ReturnType<typeof getRegion>>
}) {
  if (!region) return null

  const {
    response: { products },
  } = await listProducts({
    regionId,
    queryParams: {
      collection_id: collectionId,
      limit: 4,
      fields: "*variants.calculated_price",
    },
  })

  if (!products?.length) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-lg text-on-surface">{title}</h2>
        <LocalizedClientLink
          href={`/collections/${handle}`}
          className="text-lagoon-teal text-label-md hover:underline"
        >
          View All →
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>
    </div>
  )
}
