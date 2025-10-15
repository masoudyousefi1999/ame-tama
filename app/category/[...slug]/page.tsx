import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/categories";
import CategoryPage from "@/components/category/category-page";
import type { Metadata } from "next";
import { getProductByCategorySlug } from "@/lib/products";
import { productLimit } from "@/lib/product-limit";
import CategorySchema from "@/components/seo/category-schema";

// ✅ Use correct server function prop type
type Props = {
  params: {
    slug: string[];
  };
};

const baseUrl = "https://ame-tama.com";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug[slug.length - 1]);

  if (!category) {
    return {
      title: "دسته‌بندی یافت نشد | AME-TAMA",
    };
  }

  // ساخت URL کامل برای دسته‌بندی
  const categoryUrl = `${baseUrl}/category/${slug.join("/")}`;

  // ساخت breadcrumb path
  const breadcrumbPath = slug.map((segment, index) => {
    const path = slug.slice(0, index + 1).join("/");
    return {
      name: segment.replace(/-/g, " "),
      path: `/category/${path}`,
    };
  });

  return {
    metadataBase: new URL(baseUrl),
    title:  `خرید فیگورهای انیمه ${category.name} | AME-TAMA`,
    description: `خرید فیگور های انیمه ${category.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA. مجموعه کامل اکشن فیگورهای انیمه ای با تضمین اصالت`,
    keywords: `فیگور انیمه, اکشن فیگور, ${category.name}, AME-TAMA, خرید فیگور, فیگور انیمه ای, مجسمه انیمه, کلکسیون انیمه`,
    openGraph: {
      title: `خرید فیگورهای انیمه ${category.name} | AME-TAMA`,
      description: `خرید فیگور های انیمه ${category.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA`,
      type: "website",
      images: [category.image],
      url: categoryUrl,
      locale: "fa_IR",
      siteName: "AME-TAMA",
    },
    twitter: {
      card: "summary_large_image",
      title: `خرید فیگورهای انیمه ${category.name} | AME-TAMA`,
      description: `خرید فیگور های انیمه ${category.name} با بهترین قیمت و کیفیت`,
      images: [category.image],
    },
    alternates: {
      canonical: categoryUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function CategoryRoute(props: {
  params: { slug: string[] };
  searchParams?: { page?: string };
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const lastSlug = params.slug[params.slug.length - 1];
  const page = Number.parseInt(searchParams?.page || "1");
  const limit = productLimit;

  // Parallel data fetching for better performance
  const [category, { products, totalCount }] = await Promise.all([
    getCategoryBySlug(lastSlug),
    getProductByCategorySlug(lastSlug, page, limit),
  ]);

  if (!category) notFound();
  if (!Array.isArray(products)) notFound();

  // ساخت breadcrumb path برای schema
  const breadcrumbPath = params.slug.map((segment, index) => {
    const path = params.slug.slice(0, index + 1).join("/");
    return {
      name: segment.replace(/-/g, " "),
      path: `/category/${path}`,
    };
  });

  return (
    <>
      <CategorySchema
        category={category}
        products={products}
        breadcrumbPath={breadcrumbPath}
      />
      <CategoryPage
        category={category}
        subcategories={category.children}
        sort={"newest"}
        filter={undefined}
        page={page}
        products={products}
        totalCount={totalCount}
        limit={limit}
      />
    </>
  );
}
