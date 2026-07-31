import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { VariantPrice } from "types/global"

/** Stitch lifestyle hero — patio / coastal atmosphere (not a product cutout). */
const LIFESTYLE_HERO_IMAGE =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80"

type HomeHeroProps = {
  featuredProduct?: HttpTypes.StoreProduct | null
  featuredPrice?: VariantPrice | null
  hotDealsHref: string
  storeHref?: string
}

export default function HomeHero({
  featuredProduct,
  featuredPrice,
  hotDealsHref,
  storeHref = "/store",
}: HomeHeroProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 items-center bg-surface-container-lowest rounded-2xl p-4 md:p-6 shadow-ambient relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none bg-[rgba(2,128,144,0.06)]" />

      {/* Left — copy + CTAs */}
      <div className="flex flex-col gap-2.5 md:gap-3 z-10">
        <div className="inline-flex items-center gap-1.5 bg-secondary-container text-secondary px-2.5 py-1 rounded-full w-fit text-xs font-semibold">
          <span aria-hidden="true">☀</span>
          <span>Summer Collection</span>
        </div>

        <h1 className="text-[1.75rem] leading-[1.15] md:text-[2.5rem] md:leading-[1.1] font-bold tracking-tight text-on-surface">
          Discover Island Living{" "}
          <span className="text-primary-container">Essentials</span>
        </h1>

        <p className="text-sm md:text-base leading-relaxed text-on-surface-variant max-w-md">
          Curated products for the modern Mauritian home — local payments and
          fast island-wide delivery.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-0.5">
          <LocalizedClientLink
            href={hotDealsHref}
            className="inline-flex items-center gap-2 bg-coral-gold hover:bg-[#E08D4A] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-md transition-colors"
          >
            Shop Hot Deals
            <span aria-hidden="true">→</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href={storeHref}
            className="inline-flex items-center border-[1.5px] border-lagoon-teal text-lagoon-teal text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[rgba(2,128,144,0.05)] transition-colors"
          >
            Browse Categories
          </LocalizedClientLink>
        </div>
      </div>

      {/* Right — full-bleed lifestyle plane */}
      <div className="relative z-10 w-full h-[240px] md:h-[300px] lg:h-[340px] rounded-xl overflow-hidden group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LIFESTYLE_HERO_IMAGE}
          alt="Sunlit island living space overlooking the coast"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        {featuredProduct && (
          <LocalizedClientLink
            href={`/products/${featuredProduct.handle}`}
            className="absolute bottom-3 left-3 md:bottom-4 md:left-4 max-w-[min(85%,280px)] bg-white/95 backdrop-blur-sm px-3 py-2.5 rounded-lg shadow-sm border border-white/30 hover:bg-white transition-colors"
          >
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">
              Featured Item
            </p>
            <p className="text-sm font-bold text-on-surface line-clamp-1">
              {featuredProduct.title}
            </p>
            {featuredPrice && (
              <p className="text-sm font-bold text-coral-gold">
                {featuredPrice.calculated_price}
              </p>
            )}
          </LocalizedClientLink>
        )}
      </div>
    </section>
  )
}
