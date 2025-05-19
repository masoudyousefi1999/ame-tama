import type { Product, BreadcrumbList, WebSite, Organization, WithContext } from "schema-dts"
import Script from "next/script"

interface SchemaOrgProps {
  type: "product" | "website" | "organization" | "breadcrumb"
  data: any
}

export default function SchemaOrg({ type, data }: SchemaOrgProps) {
  // const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ame-tama.com";
  const baseUrl = "https://ame-tama.com"

  let schema: WithContext<any> = {
    "@context": "https://schema.org",
  }

  switch (type) {
    case "product":
      schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: data.name,
        description: data.description,
        image: data.images?.map((img: any) => `${baseUrl}${img.url}`) || [`${baseUrl}/placeholder.svg`],
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
          price: data.price * 10000, // تبدیل به ریال
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
              reviewRating: {
                "@type": "Rating",
                ratingValue: review.rating,
              },
              datePublished: review.date,
              reviewBody: review.comment,
            })),
          }),
      } as WithContext<Product>
      break

    case "website":
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "AME-TAMA",
        url: baseUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      } as WithContext<WebSite>
      break

    case "organization":
      schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "AME-TAMA",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        sameAs: ["https://www.instagram.com/ametama", "https://twitter.com/ametama"],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+98-21-12345678",
          contactType: "customer service",
          availableLanguage: ["Persian", "English"],
        },
      } as WithContext<Organization>
      break

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
      } as WithContext<BreadcrumbList>
      break
  }

  return (
    <Script
      id={`schema-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
