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
    image:
      product.productMedia.length > 0
        ? product.productMedia.map((m) =>
            m.url
              ? m.url.startsWith("http")
                ? m.url
                : getSiteUrl(m.url)
              : getSiteUrl("/placeholder.svg")
          )
        : [getSiteUrl("/placeholder.svg")],
    description:
      product.detail?.description ||
      `فیگور ${product.name} از انیمه ی  ${product.category.name}`,
    sku: `AME-${product.uuid}`,
    mpn: `AME-${product.uuid}`,
    gtin: `AME-${product.uuid}`,
    brand: {
      "@type": "Brand",
      name: product.category.name, // چون manufacturer نیست، از category اسم برند رو گرفتیم
    },
    category: product.category.name,
    // اضافه کردن اطلاعات بیشتر برای Google Shopping
    productID: product.uuid,
    gtin8: `AME-${product.uuid}`,
    gtin12: `AME-${product.uuid}`,
    gtin13: `AME-${product.uuid}`,
    gtin14: `AME-${product.uuid}`,
    offers: {
      "@type": "Offer",
      url: getSiteUrl(`product/${product.slug}`),
      priceCurrency: "IRR",
      price: product.price, // قیمت ریال از بک‌اند (بدون تبدیل)
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
      availability: availabilityMap[availability],
      seller: {
        "@type": "Organization",
        name: "AME-TAMA",
        url: "https://ame-tama.com",
      },
      condition: "https://schema.org/NewCondition",
      // اضافه کردن اطلاعات بیشتر برای Google Shopping
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "IRR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IR",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    // اطلاعات اضافی برای موتورهای جستجو
    identifier: {
      "@type": "PropertyValue",
      name: "Product ID",
      value: product.uuid,
    },
    // اطلاعات موجودی
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "موجودی",
        value: product.quantity > 0 ? "موجود" : "ناموجود",
      },
      {
        "@type": "PropertyValue",
        name: "دسته‌بندی",
        value: product.category.name,
      },
      {
        "@type": "PropertyValue",
        name: "سری",
        value: product.detail?.series || "نامشخص",
      },
      {
        "@type": "PropertyValue",
        name: "شخصیت",
        value: product.detail?.character || "نامشخص",
      },
    ],
    // Always include review array for Google
    review:
      Array.isArray(product.reviews) && product.reviews.length > 0
        ? product.reviews.map((review: any) => ({
            "@type": "Review",
            author: review.user,
            datePublished: review.date,
            reviewBody: review.text,
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 5,
              worstRating: 1,
            },
          }))
        : [],
  };

  if (aggregateRating) schemaData.aggregateRating = aggregateRating;

  // اضافه کردن اطلاعات بیشتر برای Google Shopping
  schemaData.isRelatedTo = {
    "@type": "Product",
    name: product.category.name,
    description: `دسته‌بندی ${product.category.name}`,
  };

  // اضافه کردن اطلاعات بیشتر برای تصاویر
  schemaData.mainEntityOfPage = {
    "@type": "WebPage",
    "@id": getSiteUrl(`product/${product.slug}`),
  };

  // اضافه کردن اطلاعات بیشتر برای موتورهای جستجو
  schemaData.potentialAction = {
    "@type": "BuyAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: getSiteUrl(`product/${product.slug}`),
    },
    object: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "IRR",
    },
  };

  // اضافه کردن اطلاعات مشخصات فنی اگر موجود باشد
  if (product.detail?.specifications) {
    const specs = product.detail.specifications;
    if (specs.material) {
      schemaData.additionalProperty.push({
        "@type": "PropertyValue",
        name: "جنس",
        value: specs.material,
      });
    }
    if (specs.height) {
      schemaData.additionalProperty.push({
        "@type": "PropertyValue",
        name: "ارتفاع",
        value: specs.height,
      });
    }
    if (specs.weight) {
      schemaData.additionalProperty.push({
        "@type": "PropertyValue",
        name: "وزن",
        value: specs.weight,
      });
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
