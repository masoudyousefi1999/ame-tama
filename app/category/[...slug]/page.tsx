import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/categories";
import CategoryPage from "@/components/category/category-page";
import type { Metadata } from "next";
import { getProductByCategorySlug } from "@/lib/products";

// ✅ Use correct server function prop type
type Props = {
  params: {
    slug: string[];
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug[params.slug.length - 1]);

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
}) {
  const { params } = props;

  const lastSlug = params.slug[params.slug.length - 1];

  const category = await getCategoryBySlug(lastSlug);
  if (!category) notFound();

  const products = await getProductByCategorySlug(lastSlug);
  if (!Array.isArray(products)) notFound();
  // // ✅ safely access after async boundary
  // const sort = typeof searchParams?.sort === "string" ? searchParams.sort : "newest";
  // const filter = typeof searchParams?.filter === "string" ? searchParams.filter : undefined;
  // const page = typeof searchParams?.page === "string" ? parseInt(searchParams.page) : 1;

  return (
    <CategoryPage
      category={category}
      subcategories={category.children}
      sort={"newest"}
      filter={undefined}
      page={1}
      products={products}
    />
  );
}
