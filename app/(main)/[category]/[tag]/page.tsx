import { notFound } from "next/navigation";
import TagPage from "@/components/category/tag-page";
import type { Metadata } from "next";
import { getProductByCategoryAndTagSlug } from "@/lib/products";
import { productLimit } from "@/lib/product-limit";
import CategorySchema from "@/components/seo/category-schema";

// ✅ Use correct server function prop type
type Props = {
  params: {
    category: string;
    tag: string;
  };
};

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000" || "https://ame-tama.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, tag } = await params;

  // دریافت اطلاعات از API محصولات
  const { products } = await getProductByCategoryAndTagSlug(
    category,
    tag,
    1,
    1
  );

  if (!products || products.length === 0) {
    return {
      title: "محصول یافت نشد | AME-TAMA",
    };
  }

  // استخراج اطلاعات دسته‌بندی و تگ از اولین محصول
  const firstProduct = products[0];
  const categoryData = firstProduct.category;
  const tagData = firstProduct.tags[0];

  if (!tagData) {
    return {
      title: "تگ یافت نشد | AME-TAMA",
    };
  }

  // ساخت URL کامل برای تگ
  const tagUrl = `${baseUrl}/${category}/${tag}`;

  return {
    metadataBase: new URL(baseUrl),
    title: `خرید محصولات ${tagData.name} | AME-TAMA`,
    description: `خرید محصولات ${tagData.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA. مجموعه کامل محصولات انیمه ای با تضمین اصالت`,
    keywords: `محصولات انیمه, ${tagData.name}, ${categoryData.name}, AME-TAMA, خرید محصولات انیمه, کلکسیون انیمه`,
    openGraph: {
      title: `خرید محصولات ${tagData.name} | AME-TAMA`,
      description: `خرید محصولات ${tagData.name} با بهترین قیمت و کیفیت در فروشگاه AME-TAMA`,
      type: "website",
      images: [tagData.image?.url || firstProduct.productMedia?.[0]?.url],
      url: tagUrl,
      locale: "fa_IR",
      siteName: "AME-TAMA",
    },
    twitter: {
      card: "summary_large_image",
      title: `خرید محصولات ${tagData.name} | AME-TAMA`,
      description: `خرید محصولات ${tagData.name} با بهترین قیمت و کیفیت`,
      images: [tagData.image?.url || firstProduct.productMedia?.[0]?.url],
    },
    alternates: {
      canonical: tagUrl,
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

export default async function CategoryTagRoute(props: {
  params: { category: string; tag: string };
  searchParams?: { page?: string };
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const categorySlug = params.category;
  const tagSlug = params.tag;
  const page = Number.parseInt(searchParams?.page || "1");
  const limit = productLimit;

  // دریافت اطلاعات از یک API call
  const { products, totalCount } = await getProductByCategoryAndTagSlug(
    categorySlug,
    tagSlug,
    page,
    limit
  );

  if (!products || products.length === 0) {
    notFound();
  }

  // استخراج اطلاعات دسته‌بندی و تگ از اولین محصول
  const firstProduct = products[0];
  const category = firstProduct.category;
  const tagData = firstProduct.tags?.find((t) => t.slug === tagSlug);

  if (!tagData) {
    notFound();
  }

  // ساخت breadcrumb path برای schema
  const breadcrumbPath = [
    {
      name: "خانه",
      path: "/",
    },
    {
      name: category.name,
      path: `/${categorySlug}`,
    },
    {
      name: tagData.name,
      path: `/${categorySlug}/${tagSlug}`,
    },
  ];

  return (
    <>
      <CategorySchema
        category={{
          createdAt: "",
          updatedAt: "",
          uuid: "",
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: "",
          image: "",
          tags: [],
        }}
        products={products}
        breadcrumbPath={breadcrumbPath}
      />
      <TagPage
        category={category}
        tag={tagData}
        page={page}
        products={products}
        totalCount={totalCount}
        limit={limit}
      />
    </>
  );
}
