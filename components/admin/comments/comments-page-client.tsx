"use client";

import { useState, useCallback, useMemo } from "react";
import { CommentsTable } from "./comments-table";
import { customFetch } from "@/lib/utils";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

export interface CommentProduct {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  rating: number;
  productMedia: Array<{
    order: number;
    isDefault: boolean;
    url: string;
  }>;
}

export interface CommentUser {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string | null;
  phone: string;
  addresses: any[];
}

export interface Comment {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  id: number;
  text: string;
  isPublished: boolean;
  product: CommentProduct;
  user: CommentUser;
}

interface CommentsPageClientProps {
  initialComments: Comment[];
  initialTotal: number;
  initialPage: number;
  initialLimit: number;
}

export function CommentsPageClient({
  initialComments,
  initialTotal,
  initialPage,
  initialLimit,
}: CommentsPageClientProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialComments.length < initialTotal);
  const [error, setError] = useState<string | null>(null);

  const fetchMoreComments = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(initialLimit),
      });

      const response = await customFetch(`/comment?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`);
      }

      const result = await response.json();
      const newComments = result.comments || [];

      setComments((prevComments) => {
        const existingUuids = new Set(prevComments.map((c) => c.uuid));
        const uniqueNewComments = newComments.filter(
          (c: Comment) => !existingUuids.has(c.uuid)
        );

        if (uniqueNewComments.length === 0) {
          setHasMore(false);
          return prevComments;
        }

        return [...prevComments, ...uniqueNewComments];
      });

      setPage(nextPage);

      const totalLoadedComments = comments.length + newComments.length;
      setHasMore(totalLoadedComments < initialTotal && newComments.length > 0);
    } catch (err) {
      console.error("Error fetching more comments:", err);
      setError(err instanceof Error ? err.message : "خطا در بارگذاری نظرات");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, initialLimit, comments.length, initialTotal]);

  const { loaderRef } = useInfiniteScroll({
    onLoadMore: fetchMoreComments,
    hasMore,
    isLoading,
    threshold: 0.1,
    rootMargin: "200px",
  });

  const tableData = useMemo(
    () => ({
      comments,
      total: initialTotal,
      page,
      limit: initialLimit,
    }),
    [comments, initialTotal, page, initialLimit]
  );

  return (
    <div className="space-y-4">
      <CommentsTable data={tableData} />

      {isLoading && (
        <div className="flex justify-center items-center py-8" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
            <span className="text-sm text-gray-400">
              در حال بارگذاری نظرات...
            </span>
          </div>
        </div>
      )}

      {error && (
        <div
          className="flex justify-center items-center py-4 text-red-400"
          dir="rtl"
        >
          <span className="text-sm">{error}</span>
        </div>
      )}

      {!hasMore && comments.length > 0 && !isLoading && (
        <div
          className="flex justify-center items-center py-6 text-gray-500"
          dir="rtl"
        >
          <span className="text-sm">تمام نظرات نمایش داده شدند</span>
        </div>
      )}

      {comments.length === 0 && !isLoading && (
        <div
          className="flex flex-col justify-center items-center py-16 text-gray-400"
          dir="rtl"
        >
          <span className="text-lg mb-2">نظری یافت نشد</span>
          <span className="text-sm">هنوز نظری ثبت نشده است</span>
        </div>
      )}

      {hasMore && <div ref={loaderRef} className="h-10" />}
    </div>
  );
}
