import { searchProducts } from "@/lib/search"
import SearchPageClient from "@/components/search/search-page-client"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string }
}) {
  let results = []
  let totalPages = 1
  const query = searchParams.q || ""
  const page = Number.parseInt(searchParams.page || "1")

  if (query) {
    try {
      const searchResults = await searchProducts(query, page)
      results = searchResults?.products || []
      totalPages = searchResults?.totalPages || 1
    } catch (error) {
      console.error("Error searching products:", error)
      results = []
      totalPages = 1
    }
  }

  return <SearchPageClient initialResults={results} query={query} currentPage={page} totalPages={totalPages} />
}
