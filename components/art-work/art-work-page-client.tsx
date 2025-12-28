"use client";

import {
  useState,
  useEffect,
  useCallback,
  memo,
  useMemo,
  useRef,
  startTransition,
} from "react";
import { ArtWorkCard } from "./art-work-card";
const UploadArtWorkModal = dynamic(
  () =>
    import("./upload-art-work-modal").then((mod) => ({
      default: mod.UploadArtWorkModal,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import GradientHero from "@/components/ui/gradient-hero";
import { IArtWorkType, getAllArtWorks } from "@/lib/art-work";
import { Loader2, Upload, Sparkles, ArrowUp } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useAuth } from "@/context/auth-context";
import { useLoginModal } from "@/context/login-modal-context";
import dynamic from "next/dynamic";

const LoginModal = dynamic(() => import("@/components/auth/login-modal"), {
  ssr: false,
});

// ArtWorkCard قبلاً memo شده است

interface ArtWorkPageClientProps {
  initialArtWorks: IArtWorkType[];
  totalCount: number;
  currentPage: number;
  limit: number;
}

export default function ArtWorkPageClient({
  initialArtWorks,
  totalCount: initialTotalCount,
  currentPage: initialPage,
  limit,
}: ArtWorkPageClientProps) {
  const { user } = useAuth();
  const { isLoginModalOpen, openLoginModal, closeLoginModal } = useLoginModal();
  const [artWorks, setArtWorks] = useState(initialArtWorks);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(
    initialTotalCount > initialArtWorks.length
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // استفاده از ref برای جلوگیری از re-render های غیرضروری
  const initialArtWorksRef = useRef(initialArtWorks);
  const initialPageRef = useRef(initialPage);
  const initialTotalCountRef = useRef(initialTotalCount);

  // به‌روزرسانی ref ها فقط زمانی که واقعاً تغییر کرده‌اند
  useEffect(() => {
    const hasChanged =
      initialArtWorksRef.current !== initialArtWorks ||
      initialPageRef.current !== initialPage ||
      initialTotalCountRef.current !== initialTotalCount;

    if (hasChanged) {
      initialArtWorksRef.current = initialArtWorks;
      initialPageRef.current = initialPage;
      initialTotalCountRef.current = initialTotalCount;

      setArtWorks(initialArtWorks);
      setPage(initialPage);
      setHasMore(initialTotalCount > initialArtWorks.length);
    }
  }, [initialArtWorks, initialTotalCount, initialPage]);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const result = await getAllArtWorks(nextPage, limit);

      const newArtWorks = result.artWorks || [];
      const updatedTotalCount =
        result.totalCount || initialTotalCountRef.current;

      startTransition(() => {
        setArtWorks((prev) => {
          const existingUuids = new Set(prev.map((aw) => aw.uuid));
          const filteredNew = newArtWorks.filter(
            (aw) => !existingUuids.has(aw.uuid)
          );
          if (filteredNew.length === 0) return prev;

          const newList = [...prev, ...filteredNew];
          setHasMore(newList.length < updatedTotalCount);
          return newList;
        });
      });

      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching more art works:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, limit]);

  // استفاده از هوک infinite scroll
  const { loaderRef } = useInfiniteScroll({
    onLoadMore: fetchMore,
    hasMore,
    isLoading: loading,
    threshold: 0.1,
    rootMargin: "200px",
  });

  const handleUploadSuccess = useCallback(() => {
    // بارگذاری مجدد لیست از صفحه اول
    getAllArtWorks(1, limit)
      .then((result) => {
        startTransition(() => {
          setArtWorks(result.artWorks || []);
          setPage(1);
          setHasMore((result.artWorks?.length || 0) < (result.totalCount || 0));
        });
      })
      .catch((error) => {
        console.error("Error refreshing art works:", error);
      });
  }, [limit]);

  // بررسی لاگین بودن کاربر و باز کردن مودال مناسب
  const handleUploadClick = useCallback(() => {
    if (!user) {
      // ذخیره intent در localStorage
      try {
        localStorage.setItem("pending-artwork-upload", "true");
      } catch {}
      openLoginModal();
      return;
    }
    setIsModalOpen(true);
  }, [user, openLoginModal]);

  // بعد از لاگین موفق، مودال آپلود را باز کن
  const handleLoginSuccess = useCallback(() => {
    closeLoginModal();
    // بررسی localStorage برای pending upload
    try {
      const hasPendingUpload = localStorage.getItem("pending-artwork-upload");
      if (hasPendingUpload === "true") {
        localStorage.removeItem("pending-artwork-upload");
        // کمی تاخیر برای اطمینان از به‌روزرسانی state
        setTimeout(() => {
          setIsModalOpen(true);
        }, 100);
      }
    } catch {}
  }, [closeLoginModal]);

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoize art works list برای جلوگیری از re-render های غیرضروری
  const memoizedArtWorks = useMemo(() => artWorks, [artWorks]);

  // بررسی localStorage هنگام mount و بعد از لاگین
  useEffect(() => {
    if (isMounted && user) {
      try {
        const hasPendingUpload = localStorage.getItem("pending-artwork-upload");
        if (hasPendingUpload === "true" && !isLoginModalOpen && !isModalOpen) {
          localStorage.removeItem("pending-artwork-upload");
          setIsModalOpen(true);
        }
      } catch {}
    }
  }, [isMounted, user, isLoginModalOpen, isModalOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-16 lg:mt-20 lg:pb-24">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumb
          items={[{ label: "آثار هنری", href: "/art-work", isCurrent: true }]}
          className="mb-6"
        />
      </div>

      {/* Gradient Hero Section */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <GradientHero
          title="آثار هنری کاربران"
          description="مجموعه‌ای از آثار هنری زیبای کاربران ما را مشاهده کنید و اثر هنری خود را به اشتراک بگذارید"
          className="rounded-3xl"
        />
      </div>

      {/* CTA Section برای آپلود */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-4 sm:p-6 md:p-8 shadow-lg">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex-1 w-full text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-2 md:mb-3 flex-wrap">
                <div className="relative flex-shrink-0">
                  <Sparkles
                    className={`h-5 w-5 md:h-6 md:w-6 text-primary ${
                      isMounted ? "animate-pulse" : ""
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-primary/20 rounded-full blur-xl ${
                      isMounted ? "animate-ping" : ""
                    }`}
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground leading-tight break-words">
                  اثر هنری خود را به اشتراک بگذارید
                </h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed px-1 sm:px-2 md:px-0 break-words">
                نقاشی‌ها و آثار هنری خود را با دیگران به اشتراک بگذارید و از
                نظرات آن‌ها بهره‌مند شوید
              </p>
            </div>

            <Button
              onClick={handleUploadClick}
              size="lg"
              className="group relative w-full md:w-auto min-w-[200px] text-primary-foreground hover:from-primary/60 hover:to-accent/90 shadow-xl transition-all duration-300 hover:scale-105 active:scale-100 whitespace-nowrap"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Upload className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:animate-bounce" />
              <span className="font-semibold text-sm md:text-base">
                آپلود اثر هنری
              </span>
              <ArrowUp className="mr-2 h-3 w-3 md:h-4 md:w-4 opacity-70 group-hover:translate-y-[-2px] transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid آثار هنری */}
      <section className="container mx-auto px-4 md:px-6 mt-8 md:mt-12">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-primary">
            همه آثار هنری
          </h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              {initialTotalCount} اثر هنری
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {memoizedArtWorks && memoizedArtWorks.length > 0 ? (
            memoizedArtWorks.map((artWork, index) => (
              <ArtWorkCard
                artWork={artWork}
                key={artWork.uuid}
                eagerLoad={index < 4} // Eager load first 4 artworks
              />
            ))
          ) : !loading ? (
            <div className="col-span-full py-16 md:py-24 text-center flex flex-col items-center">
              <div className="relative mb-6">
                <div
                  className={`absolute inset-0 bg-primary/10 rounded-full blur-2xl ${
                    isMounted ? "animate-pulse" : ""
                  }`}
                />
                <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 rounded-full p-6">
                  <Upload
                    className={`h-12 w-12 text-primary ${
                      isMounted ? "animate-bounce" : ""
                    }`}
                  />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                هنوز اثری هنری آپلود نشده است
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-md">
                اولین کسی باشید که اثر هنری خود را به اشتراک می‌گذارد و دیگران
                را شگفت‌زده می‌کند
              </p>
              <Button
                onClick={handleUploadClick}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-100 rounded-full px-8"
              >
                <Upload className="ml-2 h-5 w-5" />
                <span className="font-semibold">
                  اولین اثر هنری را آپلود کنید
                </span>
                <Sparkles className="mr-2 h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center py-6 md:py-8">
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div
            ref={loaderRef}
            className="h-8 md:h-10 flex justify-center items-center"
          />
        )}
      </section>

      {/* Floating Upload Button - برای موبایل */}
      <div className="fixed bottom-[60px] left-6 right-6 z-40 md:hidden">
        <Button
          onClick={handleUploadClick}
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-100 rounded-full"
        >
          <Upload className="ml-2 h-5 w-5" />
          <span className="font-semibold">آپلود اثر هنری</span>
        </Button>
      </div>

      {/* Modal آپلود */}
      <UploadArtWorkModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleUploadSuccess}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
