import { searchProducts } from "@lib/data/products"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? ""
  const countryCode = request.nextUrl.searchParams.get("countryCode") ?? ""

  if (!countryCode) {
    return NextResponse.json(
      { message: "countryCode is required" },
      { status: 400 }
    )
  }

  const { products, count } = await searchProducts({
    query,
    countryCode,
  })

  return NextResponse.json({ products, count })
}
