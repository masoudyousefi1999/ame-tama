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

  // Build breadcrumb items with safe fallbacks and no duplicates (by path)
  const normalizePath = (path?: string) => {
    if (!path) return "/";
    if (path === "/") return "/";
    const trimmed = path.endsWith("/") ? path.slice(0, -1) : path;
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  };

  const rawItems = [{ name: "خانه", path: "/" }, ...breadcrumbPath];
  const seen = new Set<string>();

  const breadcrumbItems = rawItems
    .filter((item) => item && (item.name || item.path))
    .map((item) => {
      const normalized = normalizePath(item.path);
      return {
        name:
          item.name ||
          decodeURIComponent(
            normalized.split("/").filter(Boolean).pop() || "مسیر"
          ),
        path: normalized,
      };
    })
    .filter(({ path }) => {
      if (seen.has(path)) return false;
      seen.add(path);
      return true;
    })
    .map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getSiteUrl(item.path),
    }));

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
      itemListElement: products.map((product, index) => {
        const categorySlug =
          product.category?.slug || category.slug || "product";
        const tagSlug =
          product.tags?.[0]?.slug ||
          breadcrumbPath[breadcrumbPath.length - 1]?.path
            ?.split("/")
            .filter(Boolean)
            .pop() ||
          categorySlug;
        const productPath = [categorySlug, tagSlug, product.slug]
          .filter(Boolean)
          .join("/");
        const productUrl = getSiteUrl(productPath);

        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            name: product.name,
            url: productUrl,
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
        };
      }),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
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
