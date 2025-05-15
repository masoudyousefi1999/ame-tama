import { getSiteUrl } from "@/lib/site-url"

interface ProductSchemaProps {
  product: {
    id: number
    name: string
    price: number
    description?: string
    images: { id: number; url: string; alt: string }[]
    availability: "in-stock" | "low-stock" | "out-of-stock"
    category: string
    manufacturer: string
    releaseDate: string
  }
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  // تبدیل وضعیت موجودی به فرمت استاندارد Schema.org
  const availabilityMap = {
    "in-stock": "https://schema.org/InStock",
    "low-stock": "https://schema.org/LimitedAvailability",
    "out-of-stock": "https://schema.org/OutOfStock",
  }

  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => (img.url.startsWith("http") ? img.url : getSiteUrl(img.url))),
    description: product.description || `مجسمه ${product.name} از سری محصولات ${product.category}`,
    sku: `AME-${product.id}`,
    mpn: `AME-${product.id}`,
    brand: {
      "@type": "Brand",
      name: product.manufacturer,
    },
    offers: {
      "@type": "Offer",
      url: getSiteUrl(`product/${product.id}`),
      priceCurrency: "IRR",
      price: product.price * 10, // تبدیل تومان به ریال برای استاندارد بین‌المللی
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
      availability: availabilityMap[product.availability],
      seller: {
        "@type": "Organization",
        name: "AME-TAMA",
      },
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
}
