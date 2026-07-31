import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-stack-lg">
      <div className="content-container" data-testid="cart-container">
        <div className="mb-8">
          <h1 className="text-headline-lg text-on-surface">Shopping Cart</h1>
          <p className="text-on-surface-variant mt-1">
            Review your items before checkout.
          </p>
        </div>

        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-8">
            <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-ambient border border-surface-container-high p-6 gap-y-6">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-28">
                {cart && cart.region && (
                  <div className="bg-surface-container-lowest rounded-xl shadow-ambient border border-surface-container-high p-6">
                    <Summary cart={cart} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-ambient border border-surface-container-high p-8">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
