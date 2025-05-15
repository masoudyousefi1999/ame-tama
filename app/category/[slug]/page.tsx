import { notFound } from "next/navigation"
import { getCategoryBySlug } from "@/lib/categories"
import CategoryPage from "@/components/category/category-page"
import type { Metadata, ResolvingMetadata } from "next"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    sort?: string
    filter?: string
    page?: string
  }
}

// تولید متادیتا برای سئو
export async function generateMetadata({ params }: CategoryPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug)

  if (!category) {
    return {
      title: "دسته‌بندی یافت نشد | AME-TAMA",
    }
  }

  return {
    title: `${category.name} | مجسمه‌های انیمه | AME-TAMA`,
    description: category.description,
    openGraph: {
      images: [category.image],
    },
  }
}

export default function CategoryRoute({ params, searchParams }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug)

  // اگر دسته‌بندی وجود نداشت، صفحه 404 نمایش داده می‌شود
  if (!category) {
    notFound()
  }

  return (
    <CategoryPage
      category={category}
      sort={searchParams.sort || "newest"}
      filter={searchParams.filter}
      page={searchParams.page ? Number.parseInt(searchParams.page) : 1}
    />
  )
}
