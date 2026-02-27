import { CommentsPageClient } from "@/components/admin/comments/comments-page-client";
import { customFetch } from "@/lib/utils";
import { productLimit } from "@/lib/product-limit";

/**
 * Fetch comments from the API
 */
async function getComments(
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>
) {
  const params = await searchParams;
  const page = Number.parseInt(params.page || "1", 10);
  const limit = Number.parseInt(params.limit || String(productLimit), 10);

  try {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const response = await customFetch(`/comment?${queryParams.toString()}`, {
      next: { tags: ["comments", "admin"], revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      comments: result.comments || [],
      total: result.totalCount || result.comments?.length || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      comments: [],
      total: 0,
      page,
      limit,
    };
  }
}

export default async function CommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const page = Number.parseInt(params.page || "1", 10);
  const limit = Number.parseInt(params.limit || String(productLimit), 10);

  const data = await getComments(searchParams);

  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-white">نظرات کاربران</h1>
        <p className="text-gray-400 text-sm mt-1">{data.total} نظر</p>
      </div>

      <div className="bg-gray-800/80 rounded-lg border border-gray-700">
        <CommentsPageClient
          initialComments={data.comments}
          initialTotal={data.total}
          initialPage={page}
          initialLimit={limit}
        />
      </div>
    </div>
  );
}
