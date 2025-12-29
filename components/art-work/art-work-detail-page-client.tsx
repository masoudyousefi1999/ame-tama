"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "@/components/ui/custom-image";
import {
  IArtWorkType,
  reactToArtWork,
  incrementViewCount,
} from "@/lib/art-work";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Eye,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Calendar,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";
import { useLoginModal } from "@/context/login-modal-context";
import dynamic from "next/dynamic";

const LoginModal = dynamic(() => import("@/components/auth/login-modal"), {
  ssr: false,
});

interface ArtWorkDetailPageClientProps {
  artWork: IArtWorkType;
}

export function ArtWorkDetailPageClient({
  artWork: initialArtWork,
}: ArtWorkDetailPageClientProps) {
  const { user } = useAuth();
  const { isLoginModalOpen, openLoginModal, closeLoginModal } = useLoginModal();
  const [artWork, setArtWork] = useState(initialArtWork);
  const [isReacting, setIsReacting] = useState(false);
  const [pendingReaction, setPendingReaction] = useState<1 | -1 | null>(null);
  const [hasViewed, setHasViewed] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // تابع اصلی برای ثبت واکنش
  const performReaction = useCallback(
    async (reaction: 1 | -1) => {
      if (isReacting) return;

      // ذخیره مقادیر قبلی برای rollback
      const previousLikeCount = artWork.likeCount;
      const previousDislikeCount = artWork.dislikeCount;

      // Optimistic update
      if (reaction === 1) {
        setArtWork((prev) => ({
          ...prev,
          likeCount: prev.likeCount + 1,
        }));
      } else {
        setArtWork((prev) => ({
          ...prev,
          dislikeCount: prev.dislikeCount + 1,
        }));
      }

      setIsReacting(true);

      try {
        const result = await reactToArtWork(artWork.uuid, reaction);

        if (!result.success) {
          // Rollback در صورت خطا
          setArtWork((prev) => ({
            ...prev,
            likeCount: previousLikeCount,
            dislikeCount: previousDislikeCount,
          }));

          toast({
            title: "خطا",
            description: result.message || "خطا در ثبت واکنش",
            variant: "error",
          });
        }
      } catch (error) {
        // Rollback در صورت خطا
        setArtWork((prev) => ({
          ...prev,
          likeCount: previousLikeCount,
          dislikeCount: previousDislikeCount,
        }));

        toast({
          title: "خطا",
          description: "خطا در ثبت واکنش",
          variant: "error",
        });
      } finally {
        setIsReacting(false);
      }
    },
    [artWork.uuid, isReacting, toast]
  );

  // بررسی لاگین بودن کاربر قبل از واکنش
  const handleReact = useCallback(
    (reaction: 1 | -1) => {
      if (!user) {
        // ذخیره intent در localStorage
        try {
          localStorage.setItem(
            `pending-artwork-reaction-${artWork.uuid}`,
            String(reaction)
          );
        } catch {}
        setPendingReaction(reaction);
        openLoginModal();
        return;
      }
      performReaction(reaction);
    },
    [user, artWork.uuid, openLoginModal, performReaction]
  );

  // بعد از لاگین موفق، واکنش را ثبت کن
  const handleLoginSuccess = useCallback(() => {
    closeLoginModal();
    if (pendingReaction !== null) {
      const reaction = pendingReaction;
      setPendingReaction(null);
      // کمی تاخیر برای اطمینان از به‌روزرسانی state
      setTimeout(() => {
        performReaction(reaction);
      }, 100);
    }
  }, [pendingReaction, closeLoginModal, performReaction]);

  // بررسی localStorage هنگام mount و بعد از لاگین
  useEffect(() => {
    if (user) {
      try {
        const pendingReactionKey = `pending-artwork-reaction-${artWork.uuid}`;
        const storedReaction = localStorage.getItem(pendingReactionKey);
        if (storedReaction && !isLoginModalOpen && !isReacting) {
          const reaction = Number(storedReaction) as 1 | -1;
          localStorage.removeItem(pendingReactionKey);
          performReaction(reaction);
        }
      } catch {}
    }
  }, [user, artWork.uuid, isLoginModalOpen, isReacting, performReaction]);

  // افزایش view count هنگام بارگذاری صفحه
  useEffect(() => {
    if (!hasViewed) {
      incrementViewCount(artWork.uuid)
        .then((result) => {
          if (result.success && result.shouldIncrement) {
            setHasViewed(true);
            // Optimistic update برای view count فقط اگر shouldIncrement true باشد
            setArtWork((prev) => ({
              ...prev,
              viewCount: prev.viewCount + 1,
            }));
          } else if (result.success) {
            // اگر موفق بود اما نباید افزایش پیدا کند (message: null)
            setHasViewed(true);
          }
        })
        .catch((error) => {
          console.error("Error incrementing view count:", error);
        });
    }
  }, [artWork.uuid, hasViewed]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 lg:mt-20" dir="rtl">
        {/* Breadcrumb */}
        <div className="mb-2">
          <Breadcrumb
            items={[
              {
                href: "/art-work",
                label: "آثار هنری",
              },
              {
                href: `/art-work/${artWork.uuid}`,
                label: artWork.title,
                isCurrent: true,
              },
            ]}
            className="mb-2"
          />
        </div>

        {/* دکمه بازگشت */}
        <div className="mb-6 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center text-muted-foreground hover:text-primary transition-all duration-200 hover:bg-primary/10 rounded-full px-4"
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            <span>بازگشت</span>
          </Button>
        </div>

        {/* محتوای اصلی */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* تصویر */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              src={artWork.image.url}
              alt={artWork.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* اطلاعات */}
          <div className="space-y-6">
            {/* عنوان و تگ */}
            <div>
              <h1 className="mb-4 text-3xl font-bold text-foreground">
                {artWork.title}
              </h1>
              <Link href={`/anime/${artWork.tag.slug}`}>
                <Badge
                  variant="secondary"
                  className="text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
                >
                  {artWork.tag.name}
                </Badge>
              </Link>
            </div>

            {/* توضیحات */}
            {artWork.description && (
              <div>
                <h2 className="mb-2 text-lg font-semibold text-foreground">
                  توضیحات
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {artWork.description}
                </p>
              </div>
            )}

            {/* اطلاعات کاربر */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                هنرمند
              </h2>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-border">
                  {artWork.user.avatar ? (
                    <Image
                      src={artWork.user.avatar}
                      alt={`${artWork.user.firstName}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-lg font-medium">
                      {artWork.user.firstName?.[0] || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {artWork.user.firstName}
                  </p>
                  {artWork.user.role && (
                    <p className="text-sm text-muted-foreground">
                      {artWork.user.role}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* آمار و دکمه‌های واکنش */}
            <div className="space-y-4">
              {/* آمار */}
              <div className="grid grid-cols-3 gap-4 rounded-lg border border-border bg-card p-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {artWork.viewCount || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">بازدید</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <ThumbsUp className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {artWork.likeCount || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">لایک</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <ThumbsDown className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {artWork.dislikeCount || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">دیسلایک</p>
                </div>
              </div>

              {/* دکمه‌های واکنش */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleReact(1)}
                  disabled={isReacting}
                  variant="outline"
                  className="flex-1 gap-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                >
                  {isReacting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ThumbsUp className="h-4 w-4" />
                  )}
                  لایک
                </Button>
                <Button
                  onClick={() => handleReact(-1)}
                  disabled={isReacting}
                  variant="outline"
                  className="flex-1 gap-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  {isReacting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ThumbsDown className="h-4 w-4" />
                  )}
                  دیسلایک
                </Button>
              </div>
            </div>

            {/* تاریخ */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>تاریخ انتشار: {formatDate(artWork.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
