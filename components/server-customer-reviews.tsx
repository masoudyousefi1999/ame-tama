import { Metadata } from "next";
import InteractiveCustomerReviews from "./interactive-customer-reviews";

interface ReviewItem {
  id: string | number;
  name: string;
  content: string;
  rating: number;
  createdAt?: string;
}

async function getComments(): Promise<ReviewItem[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/comments?page=1&limit=6`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
      next: {
        tags: ["comments", "testimonials"],
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching comments for SEO:", error);
    return [];
  }
}

export default async function ServerCustomerReviews() {
  const reviews = await getComments();

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">هنوز نظری ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "نظرات مشتریان AME-TAMA",
            description: "نظرات واقعی مشتریان درباره کیفیت و خدمات AME-TAMA",
            itemListElement: reviews.map((review, index) => ({
              "@type": "Review",
              position: index + 1,
              itemReviewed: {
                "@type": "Organization",
                name: "AME-TAMA",
                url: "https://ame-tama.com",
              },
              author: {
                "@type": "Person",
                name: review.name,
              },
              reviewBody: review.content,
              reviewRating: {
                "@type": "Rating",
                ratingValue: review.rating,
                bestRating: 5,
              },
              datePublished: review.createdAt || new Date().toISOString(),
            })),
          }),
        }}
      />

      {/* Interactive Reviews Component */}
      <InteractiveCustomerReviews reviews={reviews} />
    </div>
  );
}
