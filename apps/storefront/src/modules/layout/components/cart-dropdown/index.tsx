"use client"

import { Dialog, Transition } from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [cartOpen, setCartOpen] = useState(false)

  const open = () => setCartOpen(true)
  const close = () => setCartOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      open()
    }
    itemRef.current = totalItems
  }, [totalItems, pathname])

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="hover:text-ui-fg-base h-full"
        data-testid="nav-cart-link"
        aria-label={`Open cart, ${totalItems} items`}
      >
        {`Cart (${totalItems})`}
      </button>

      <Transition show={cartOpen} as={Fragment}>
        <Dialog onClose={close} className="relative z-[70]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in duration-200"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel
                    className="pointer-events-auto flex h-full w-screen max-w-md flex-col bg-uiBg shadow-xl"
                    data-testid="nav-cart-dropdown"
                  >
                    <div className="flex items-center justify-between border-b border-ui-border-base px-6 py-4">
                      <h3 className="text-large-semi text-ui-fg-base">Cart</h3>
                      <button
                        type="button"
                        onClick={close}
                        className="text-sm text-ui-fg-muted transition-colors hover:text-ui-fg-base"
                        data-testid="close-cart-drawer"
                      >
                        Close
                      </button>
                    </div>

                    {cartState && cartState.items?.length ? (
                      <>
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                          <ul className="grid grid-cols-1 gap-y-8">
                            {cartState.items
                              .sort((a, b) => {
                                return (a.created_at ?? "") > (b.created_at ?? "")
                                  ? -1
                                  : 1
                              })
                              .map((item) => (
                                <li
                                  className="grid grid-cols-[122px_1fr] gap-x-4"
                                  key={item.id}
                                  data-testid="cart-item"
                                >
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    className="w-24"
                                    onClick={close}
                                  >
                                    <Thumbnail
                                      thumbnail={item.thumbnail}
                                      images={item.variant?.product?.images}
                                      size="square"
                                    />
                                  </LocalizedClientLink>
                                  <div className="flex flex-col justify-between flex-1">
                                    <div className="flex flex-col flex-1">
                                      <div className="flex items-start justify-between">
                                        <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                          <h4 className="text-base-regular overflow-hidden text-ellipsis">
                                            <LocalizedClientLink
                                              href={`/products/${item.product_handle}`}
                                              data-testid="product-link"
                                              onClick={close}
                                            >
                                              {item.title}
                                            </LocalizedClientLink>
                                          </h4>
                                          <LineItemOptions
                                            variant={item.variant}
                                            data-testid="cart-item-variant"
                                            data-value={item.variant}
                                          />
                                          <span
                                            data-testid="cart-item-quantity"
                                            data-value={item.quantity}
                                          >
                                            Quantity: {item.quantity}
                                          </span>
                                        </div>
                                        <div className="flex justify-end">
                                          <LineItemPrice
                                            item={item}
                                            style="tight"
                                            currencyCode={cartState.currency_code}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <DeleteButton
                                      id={item.id}
                                      className="mt-1"
                                      data-testid="cart-item-remove-button"
                                    >
                                      Remove
                                    </DeleteButton>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>
                        <div className="border-t border-ui-border-base p-6 flex flex-col gap-y-4 text-small-regular">
                          <div className="flex items-center justify-between">
                            <span className="text-ui-fg-base font-semibold">
                              Subtotal{" "}
                              <span className="font-normal">(excl. taxes)</span>
                            </span>
                            <span
                              className="text-large-semi"
                              data-testid="cart-subtotal"
                              data-value={subtotal}
                            >
                              {convertToLocale({
                                amount: subtotal,
                                currency_code: cartState.currency_code,
                              })}
                            </span>
                          </div>
                          <LocalizedClientLink href="/cart" passHref>
                            <Button
                              className="w-full"
                              size="large"
                              data-testid="go-to-cart-button"
                              onClick={close}
                            >
                              Go to cart
                            </Button>
                          </LocalizedClientLink>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 px-6 py-16">
                        <div className="bg-primary text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-uiBg">
                          <span>0</span>
                        </div>
                        <span className="text-ui-fg-muted">
                          Your shopping bag is empty.
                        </span>
                        <LocalizedClientLink href="/store">
                          <Button onClick={close}>Explore products</Button>
                        </LocalizedClientLink>
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default CartDropdown
