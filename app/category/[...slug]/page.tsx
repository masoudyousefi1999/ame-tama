import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/categories";
import CategoryPage from "@/components/category/category-page";
import type { Metadata } from "next";
import { getProductByCategorySlug } from "@/lib/products";
import { productLimit } from "@/lib/product-limit";

// ✅ Use correct server function prop type
type Props = {
  params: {
    slug: string[];
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug[slug.length - 1]);

  if (!category) {
    return {
      title: "دسته‌بندی یافت نشد | AME-TAMA",
    };
  }

  return {
    title: `${category.name} | AME-TAMA`,
    description: category.description,
    openGraph: {
      images: [category.image],
    },
  };
}

export default async function CategoryRoute(props: {
  params: { slug: string[] };
  searchParams?: { page?: string };
}) {
  const { params, searchParams } = props;
  const lastSlug = params.slug[params.slug.length - 1];
  const page = Number.parseInt(searchParams?.page || "1");
  const limit = productLimit;
  const category = await getCategoryBySlug(lastSlug);
  if (!category) notFound();
  const { products, totalCount } = await getProductByCategorySlug(
    lastSlug,
    page,
    limit
  );
  if (!Array.isArray(products)) notFound();

  return (
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
  );
}
