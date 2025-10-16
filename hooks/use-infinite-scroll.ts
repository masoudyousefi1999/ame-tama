import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void | Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Custom hook for implementing infinite scroll functionality
 *
 * @param options - Configuration options for infinite scroll
 * @param options.onLoadMore - Callback function to load more data
 * @param options.hasMore - Boolean indicating if there's more data to load
 * @param options.isLoading - Boolean indicating if data is currently being loaded
 * @param options.threshold - Intersection threshold (0-1), default is 0.1
 * @param options.rootMargin - Root margin for intersection observer, default is '100px'
 *
 * @returns Object containing a ref to attach to the loader element
 *
 * @example
 * ```tsx
 * const { loaderRef } = useInfiniteScroll({
 *   onLoadMore: fetchMoreData,
 *   hasMore: hasMoreData,
 *   isLoading: loading,
 * });
 *
 * return (
 *   <div>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={loaderRef} />
 *   </div>
 * );
 * ```
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 0.1,
  rootMargin = "100px",
}: UseInfiniteScrollOptions) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    // Observe the loader element
    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  return { loaderRef };
}
