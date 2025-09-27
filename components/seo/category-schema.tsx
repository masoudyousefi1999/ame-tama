import { getSiteUrl } from "@/lib/site-url";
import { ICategoryType } from "@/lib/categories";

interface CategorySchemaProps {
  category: ICategoryType;
  products: any[];
  breadcrumbPath: { name: string; path: string }[];
}

export default function CategorySchema({
  category,
  products,
  breadcrumbPath,
}: CategorySchemaProps) {
  const baseUrl = getSiteUrl();

  // ساخت schema برای دسته‌بندی
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `خرید فیگورهای انیمه ${category.name}`,
    description: `خرید فیگور های انیمه ${category.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA`,
    url: `${baseUrl}/category/${category.slug}`,
    mainEntity: {
      "@type": "ItemList",
      name: `فیگورهای انیمه ${category.name}`,
      description: `مجموعه کامل فیگورهای انیمه ${category.name}`,
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          url: `${baseUrl}/product/${product.slug}`,
          image: product.productMedia?.[0]?.url || "/placeholder.svg",
          description: product.detail?.description || `فیگور ${product.name}`,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "IRR",
            availability:
              product.quantity > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            seller: {
              "@type": "Organization",
              name: "AME-TAMA",
              url: baseUrl,
            },
          },
          brand: {
            "@type": "Brand",
            name: category.name,
          },
        },
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "خانه",
          item: baseUrl,
        },
        ...breadcrumbPath.map((item, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: item.name,
          item: `${baseUrl}${item.path}`,
        })),
      ],
    },
    // اطلاعات اضافی برای SEO
    isPartOf: {
      "@type": "WebSite",
      name: "AME-TAMA",
      url: baseUrl,
    },
    about: {
      "@type": "Thing",
      name: `فیگورهای انیمه ${category.name}`,
      description: `مجموعه کامل فیگورهای انیمه ${category.name} با کیفیت بالا`,
    },
    // اطلاعات برای Google Shopping
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
    />
  );
}
