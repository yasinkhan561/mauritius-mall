import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (cat: HttpTypes.StoreProductCategory) => {
    if (cat.parent_category) {
      parents.push(cat.parent_category)
      getParents(cat.parent_category)
    }
  }

  getParents(category)

  return (
    <div className="content-container py-stack-lg" data-testid="category-container">
      <div className="mb-8 rounded-xl bg-surface-container-lowest shadow-ambient p-6 md:p-8 border border-surface-container-high">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-on-surface-variant mb-3">
          <LocalizedClientLink href="/store" className="hover:text-primary">
            Shop
          </LocalizedClientLink>
          {parents.map((parent) => (
            <span key={parent.id} className="flex items-center gap-2">
              <span>/</span>
              <LocalizedClientLink
                className="hover:text-primary"
                href={`/categories/${parent.handle}`}
              >
                {parent.name}
              </LocalizedClientLink>
            </span>
          ))}
          <span>/</span>
          <span className="text-primary font-semibold">{category.name}</span>
        </nav>
        <h1
          className="text-headline-lg text-on-surface"
          data-testid="category-page-title"
        >
          {category.name}
        </h1>
        {category.description && (
          <p className="text-on-surface-variant mt-2 max-w-2xl">
            {category.description}
          </p>
        )}
        {category.category_children && category.category_children.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-4">
            {category.category_children.map((c) => (
              <li key={c.id}>
                <InteractiveLink href={`/categories/${c.handle}`}>
                  <span className="inline-flex px-3 py-1.5 rounded-lg bg-[rgba(2,128,144,0.1)] text-primary text-sm font-semibold hover:bg-[rgba(2,128,144,0.2)] transition-colors">
                    {c.name}
                  </span>
                </InteractiveLink>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col small:flex-row small:items-start gap-8">
        <aside className="small:w-64 shrink-0 rounded-xl bg-surface-container-lowest shadow-ambient p-5 border border-surface-container-high">
          <RefinementList
            sortBy={sort}
            data-testid="sort-by-container"
            hideOptionsPicker
          />
        </aside>
        <div className="w-full min-w-0">
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={category.products?.length ?? 8}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
