import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="content-container py-stack-lg">
      <div className="mb-8 rounded-xl bg-surface-container-lowest shadow-ambient p-6 md:p-8 border border-surface-container-high">
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-3">
          <LocalizedClientLink href="/store" className="hover:text-primary">
            Shop
          </LocalizedClientLink>
          <span>/</span>
          <span className="text-primary font-semibold">{collection.title}</span>
        </nav>
        <h1 className="text-headline-lg text-on-surface">{collection.title}</h1>
        <p className="text-on-surface-variant mt-2 max-w-2xl">
          Explore this curated selection of Mauritius Mall favourites.
        </p>
      </div>

      <div className="flex flex-col small:flex-row small:items-start gap-8">
        <aside className="small:w-64 shrink-0 rounded-xl bg-surface-container-lowest shadow-ambient p-5 border border-surface-container-high">
          <RefinementList sortBy={sort} hideOptionsPicker />
        </aside>
        <div className="w-full min-w-0">
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={collection.products?.length}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              collectionId={collection.id}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
