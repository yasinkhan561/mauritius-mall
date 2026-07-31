import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-surface relative small:min-h-screen">
      <div className="h-16 glass-nav border-b border-surface-container-high shadow-ambient">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-sm font-semibold text-on-surface flex items-center gap-x-2 flex-1 basis-0 hover:text-primary"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block">
              Back to shopping cart
            </span>
            <span className="mt-px block small:hidden">Back</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="text-primary font-bold text-lg hover:opacity-90"
            data-testid="store-link"
          >
            Mauritius Mall
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative content-container py-8" data-testid="checkout-container">
        {children}
      </div>
    </div>
  )
}
