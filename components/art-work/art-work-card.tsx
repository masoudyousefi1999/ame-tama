"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "@/components/ui/custom-image";
import { IArtWorkType } from "@/lib/art-work";
import { Badge } from "@/components/ui/badge";
import { Eye, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ArtWorkCardProps {
  artWork: IArtWorkType;
  className?: string;
  eagerLoad?: boolean;
}

function ArtWorkCardComponent({
  artWork,
  className,
  eagerLoad = false,
}: ArtWorkCardProps) {
  return (
    <Link
      href={`/art-work/${artWork.uuid}`}
      className={cn(
        "group relative block overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      {/* تصویر */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={artWork.image.url}
          alt={artWork.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={eagerLoad}
        />
        {/* Overlay با اطلاعات */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="line-clamp-2 text-sm font-medium">{artWork.title}</p>
            {artWork.description && (
              <p className="mt-1 line-clamp-2 text-xs text-white/90">
                {artWork.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* اطلاعات */}
      <div className="p-4">
        {/* عنوان و تگ */}
        <div className="mb-3">
          <h3 className="mb-2 line-clamp-1 text-base font-semibold text-foreground">
            {artWork.title}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {artWork.tag.name}
          </Badge>
        </div>

        {/* اطلاعات کاربر */}
        <div className="mb-3 flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-border">
            {artWork.user.avatar ? (
              <Image
                src={artWork.user.avatar}
                alt={`${artWork.user.firstName}`}
                fill
                className="object-cover"
                sizes="32px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium">
                {artWork.user.firstName?.[0] || "U"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {artWork.user.firstName}
            </p>
          </div>
        </div>

        {/* آمار */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{artWork.viewCount || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{artWork.likeCount || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <ThumbsDown className="h-3.5 w-3.5" />
            <span>{artWork.dislikeCount || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const ArtWorkCard = memo(
  ArtWorkCardComponent,
  (prevProps, nextProps) => {
    // مقایسه عمیق برای جلوگیری از re-render های غیرضروری
    return (
      prevProps.artWork.uuid === nextProps.artWork.uuid &&
      prevProps.artWork.likeCount === nextProps.artWork.likeCount &&
      prevProps.artWork.dislikeCount === nextProps.artWork.dislikeCount &&
      prevProps.artWork.viewCount === nextProps.artWork.viewCount &&
      prevProps.className === nextProps.className &&
      prevProps.eagerLoad === nextProps.eagerLoad
    );
  }
);
