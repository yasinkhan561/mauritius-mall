import { Suspense } from "react"

import { listCollections } from "@lib/data/collections"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import ProductSearch from "@modules/layout/components/product-search"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale, { collections }] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    listCollections({ fields: "id, handle, title" }),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center gap-x-4 w-full min-h-16 py-2 text-small-regular small:py-0 small:h-16">
          <div className="flex shrink-0 items-center">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
              collections={collections ?? []}
            />
          </div>

          <div className="flex shrink-0 items-center small:absolute small:left-1/2 small:-translate-x-1/2">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase whitespace-nowrap"
              data-testid="nav-store-link"
            >
              Mauritius Mall
            </LocalizedClientLink>
          </div>

          <div className="hidden min-w-0 flex-1 xsmall:block">
            <ProductSearch />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-x-4 small:gap-x-6">
            <div className="hidden small:flex items-center">
              <LocalizedClientLink
                className="hover:text-ui-fg-base whitespace-nowrap"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2 whitespace-nowrap"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>

        <div className="content-container xsmall:hidden pb-3">
          <ProductSearch />
        </div>
      </header>
    </div>
  )
}
