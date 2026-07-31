import { Suspense } from "react"

import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="content-container py-stack-lg" data-testid="category-container">
      <div className="mb-8 rounded-xl bg-surface-container-lowest shadow-ambient p-6 md:p-8 border border-surface-container-high">
        <p className="text-label-sm text-lagoon-teal uppercase tracking-wider mb-2">
          Shop
        </p>
        <h1
          className="text-headline-lg text-on-surface"
          data-testid="store-page-title"
        >
          All Products
        </h1>
        <p className="text-on-surface-variant mt-2 max-w-2xl">
          Browse curated island essentials with local delivery across Mauritius.
        </p>
      </div>

      <div className="flex flex-col small:flex-row small:items-start gap-8">
        <aside className="small:w-64 shrink-0 rounded-xl bg-surface-container-lowest shadow-ambient p-5 border border-surface-container-high">
          <RefinementList sortBy={sort} />
        </aside>
        <div className="w-full min-w-0">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
