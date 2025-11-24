"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  User,
  Phone,
  Mail,
  Package,
  Calendar,
  MessageSquare,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { customFetch } from "@/lib/utils";
import type { Comment } from "./comments-page-client";
import { formatPriceDivided } from "@/lib/format-price";

interface CommentDetailModalProps {
  comment: Comment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentDetailModal({
  comment,
  open,
  onOpenChange,
}: CommentDetailModalProps) {
  const [isPublished, setIsPublished] = useState(comment?.isPublished || false);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);
  const { toast } = useToast();

  // Update local state when comment changes
  React.useEffect(() => {
    if (comment) {
      // Check different possible field names and values
      const published =
        comment.isPublished === true ||
        (comment.isPublished as any) === 1 ||
        (comment.isPublished as any) === "1" ||
        (comment as any).published === true ||
        (comment as any).published === 1 ||
        (comment as any).published === "1";

      setIsPublished(published);
    }
  }, [comment]);

  const handleTogglePublish = async () => {
    if (!comment) return;

    setIsTogglingPublish(true);

    try {
      const response = await customFetch(`/comment/${comment.id}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle publish status");
      }

      // Toggle the local state
      setIsPublished(!isPublished);

      toast({
        title: "موفق",
        description: isPublished
          ? "نظر از حالت انتشار خارج شد"
          : "نظر منتشر شد",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast({
        title: "خطا",
        description: "خطا در تغییر وضعیت انتشار",
        variant: "error",
      });
    } finally {
      setIsTogglingPublish(false);
    }
  };

  if (!comment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[800px] bg-gray-800 border-gray-700"
        dir="rtl"
      >
        <DialogHeader className="pr-10">
          <DialogTitle className="flex items-center gap-3 text-white flex-wrap">
            <MessageSquare className="h-5 w-5" />
            <span>جزئیات نظر</span>
            <Badge
              variant="outline"
              className="font-mono text-xs border-gray-600 text-gray-300"
            >
              #{comment.uuid.substring(0, 8)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[680px] pl-4" dir="rtl">
          <div className="space-y-6">
            {/* Date Info & Publish Status */}
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">تاریخ ثبت</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-medium text-white">
                      {new Date(comment.createdAt).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">آخرین بروزرسانی</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-medium text-white">
                      {new Date(comment.updatedAt).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">وضعیت انتشار</p>
                  <div className="flex items-center gap-2">
                    {isPublished ? (
                      <Badge
                        variant="default"
                        className="bg-green-900/30 text-green-400 border-green-700"
                      >
                        <Eye className="h-3 w-3 ml-1" />
                        منتشر شده
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-900/30 text-yellow-400 border-yellow-700"
                      >
                        <EyeOff className="h-3 w-3 ml-1" />
                        در انتظار انتشار
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Info */}
              <div className="border border-gray-600 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-white">
                  <User className="h-4 w-4" />
                  اطلاعات کاربر
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">نام و نام خانوادگی</p>
                    <p className="font-medium text-white">
                      {comment.user.firstName} {comment.user.lastName}
                    </p>
                  </div>
                  <Separator className="bg-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">شماره تماس</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="font-mono font-medium text-white">
                        {comment.user.phone}
                      </span>
                    </div>
                  </div>
                  {comment.user.email && (
                    <React.Fragment>
                      <Separator className="bg-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">ایمیل</p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="font-medium text-xs break-all text-white">
                            {comment.user.email}
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  <Separator className="bg-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">نقش</p>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-700 text-gray-300 border-gray-600"
                    >
                      {comment.user.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="border border-gray-600 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-white">
                  <Package className="h-4 w-4" />
                  محصول مربوطه
                </h3>
                <Link
                  href={`/product/${comment.product.slug}`}
                  className="block space-y-3 hover:opacity-75 transition-opacity"
                >
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-600">
                    <Image
                      src={
                        comment.product.productMedia?.[0]?.url ||
                        "/placeholder.svg"
                      }
                      alt={comment.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm line-clamp-2 text-white">
                      {comment.product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-600 text-gray-300"
                      >
                        امتیاز: {comment.product.rating}⭐
                      </Badge>
                      <span className="text-sm font-bold text-green-400">
                        {formatPriceDivided(comment.product.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Comment Text */}
            <div className="border border-gray-600 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2 text-white">
                <MessageSquare className="h-4 w-4" />
                متن نظر
              </h3>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-white">
                  {comment.text}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Publish Toggle Button */}
              <Button
                onClick={handleTogglePublish}
                disabled={isTogglingPublish}
                className={`w-full ${
                  isPublished
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isTogglingPublish ? (
                  <React.Fragment>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    در حال بروزرسانی...
                  </React.Fragment>
                ) : isPublished ? (
                  <React.Fragment>
                    <EyeOff className="h-4 w-4 ml-2" />
                    لغو انتشار نظر
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Eye className="h-4 w-4 ml-2" />
                    انتشار نظر
                  </React.Fragment>
                )}
              </Button>

              {/* Other Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700"
                >
                  <Link href={`/product/${comment.product.slug}`}>
                    مشاهده محصول
                  </Link>
                </Button>
                <Button
                  variant="default"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  بستن
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
