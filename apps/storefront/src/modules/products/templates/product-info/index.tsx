import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="flex flex-col gap-y-4">
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="text-label-sm text-lagoon-teal uppercase tracking-wider hover:underline w-fit"
        >
          {product.collection.title}
        </LocalizedClientLink>
      )}
      <Heading
        level="h2"
        className="text-headline-lg text-on-surface"
        data-testid="product-title"
      >
        {product.title}
      </Heading>
      <Text
        className="text-body-md text-on-surface-variant whitespace-pre-line"
        data-testid="product-description"
      >
        {product.description}
      </Text>
    </div>
  )
}

export default ProductInfo
