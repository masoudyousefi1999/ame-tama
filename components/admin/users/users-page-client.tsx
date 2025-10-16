"use client";

import { useState, useCallback, useMemo } from "react";
import { UsersTable, type IUser } from "./users-table";
import { customFetch } from "@/lib/utils";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

interface UsersPageClientProps {
  initialUsers: IUser[];
  initialTotal: number;
  initialPage: number;
  initialLimit: number;
}

/**
 * Client-side component for users page with infinite scroll
 * Implements professional infinite scroll pattern with proper state management
 */
export function UsersPageClient({
  initialUsers,
  initialTotal,
  initialPage,
  initialLimit,
}: UsersPageClientProps) {
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialUsers.length < initialTotal);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch more users from the API
   * Implements deduplication and error handling
   */
  const fetchMoreUsers = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(initialLimit),
      });

      const response = await customFetch(`/users?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const result = await response.json();
      const newUsers = result.users || [];

      // Deduplicate users based on uuid
      setUsers((prevUsers) => {
        const existingUuids = new Set(prevUsers.map((u) => u.uuid));
        const uniqueNewUsers = newUsers.filter(
          (u: IUser) => !existingUuids.has(u.uuid)
        );

        // If no new unique users, we've reached the end
        if (uniqueNewUsers.length === 0) {
          setHasMore(false);
          return prevUsers;
        }

        return [...prevUsers, ...uniqueNewUsers];
      });

      setPage(nextPage);

      // Check if there are more users to load
      const totalLoadedUsers = users.length + newUsers.length;
      setHasMore(totalLoadedUsers < initialTotal && newUsers.length > 0);
    } catch (err) {
      console.error("Error fetching more users:", err);
      setError(err instanceof Error ? err.message : "خطا در بارگذاری کاربران");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, initialLimit, users.length, initialTotal]);

  // Use the custom infinite scroll hook
  const { loaderRef } = useInfiniteScroll({
    onLoadMore: fetchMoreUsers,
    hasMore,
    isLoading,
    threshold: 0.1,
    rootMargin: "200px",
  });

  // Memoize data object to prevent unnecessary re-renders
  const tableData = useMemo(
    () => ({
      users,
      total: initialTotal,
      page,
      limit: initialLimit,
    }),
    [users, initialTotal, page, initialLimit]
  );

  return (
    <div className="space-y-4">
      <UsersTable data={tableData} />

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-6" dir="rtl">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />
            <span className="text-sm text-gray-400">در حال بارگذاری...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          className="flex justify-center items-center py-4 text-red-400"
          dir="rtl"
        >
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* No more data indicator */}
      {!hasMore && users.length > 0 && !isLoading && (
        <div
          className="flex justify-center items-center py-4 text-gray-500"
          dir="rtl"
        >
          <span className="text-xs">پایان لیست</span>
        </div>
      )}

      {/* Infinite scroll loader element */}
      {hasMore && <div ref={loaderRef} className="h-10" />}
    </div>
  );
}
