import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import FeaturedProducts from "@modules/home/components/featured-products"

const PLACEHOLDERS = [
  "https://placehold.co/1200x600/0056b3/ffffff?text=Shop+Now",
  "https://placehold.co/600x400/ff3e6c/ffffff?text=New+In",
  "https://placehold.co/600x400/ffc107/333333?text=Trending",
]

const FREE_SHIPPING_THRESHOLD = 1500

const SIDE_SEGMENT_LABELS = ["New In", "Trending"]

const DEFAULT_HERO = {
  title: "Shop Mauritius Mall",
  subtitle: "Curated collections, fast local delivery, and exclusive deals.",
  handle: "store",
}

export const metadata: Metadata = {
  title: "Mauritius Mall | Shop Online with Free Shipping",
  description:
    "Discover hot deals, new arrivals, and trending products. Shop local collections with fast delivery across Mauritius.",
}

function getMetadataString(
  metadata: Record<string, unknown> | null | undefined,
  key: string
): string | null {
  const value = metadata?.[key]
  return typeof value === "string" ? value : null
}

function isValidImageUrl(url: string | null | undefined): url is string {
  if (!url) {
    return false
  }

  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

function getCollectionImage(
  collection: HttpTypes.StoreCollection | undefined,
  fallbackIndex: number
): string {
  if (collection) {
    const metaImage =
      getMetadataString(collection.metadata, "banner_image") ??
      getMetadataString(collection.metadata, "image")

    if (isValidImageUrl(metaImage)) {
      return metaImage
    }

    const productThumbnail = collection.products?.[0]?.thumbnail
    if (isValidImageUrl(productThumbnail)) {
      return productThumbnail
    }
  }

  return PLACEHOLDERS[fallbackIndex % PLACEHOLDERS.length]
}

function shouldUseNativeImage(src: string): boolean {
  try {
    const { hostname } = new URL(src)
    return hostname === "placehold.co"
  } catch {
    return true
  }
}

const HERO_IMAGE_SIZES =
  "(max-width: 512px) 88vw, (max-width: 1024px) 66vw, 900px"
const SIDE_IMAGE_SIZES =
  "(max-width: 512px) 88vw, (max-width: 1024px) 88vw, 420px"

function CollectionImage({
  src,
  alt,
  priority = false,
  sizes = HERO_IMAGE_SIZES,
  className,
}: {
  src: string
  alt: string
  priority?: boolean
  sizes?: string
  className?: string
}) {
  if (shouldUseNativeImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={className}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      sizes={sizes}
      className={className}
    />
  )
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title, metadata, *products",
  })

  if (!collections || !region) {
    return null
  }

  const heroCollection = collections[0]
  const sideCollections = [
    collections[1] ?? null,
    collections[2] ?? null,
  ] as const

  const heroTitle = heroCollection?.title ?? DEFAULT_HERO.title
  const heroSubtitle =
    getMetadataString(heroCollection?.metadata, "subtitle") ??
    DEFAULT_HERO.subtitle
  const heroHandle = heroCollection?.handle ?? DEFAULT_HERO.handle
  const heroImage = getCollectionImage(heroCollection, 0)

  const freeShippingLabel = convertToLocale({
    amount: FREE_SHIPPING_THRESHOLD,
    currency_code: region.currency_code,
  })

  const showHotDeals =
    heroCollection?.metadata?.is_hot === true ||
    heroCollection?.metadata?.is_hot === "true" ||
    Boolean(heroCollection)

  return (
    <>
      <aside
        aria-label="Promotions"
        className="w-full border-b border-accent bg-accent/10"
      >
        <div className="content-container flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-2.5 text-xs xsmall:text-sm">
          <span className="inline-flex items-center gap-1.5 font-medium text-primary">
            <span aria-hidden="true" className="text-accent">
              ✓
            </span>
            Free Shipping on orders over {freeShippingLabel}
          </span>
          <span
            aria-hidden="true"
            className="hidden xsmall:inline text-primary/30"
          >
            |
          </span>
          <span className="text-primary/80">
            Prices in {region.currency_code.toUpperCase()}
          </span>
          {showHotDeals && (
            <>
              <span
                aria-hidden="true"
                className="hidden xsmall:inline text-primary/30"
              >
                |
              </span>
              <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-uiBg">
                Hot Deals
              </span>
            </>
          )}
        </div>
      </aside>

      <section
        aria-labelledby="hero-heading"
        className="content-container py-4 small:py-8"
      >
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto no-scrollbar small:grid small:grid-cols-3 small:grid-rows-2 small:gap-4 small:overflow-visible small:snap-none">
          <article className="relative aspect-[16/9] w-[88vw] shrink-0 snap-center overflow-hidden rounded-large small:col-span-2 small:row-span-2 small:aspect-auto small:min-h-[420px] small:w-auto">
            <div className="absolute inset-0 relative">
              <CollectionImage
                src={heroImage}
                alt={heroTitle}
                priority
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-primary/30" />
            <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-5 xsmall:p-6">
              <h1
                id="hero-heading"
                className="text-2xl font-bold leading-tight text-uiBg xsmall:text-4xl"
              >
                {heroTitle}
              </h1>
              <p className="max-w-lg text-sm leading-relaxed text-uiBg/90 xsmall:text-base">
                {heroSubtitle}
              </p>
              <Link
                href={`/${countryCode}/collections/${heroHandle}`}
                className="inline-flex w-fit rounded-large bg-secondary px-6 py-3 text-sm font-semibold text-uiBg transition-colors hover:bg-secondary/90"
              >
                Shop Collection
              </Link>
            </div>
          </article>

          {sideCollections.map((collection, index) => {
            const fallbackIndex = index + 1
            const title =
              collection?.title ??
              (index === 0 ? "New Arrivals" : "Trending Now")
            const segmentLabel =
              getMetadataString(collection?.metadata, "segment_label") ??
              SIDE_SEGMENT_LABELS[index]
            const handle = collection?.handle ?? "store"
            const image = getCollectionImage(collection ?? undefined, fallbackIndex)

            return (
              <article
                key={collection?.id ?? `side-offer-${index}`}
                className="relative aspect-[4/3] w-[88vw] shrink-0 snap-center overflow-hidden rounded-large small:col-span-1 small:w-auto"
              >
                <Link
                  href={`/${countryCode}/collections/${handle}`}
                  className="group relative block h-full w-full"
                >
                  <div className="absolute inset-0 relative">
                    <CollectionImage
                      src={image}
                      alt={title}
                      sizes={SIDE_IMAGE_SIZES}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                  <div className="relative z-10 flex h-full flex-col justify-end p-4">
                    <span className="mb-1 inline-flex w-fit rounded-full border border-accent bg-accent/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      {segmentLabel}
                    </span>
                    <h2 className="text-lg font-bold leading-snug text-uiBg">
                      {title}
                    </h2>
                    <p className="mt-1 text-xs text-uiBg/80">
                      Explore the collection
                    </p>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <nav aria-label="Shop by category" className="content-container pb-2">
        <h2 className="sr-only">Browse collections</h2>
        <ul className="flex gap-3 overflow-x-auto py-4 no-scrollbar">
          {collections.map((collection) => (
            <li key={collection.id} className="shrink-0">
              <Link
                href={`/${countryCode}/collections/${collection.handle}`}
                className="flex w-20 flex-col items-center gap-2 rounded-large border border-accent/30 bg-uiBg p-3 transition-colors hover:border-secondary xsmall:w-24"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold uppercase text-primary"
                >
                  {collection.title.charAt(0)}
                </span>
                <h3 className="line-clamp-2 text-center text-xs font-medium text-primary">
                  {collection.title}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-label="Featured collections" className="py-12">
        <FeaturedProducts collections={collections} region={region} />
      </section>
    </>
  )
}
