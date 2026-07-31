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
    <div className="sticky top-0 inset-x-0 z-50">
      {/* Promo bar */}
      <div className="bg-primary-container text-white w-full py-2 px-4 md:px-10 flex justify-between items-center text-sm font-semibold">
        <div className="flex-1 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
          <svg
            className="w-[18px] h-[18px] shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-1.875a1.125 1.125 0 01-1.125-1.125v-9.25m0 0V6.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v2.25"
            />
          </svg>
          <span>
            Free Island-Wide Delivery across Mauritius | Express Delivery
            Available
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 border-l border-white/20 pl-4">
          <span className="text-white">EN</span>
          <span className="text-white/30">|</span>
          <span className="text-white/70">FR</span>
        </div>
      </div>

      {/* Glass header */}
      <header className="glass-nav shadow-ambient border-b border-surface-container-highest/50">
        <div className="content-container flex items-center justify-between gap-4 py-3 md:py-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="small:hidden">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
                collections={collections ?? []}
              />
            </div>
            <LocalizedClientLink
              href="/"
              className="text-headline-md font-bold text-primary flex items-center gap-2 whitespace-nowrap"
              data-testid="nav-store-link"
            >
              <svg
                className="w-6 h-6 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 3c-1.5 2.5-4 4-4 7a4 4 0 008 0c0-3-2.5-4.5-4-7zm-6 11c0 3.314 2.686 6 6 6s6-2.686 6-6c0-1.5-.5-2.5-1.5-3.5.5 1.5.5 2.5-.5 3.5-1 1-2 1.5-4 1.5s-3-.5-4-1.5c-1-1-1-2-.5-3.5C6.5 11.5 6 12.5 6 14z" />
              </svg>
              Mauritius Mall
            </LocalizedClientLink>
          </div>

          <div className="hidden md:block min-w-0 flex-1 max-w-3xl mx-4 lg:mx-8">
            <ProductSearch />
          </div>

          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <nav className="hidden lg:flex items-center gap-6 text-label-md">
              <LocalizedClientLink
                href="/store"
                className="text-primary font-bold border-b-2 border-primary pb-0.5"
              >
                Shop
              </LocalizedClientLink>
              {(collections ?? []).slice(0, 1).map((c) => (
                <LocalizedClientLink
                  key={c.id}
                  href={`/collections/${c.handle}`}
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  Categories
                </LocalizedClientLink>
              ))}
              <LocalizedClientLink
                href="/store"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                Local Deals
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/account"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                Help
              </LocalizedClientLink>
            </nav>

            <div className="flex items-center gap-3 md:gap-4">
              <LocalizedClientLink
                href="/account"
                className="hidden md:flex text-on-surface-variant hover:text-primary-container transition-colors"
                data-testid="nav-account-link"
                aria-label="Account"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </LocalizedClientLink>
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="relative text-on-surface-variant hover:text-primary-container"
                    href="/cart"
                    data-testid="nav-cart-link"
                    aria-label="Cart"
                  >
                    <CartIcon />
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="content-container md:hidden pb-3">
          <ProductSearch />
        </div>
      </header>

      {/* Trust strip */}
      <div className="bg-surface border-b border-surface-container-high">
        <div className="content-container flex flex-wrap justify-center gap-6 py-2.5 opacity-90">
          <TrustItem label="MCB Juice Accepted" icon="shield" />
          <TrustItem label="Cash on Delivery" icon="payments" />
          <TrustItem label="Local Support" icon="support" />
        </div>
      </div>
    </div>
  )
}

function CartIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  )
}

function TrustItem({
  label,
  icon,
}: {
  label: string
  icon: "shield" | "payments" | "support"
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant">
      <span className="text-lagoon-teal" aria-hidden="true">
        {icon === "shield" && (
          <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l7 3v6c0 5-3.5 9.5-7 11-3.5-1.5-7-6-7-11V5l7-3zm0 2.2L7 6.1v4.9c0 3.7 2.5 7.3 5 8.7 2.5-1.4 5-5 5-8.7V6.1l-5-1.9z" />
          </svg>
        )}
        {icon === "payments" && (
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        )}
        {icon === "support" && (
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </div>
  )
}
