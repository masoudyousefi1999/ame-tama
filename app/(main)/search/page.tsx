import SearchPageClient from "@/components/search/search-page-client";
import { productLimit } from "@/lib/product-limit";
import { customFetch } from "@/lib/utils";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const { q: QParam, page: pageParam } = await searchParams;

  const query = QParam || "";
  const page = Number.parseInt(pageParam || "1");
  const limit = productLimit;
  let results = [];
  let totalCount = 0;
  let totalPages = 1;

  if (query) {
    try {
      const params = new URLSearchParams();
      params.set("search", query);
      params.set("page", String(page));
      params.set("limit", String(limit));
      const res = await customFetch(`/product/search?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        results = data;
        totalCount = data.length;
      } else {
        results = data.products || [];
        totalCount = data.totalCount || 0;
      }
      totalPages = Math.max(1, Math.ceil(totalCount / limit));
    } catch (error) {
      console.error("Error searching products:", error);
      results = [];
      totalCount = 0;
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
