import { getSiteUrl } from "@/lib/site-url";
import { IProductType } from "@/lib/products";

interface GoogleShoppingSchemaProps {
  product: IProductType;
}

export default function GoogleShoppingSchema({
  product,
}: GoogleShoppingSchemaProps) {
  // تعیین وضعیت موجودی
  let availability: "in stock" | "out of stock" | "limited" = "in stock";
  if (product.quantity === 0) availability = "out of stock";
  else if (product.quantity > 0 && product.quantity < 3)
    availability = "limited";

  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description:
      product.detail?.description ||
      `فیگور ${product.name} از انیمه ${product.category.name}`,
    image:
      product.productMedia.length > 0
        ? {
            "@type": "ImageObject",
            url: product.productMedia[0].url.startsWith("http")
              ? product.productMedia[0].url
              : getSiteUrl(product.productMedia[0].url),
            width: 1200,
            height: 1200,
            alt: `${product.name} - فیگور انیمه`,
            caption: `فیگور ${product.name} از انیمه ${product.category.name}`,
          }
        : {
            "@type": "ImageObject",
            url: getSiteUrl("/placeholder.svg"),
            width: 1200,
            height: 1200,
            alt: `${product.name} - فیگور انیمه`,
          },
    sku: `AME-${product.uuid}`,
    mpn: `AME-${product.uuid}`,
    gtin: `AME-${product.uuid}`,
    brand: {
      "@type": "Brand",
      name: product.category.name,
    },
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: getSiteUrl(`product/${product.slug}`),
      priceCurrency: "IRR",
      price: product.price,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
      availability:
        availability === "in stock"
          ? "https://schema.org/InStock"
          : availability === "limited"
          ? "https://schema.org/LimitedAvailability"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "AME-TAMA",
        url: "https://ame-tama.com",
      },
      condition: "https://schema.org/NewCondition",
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
    // اطلاعات اضافی برای Google Shopping
    productID: product.uuid,
    gtin8: `AME-${product.uuid}`,
    gtin12: `AME-${product.uuid}`,
    gtin13: `AME-${product.uuid}`,
    gtin14: `AME-${product.uuid}`,
    // اطلاعات بیشتر برای تصاویر
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getSiteUrl(`product/${product.slug}`),
    },
    // اطلاعات بیشتر برای موتورهای جستجو
    potentialAction: {
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
    },
    // اطلاعات اضافی برای Google Shopping
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
      {
        "@type": "PropertyValue",
        name: "جنس",
        value: "PVC",
      },
      {
        "@type": "PropertyValue",
        name: "ارتفاع",
        value: product.detail?.specifications?.height || "متغیر",
      },
      {
        "@type": "PropertyValue",
        name: "وزن",
        value: product.detail?.specifications?.weight || "متغیر",
      },
    ],
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
