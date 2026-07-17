"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Fragment } from "react"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  Account: "/account",
  Cart: "/cart",
} as const

type SideMenuCollection = Pick<
  HttpTypes.StoreCollection,
  "id" | "title" | "handle"
>

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  collections: SideMenuCollection[]
}

const SideMenu = ({
  regions,
  locales,
  currentLocale,
  collections,
}: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex h-full items-center">
        <Popover className="relative flex h-full">
          {({ open, close }) => (
            <>
              <Popover.Button
                data-testid="nav-menu-button"
                className="relative flex h-full items-center transition-colors duration-200 ease-out hover:text-ui-fg-base focus:outline-none"
              >
                Menu
              </Popover.Button>

              <Transition show={open} as={Fragment}>
                <div
                  className="fixed inset-0 z-[50] bg-slate-900/25 backdrop-blur-sm"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                  aria-hidden="true"
                />
              </Transition>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <PopoverPanel
                  static
                  className="fixed inset-y-0 left-0 z-[51] flex w-full max-w-[min(100vw,20rem)] sm:max-w-xs"
                >
                  <div
                    data-testid="nav-menu-popup"
                    className="flex h-full w-full flex-col bg-white/80 shadow-2xl backdrop-blur-md dark:bg-slate-900/80 border-r border-white/40 dark:border-slate-700/50"
                  >
                    <div className="flex items-center justify-between px-6 pt-6 pb-2">
                      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Menu
                      </span>
                      <button
                        type="button"
                        data-testid="close-menu-button"
                        onClick={close}
                        aria-label="Close menu"
                        className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100/80 hover:text-slate-800 dark:hover:bg-slate-800/80 dark:hover:text-slate-100"
                      >
                        <XMark />
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-4">
                      <nav aria-label="Main navigation">
                        <ul className="flex flex-col gap-1">
                          {Object.entries(SideMenuItems).map(([name, href]) => (
                            <li key={name}>
                              <LocalizedClientLink
                                href={href}
                                className="block py-2 text-2xl font-medium leading-snug tracking-tight text-slate-800 transition-colors duration-200 hover:text-rose-500 dark:text-slate-100"
                                onClick={close}
                                data-testid={`${name.toLowerCase()}-link`}
                              >
                                {name}
                              </LocalizedClientLink>
                            </li>
                          ))}
                        </ul>
                      </nav>

                      {collections.length > 0 && (
                        <nav
                          aria-label="Collections"
                          className="mt-10 border-t border-slate-200/70 pt-8 dark:border-slate-700/70"
                        >
                          <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                            COLLECTIONS
                          </span>
                          <ul className="flex flex-col gap-2.5">
                            {collections.map((collection) => (
                              <li key={collection.id}>
                                <LocalizedClientLink
                                  href={`/collections/${collection.handle}`}
                                  className="inline-block text-sm font-medium text-slate-600 transition-all duration-200 hover:translate-x-1 hover:text-rose-500 dark:text-slate-300"
                                  onClick={close}
                                  data-testid={`collection-${collection.handle}-link`}
                                >
                                  {collection.title}
                                </LocalizedClientLink>
                              </li>
                            ))}
                          </ul>
                        </nav>
                      )}
                    </div>

                    <div className="mt-auto border-t border-slate-200/80 px-6 py-5 dark:border-slate-700/80">
                      <div className="space-y-4">
                        {!!locales?.length && (
                          <div
                            onMouseEnter={languageToggleState.open}
                            onMouseLeave={languageToggleState.close}
                          >
                            <LanguageSelect
                              toggleState={languageToggleState}
                              locales={locales}
                              currentLocale={currentLocale}
                            />
                          </div>
                        )}
                        <div
                          onMouseEnter={countryToggleState.open}
                          onMouseLeave={countryToggleState.close}
                        >
                          {regions && (
                            <CountrySelect
                              toggleState={countryToggleState}
                              regions={regions}
                            />
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          © {new Date().getFullYear()} Mauritius Mall. All
                          rights reserved.
                        </p>
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
