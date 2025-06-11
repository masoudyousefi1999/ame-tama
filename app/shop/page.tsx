import { getAllProducts, getProductsByCategory } from "@/lib/products"
import { getAllCategories } from "@/lib/categories"
import ShopPageClient from "@/components/shop/shop-page-client"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; page?: string }
}) {
  let products = []
  let categories = []
  let totalPages = 1

  try {
    // Fetch categories
    const fetchedCategories = await getAllCategories()
    categories = fetchedCategories || []

    // Fetch products based on filters
    const page = Number.parseInt(searchParams.page || "1")
    const category = searchParams.category
    const search = searchParams.search

    let fetchedProducts
    if (category) {
      fetchedProducts = await getProductsByCategory(category, page)
    } else {
      fetchedProducts = await getAllProducts(page, search)
    }

    products = fetchedProducts?.products || []
    totalPages = fetchedProducts?.totalPages || 1
  } catch (error) {
    console.error("Error fetching shop data:", error)
    products = []
    categories = []
    totalPages = 1
  }

  return (
    <ShopPageClient
      initialProducts={products}
      categories={categories}
      totalPages={totalPages}
      currentPage={Number.parseInt(searchParams.page || "1")}
      currentCategory={searchParams.category}
      currentSearch={searchParams.search}
    />
  )
}
