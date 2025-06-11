import { searchProducts } from "@/lib/search";
import SearchPageClient from "@/components/search/search-page-client";
import { getAllProducts } from "@/lib/products";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  let results = [];
  let totalPages = 1;
  const query = searchParams.q || "";
  const page = Number.parseInt(searchParams.page || "1");

  if (query) {
    try {
      const searchResults = await getAllProducts();
      results = (searchResults as any)?.products || [];
      totalPages = (searchResults as any)?.totalPages || 1;
    } catch (error) {
      console.error("Error searching products:", error);
      results = [];
      totalPages = 1;
    }
  }

  return (
    <SearchPageClient
      initialResults={results}
      query={query}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}
