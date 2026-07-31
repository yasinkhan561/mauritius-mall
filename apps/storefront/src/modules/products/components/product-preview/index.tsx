import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function ProductPreview({
  product,
  isFeatured: _isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })
  const imageUrl = product.thumbnail || product.images?.[0]?.url
  const isSale = cheapestPrice?.price_type === "sale"
  const isNew =
    product.created_at &&
    Date.now() - new Date(product.created_at).getTime() <
      1000 * 60 * 60 * 24 * 30

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full"
    >
      <article
        data-testid="product-wrapper"
        className="bg-surface-container-lowest rounded-card shadow-ambient overflow-hidden flex flex-col h-full transition-ambient shadow-ambient-hover relative p-4 pb-6"
      >
        {isSale && cheapestPrice?.percentage_diff && (
          <div className="absolute top-6 left-6 z-10 bg-error text-white text-xs font-bold px-2 py-1 rounded">
            -{Math.round(Number(cheapestPrice.percentage_diff))}%
          </div>
        )}
        {!isSale && isNew && (
          <div className="absolute top-6 left-6 z-10 bg-primary-container text-white text-xs font-bold px-2 py-1 rounded">
            New
          </div>
        )}

        <div className="h-48 w-full rounded bg-surface-container-low mb-4 overflow-hidden border border-outline-variant relative">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.title || "Product"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-outline text-sm">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1">
          <h3
            className="text-label-md text-on-surface mb-2 line-clamp-2"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              {isSale && cheapestPrice?.original_price && (
                <span
                  className="text-xs text-outline line-through block"
                  data-testid="original-price"
                >
                  {cheapestPrice.original_price}
                </span>
              )}
              {cheapestPrice && (
                <span
                  className="text-headline-md text-primary font-bold block leading-none"
                  data-testid="price"
                >
                  {cheapestPrice.calculated_price}
                </span>
              )}
            </div>
            <span
              className="bg-coral-gold group-hover:bg-[#E08D4A] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm"
              aria-hidden="true"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </LocalizedClientLink>
  )
}
