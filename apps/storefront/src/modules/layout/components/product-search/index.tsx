"use client"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { MagnifyingGlassMini } from "@medusajs/icons"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

type SearchResult = HttpTypes.StoreProduct

const ProductSearch = () => {
  const { countryCode } = useParams<{ countryCode: string }>()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const runSearch = useCallback(
    async (value: string) => {
      const trimmed = value.trim()

      if (!trimmed || !countryCode) {
        setResults([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const params = new URLSearchParams({
          q: trimmed,
          countryCode,
        })

        const response = await fetch(`/api/products/search?${params.toString()}`)
        const data = (await response.json()) as { products: SearchResult[] }

        setResults(data.products ?? [])
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    },
    [countryCode]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      void runSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, runSearch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const showDropdown = isOpen && query.trim().length > 0

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl">
      <label htmlFor="nav-product-search" className="sr-only">
        Search products
      </label>
      <div className="flex w-full bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden focus-within:border-island-turquoise transition-colors shadow-sm h-11 md:h-12">
        <input
          id="nav-product-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for island essentials..."
          autoComplete="off"
          data-testid="nav-search-input"
          className="flex-1 border-none bg-transparent px-4 py-2 outline-none text-on-surface placeholder:text-outline text-sm md:text-base"
        />
        <button
          type="button"
          className="bg-primary-container hover:bg-primary text-white px-4 md:px-6 flex items-center justify-center transition-colors"
          aria-label="Search"
          onClick={() => void runSearch(query)}
        >
          <MagnifyingGlassMini className="h-4 w-4" />
        </button>
      </div>

      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-[60] max-h-80 overflow-y-auto rounded-lg border border-outline-variant bg-surface-container-lowest shadow-ambient"
          data-testid="nav-search-results"
        >
          {isLoading ? (
            <p className="px-4 py-3 text-sm text-on-surface-variant">
              Searching...
            </p>
          ) : results.length ? (
            <ul>
              {results.map((product) => {
                const { cheapestPrice } = getProductPrice({ product })

                return (
                  <li key={product.id}>
                    <LocalizedClientLink
                      href={`/products/${product.handle}`}
                      onClick={() => {
                        setIsOpen(false)
                        setQuery("")
                      }}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[rgba(2,128,144,0.05)]"
                    >
                      {product.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.thumbnail}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 shrink-0 rounded object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[rgba(2,128,144,0.1)] text-xs font-semibold text-primary">
                          {product.title?.charAt(0)}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-on-surface">
                          {product.title}
                        </span>
                        {cheapestPrice && (
                          <span className="block text-xs text-on-surface-variant">
                            {cheapestPrice.calculated_price}
                          </span>
                        )}
                      </span>
                    </LocalizedClientLink>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-on-surface-variant">
              No products found for &ldquo;{query.trim()}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductSearch
