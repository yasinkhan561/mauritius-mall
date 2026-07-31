import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCategories } from "@lib/data/categories"

export default async function Footer() {
  const productCategories = await listCategories()
  const topCategories =
    productCategories
      ?.filter((c) => !c.parent_category)
      .slice(0, 4) ?? []

  return (
    <footer className="bg-surface-container-low w-full mt-stack-xl border-t border-surface-container-high">
      <div className="content-container grid grid-cols-1 md:grid-cols-4 gap-gutter py-stack-xl text-label-md">
        <div className="flex flex-col gap-4">
          <LocalizedClientLink
            href="/"
            className="text-primary font-bold text-xl flex items-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 3c-1.5 2.5-4 4-4 7a4 4 0 008 0c0-3-2.5-4.5-4-7zm-6 11c0 3.314 2.686 6 6 6s6-2.686 6-6c0-1.5-.5-2.5-1.5-3.5.5 1.5.5 2.5-.5 3.5-1 1-2 1.5-4 1.5s-3-.5-4-1.5c-1-1-1-2-.5-3.5C6.5 11.5 6 12.5 6 14z" />
            </svg>
            Mauritius Mall
          </LocalizedClientLink>
          <p className="text-on-surface-variant text-sm font-normal leading-6">
            Bringing the vibrant spirit of Mauritius to your doorstep. Quality
            products, local support, effortless luxury.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-on-surface font-bold mb-1 uppercase tracking-wider text-xs">
            Customer Care
          </h4>
          <LocalizedClientLink
            href="/account"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            Contact Support
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/store"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            FAQs
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/cart"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            Returns & Exchanges
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/account/orders"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            Track Order
          </LocalizedClientLink>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-on-surface font-bold mb-1 uppercase tracking-wider text-xs">
            Shop
          </h4>
          <LocalizedClientLink
            href="/store"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            All Products
          </LocalizedClientLink>
          {topCategories.map((c) => (
            <LocalizedClientLink
              key={c.id}
              href={`/categories/${c.handle}`}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              {c.name}
            </LocalizedClientLink>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-on-surface font-bold mb-1 uppercase tracking-wider text-xs">
            Secure Payments
          </h4>
          <p className="text-on-surface-variant text-sm font-normal mb-1">
            We accept local and international payment methods.
          </p>
          <div className="flex flex-wrap gap-2">
            {["MCB Juice", "Blink", "VISA / MC", "COD"].map((method) => (
              <div
                key={method}
                className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded shadow-sm text-xs font-bold text-primary"
              >
                {method}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-surface-container-high py-6 text-center text-sm text-on-surface-variant">
        <p>
          © {new Date().getFullYear()} Mauritius Mall. Crafted with Island
          Spirit.
        </p>
      </div>
    </footer>
  )
}
