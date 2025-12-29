import type {
  Product,
  BreadcrumbList,
  WebSite,
  Organization,
  WithContext,
} from "schema-dts";
import Script from "next/script";

interface SchemaOrgProps {
  type: "product" | "website" | "organization" | "breadcrumb";
  data: any;
}

export default function SchemaOrg({ type, data }: SchemaOrgProps) {
  // const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ame-tama.com";
  const baseUrl = "https://ame-tama.com";

  let schema: WithContext<any> = {
    "@context": "https://schema.org",
  };

  switch (type) {
    case "product":
      schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: data.name,
        description: data.description,
        image: data.images?.map((img: any) => `${baseUrl}${img.url}`) || [
          `${baseUrl}/placeholder.svg`,
        ],
        sku: `AME-${data.id}`,
        mpn: `AME-${data.id}`,
        brand: {
          "@type": "Brand",
          name: "AME-TAMA",
        },
        offers: {
          "@type": "Offer",
          url: `${baseUrl}/product/${data.id}`,
          priceCurrency: "IRR",
          price: data.price, // قیمت ریال از بک‌اند (بدون تبدیل)
          availability:
            data.availability === "in-stock"
              ? "https://schema.org/InStock"
              : data.availability === "low-stock"
              ? "https://schema.org/LimitedAvailability"
              : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "AME-TAMA",
          },
        },
        ...(data.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: data.rating,
            reviewCount: data.reviewCount || 0,
          },
        }),
        ...(data.reviews &&
          data.reviews.length > 0 && {
            review: data.reviews.map((review: any) => ({
              "@type": "Review",
              author: {
                "@type": "Person",
                name: review.user,
              },
              itemReviewed: {
                "@type": "Product",
                name: data.name,
              },
              reviewRating: {
                "@type": "Rating",
                ratingValue: review.rating,
              },
              datePublished: review.date,
              reviewBody: review.comment,
            })),
          }),
      } as WithContext<Product>;
      break;

    case "website":
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "AME-TAMA",
        url: baseUrl,
        description: "فروشگاه اکشن فیگور های انیمه ای",
        inLanguage: "fa-IR",
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      } as WithContext<WebSite>;
      break;

    case "organization":
      schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "AME-TAMA",
        alternateName: "آمه تاما",
        url: baseUrl,
        logo: `${baseUrl}/favicon.jpg`,
        image: `${baseUrl}/favicon.jpg`,
        description: "فروشگاه اکشن فیگور های انیمه ای",
        sameAs: [
          "https://www.instagram.com/_ame_tama",
          "https://twitter.com/masoudyousefi99",
          "https://t.me/masoudyousefi1999",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+98-937-511-6262",
          contactType: "customer service",
          availableLanguage: ["Persian", "English"],
          areaServed: "IR",
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "IR",
          addressLocality: "شیراز",
          addressRegion: "شیراز",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "فیگور های انیمه ای",
          itemListElement: [],
        },
      } as WithContext<Organization>;
      break;

    case "breadcrumb":
      schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: data.items.map((item: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${baseUrl}${item.path}`,
        })),
      } as WithContext<BreadcrumbList>;
      break;
  }

  return (
    <Script
      id={`schema-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
