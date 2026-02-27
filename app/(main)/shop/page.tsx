import { getAllProducts, IProductType } from "@/lib/products";
import ShopPageClient from "@/components/shop/shop-page-client";
import { productLimit } from "@/lib/product-limit";
import { Metadata } from "next";


const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";

export const generateMetadata = (): Metadata => {
  const title =
    "فروشگاه آمه‌تاما (AME-TAMA) | خرید فیگور و اکشن فیگور انیمه‌ای + لباس و اکسسوری";
  const description =
    "خرید فیگور انیمه‌ای و اکشن فیگور از فروشگاه آمه‌تاما (AME-TAMA) با تنوع بالا و قیمت مناسب. همچنین خرید لباس انیمه‌ای و اکسسوری انیمه‌ای با ارسال سریع.";

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: [
      // برند (فارسی و انگلیسی)
      "آمه تاما",
      "آمه‌تاما",
      "AME-TAMA",
      "AMETAMA",

      // سرچ‌های رایج کاربرها
      "خرید فیگور انیمه ای",
      "خرید اکشن فیگور انیمه ای",
      "فروشگاه فیگور انیمه",
      "اکشن فیگور انیمه",
      "فیگور انیمه",

      // لباس و اکسسوری
      "خرید لباس انیمه ای",
      "لباس انیمه ای",
      "خرید اکسسوری انیمه ای",
      "اکسسوری انیمه ای",

      // ترکیبی با برند
      "خرید فیگور از آمه تاما",
      "خرید اکشن فیگور از آمه تاما",
      "خرید لباس انیمه ای از آمه تاما",
      "خرید اکسسوری انیمه ای از آمه تاما",
    ],
    alternates: {
      canonical: `${baseUrl}/shop`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/shop`,
      siteName: "آمه‌ تاما | AME-TAMA",
      locale: "fa_IR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};


export default async function ShopPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const { page: currentPage, search } = await searchParams;

  let products: IProductType[] = [];
  let totalCount = 0;
  const limit = productLimit;
  const page = Number.parseInt(currentPage || "1");

  try {
    const fetchedProducts = await getAllProducts(page, limit, {
      next: { tags: ["products", "shop"] },
    });
    products = fetchedProducts.products || [];
    totalCount = fetchedProducts.totalCount || 0;
  } catch (error) {
    console.error("Error fetching shop data:", error);
    products = [];
    totalCount = 0;
  }

  // Products will load with proper priority in ProductCard components

  return (
    <>
      {/* Add timeout and retry configuration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Add image retry logic
            window.addEventListener('load', function() {
              const images = document.querySelectorAll('img[src*="ame-tama.storage.c2.liara.space"]');
              images.forEach(img => {
                let retryCount = 0;
                const maxRetries = 2;
                
                img.addEventListener('error', function() {
                  if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(() => {
                      img.src = img.src + '?retry=' + retryCount;
                    }, 1000 * retryCount);
                  }
                });
              });
              
              // Clean up any unused preloads
              setTimeout(() => {
                const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
                preloadLinks.forEach((link) => {
                  const href = link.getAttribute('href');
                  if (href) {
                    const imgElements = document.querySelectorAll(\`img[src="\${href}"]\`);
                    if (imgElements.length === 0) {
                      link.remove();
                    }
                  }
                });
              }, 1000);
            });
          `,
        }}
      />

      <ShopPageClient
        initialProducts={products}
        totalCount={totalCount}
        currentPage={page}
        limit={limit}
      />
    </>
  );
}
