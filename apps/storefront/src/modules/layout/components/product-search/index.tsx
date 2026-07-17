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
    <div ref={containerRef} className="relative w-full max-w-md">
      <label htmlFor="nav-product-search" className="sr-only">
        Search products
      </label>
      <div className="relative">
        <MagnifyingGlassMini
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ui-fg-muted"
        />
        <input
          id="nav-product-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          autoComplete="off"
          data-testid="nav-search-input"
          className="h-9 w-full rounded-base border border-ui-border-base bg-ui-bg-field py-2 pl-9 pr-3 text-sm text-ui-fg-base outline-none transition-colors placeholder:text-ui-fg-muted focus:border-primary"
        />
      </div>

      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-[60] max-h-80 overflow-y-auto rounded-base border border-ui-border-base bg-uiBg shadow-lg"
          data-testid="nav-search-results"
        >
          {isLoading ? (
            <p className="px-4 py-3 text-sm text-ui-fg-muted">Searching...</p>
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
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-primary/5"
                    >
                      {product.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.thumbnail}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 shrink-0 rounded-soft object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-soft bg-primary/10 text-xs font-semibold text-primary">
                          {product.title?.charAt(0)}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ui-fg-base">
                          {product.title}
                        </span>
                        {cheapestPrice && (
                          <span className="block text-xs text-ui-fg-muted">
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
            <p className="px-4 py-3 text-sm text-ui-fg-muted">
              No products found for &ldquo;{query.trim()}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductSearch
