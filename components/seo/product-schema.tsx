import { getSiteUrl } from "@/lib/site-url";
import { IProductType } from "@/lib/products";

interface ProductSchemaProps {
  product: IProductType;
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const availabilityMap = {
    inStock: "https://schema.org/InStock",
    limitedAvailability: "https://schema.org/LimitedAvailability",
    outOfStock: "https://schema.org/OutOfStock",
  };

  // حدس وضعیت موجودی بر اساس quantity
  let availability: "inStock" | "outOfStock" | "limitedAvailability" =
    "inStock";
  if (product.quantity === 0) availability = "outOfStock";
  else if (product.quantity > 0 && product.quantity < 3)
    availability = "limitedAvailability";

  // داده‌های aggregateRating
  const aggregateRating =
    product.rating && product.reviews && product.reviews.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating.toFixed(1),
          reviewCount: product.reviews.length,
        }
      : undefined;

  const schemaData: any = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.productMedia.map((img) =>
      img.url.startsWith("http") ? img.url : getSiteUrl(img.url)
    ),
    description:
      product.detail?.description ||
      `فیگور ${product.name} از انیمه ی  ${product.category.name}`,
    sku: `AME-${product.uuid}`,
    mpn: `AME-${product.uuid}`,
    brand: {
      "@type": "Brand",
      name: product.category.name, // چون manufacturer نیست، از category اسم برند رو گرفتیم
    },
    offers: {
      "@type": "Offer",
      url: getSiteUrl(`product/${product.slug}`),
      priceCurrency: "IRR",
      price: product.price * 10, // تومان به ریال
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
      availability: availabilityMap[availability],
      seller: {
        "@type": "Organization",
        name: "AME-TAMA",
      },
    },
  };

  if (aggregateRating) schemaData.aggregateRating = aggregateRating;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
