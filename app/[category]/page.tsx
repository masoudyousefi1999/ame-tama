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
    category: string;
  };
};

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await getCategoryBySlug(category);

  if (!categoryData) {
    return {
      title: "دسته‌بندی یافت نشد | AME-TAMA",
    };
  }

  // ساخت URL کامل برای دسته‌بندی
  const categoryUrl = `${baseUrl}/${category}`;

  return {
    metadataBase: new URL(baseUrl),
    title: `خرید فیگورهای انیمه ${categoryData.name} | AME-TAMA`,
    description: `خرید فیگور های انیمه ${categoryData.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA. مجموعه کامل اکشن فیگورهای انیمه ای با تضمین اصالت`,
    keywords: `فیگور انیمه, اکشن فیگور, ${categoryData.name}, AME-TAMA, خرید فیگور, فیگور انیمه ای, مجسمه انیمه, کلکسیون انیمه`,
    openGraph: {
      title: `خرید فیگورهای انیمه ${categoryData.name} | AME-TAMA`,
      description: `خرید فیگور های انیمه ${categoryData.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA`,
      type: "website",
      images: [categoryData.image],
      url: categoryUrl,
      locale: "fa_IR",
      siteName: "AME-TAMA",
    },
    twitter: {
      card: "summary_large_image",
      title: `خرید فیگورهای انیمه ${categoryData.name} | AME-TAMA`,
      description: `خرید فیگور های انیمه ${categoryData.name} با بهترین قیمت و کیفیت`,
      images: [categoryData.image],
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
  params: { category: string };
  searchParams?: { page?: string };
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const categorySlug = params.category;
  const page = Number.parseInt(searchParams?.page || "1");
  const limit = productLimit;

  // Parallel data fetching for better performance
  const [category, { products, totalCount }] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getProductByCategorySlug(categorySlug, page, limit),
  ]);

  if (!category) notFound();
  if (!Array.isArray(products)) notFound();

  // ساخت breadcrumb path برای schema
  const breadcrumbPath = [
    {
      name: "خانه",
      path: "/",
    },
    {
      name: category.name,
      path: `/${category.slug}`,
    },
  ];

  return (
    <>
      <CategorySchema
        category={category}
        products={products}
        breadcrumbPath={breadcrumbPath}
      />
      <CategoryPage
        category={category}
        page={page}
        products={products}
        totalCount={totalCount}
        limit={limit}
      />
    </>
  );
}
