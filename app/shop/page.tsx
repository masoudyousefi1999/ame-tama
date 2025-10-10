import { getAllProducts, IProductType } from "@/lib/products";
import ShopPageClient from "@/components/shop/shop-page-client";
import { productLimit } from "@/lib/product-limit";
import { Metadata } from "next";


const baseUrl = "https://ame-tama.com";

export const generateMetadata = (): Metadata => {
  return {
    metadataBase: new URL(baseUrl),
    title: "فروشگاه | خرید اکشن فیگور انیمه‌ای | AME-TAMA",
    description:
      "خرید اکشن فیگور انیمه ای با بهترین قیمت و کیفیت از فروشگاه آمه‌تاما. مجموعه کامل فیگورهای انیمه‌ای از برترین برندها",
    keywords:
      "فروشگاه فیگور انیمه, اکشن فیگور, خرید فیگور انیمه, AME-TAMA, مجسمه انیمه",
    openGraph: {
      title: "فروشگاه | خرید اکشن فیگور انیمه‌ای | AME-TAMA",
      description:
        "خرید اکشن فیگور انیمه ای با بهترین قیمت و کیفیت از فروشگاه آمه‌تاما",
      type: "website",
      url: `${baseUrl}/shop`,
      siteName: "AME-TAMA",
    },
    twitter: {
      card: "summary_large_image",
      title: "فروشگاه | خرید اکشن فیگور انیمه‌ای | AME-TAMA",
      description: "خرید اکشن فیگور انیمه ای با بهترین قیمت و کیفیت",
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
                    console.log('Retrying image load:', img.src);
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
                      console.log('Removed unused preload:', href);
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
