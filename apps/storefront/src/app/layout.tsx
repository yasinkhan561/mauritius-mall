import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "styles/globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Mauritius Mall",
    template: "%s | Mauritius Mall",
  },
  description:
    "Curated quality products for the modern Mauritian home. Fast island-wide delivery.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={plusJakarta.variable}>
      <body className={plusJakarta.className}>
        <main className="relative min-h-screen bg-surface">{props.children}</main>
      </body>
    </html>
  )
}
