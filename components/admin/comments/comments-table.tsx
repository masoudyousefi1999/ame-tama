"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  MessageSquare,
  User,
  Package,
  CheckCircle,
  Clock,
} from "lucide-react";
import type { Comment } from "./comments-page-client";
import { CommentDetailModal } from "./comment-detail-modal";
import { formatPriceDivided } from "@/lib/format-price";

interface CommentsTableProps {
  data: {
    comments: Comment[];
    total: number;
    page: number;
    limit: number;
  };
}

export function CommentsTable({ data }: CommentsTableProps) {
  const { comments } = data;
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewComment = (comment: Comment) => {
    setSelectedComment(comment);
    setIsModalOpen(true);
  };

  const getUserName = (comment: Comment): string => {
    return `${comment.user.firstName} ${comment.user.lastName}`;
  };

  const truncateText = (text: string, maxLength: number = 80): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="overflow-hidden" dir="rtl">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-transparent">
              <TableHead className="text-right text-gray-300">محصول</TableHead>
              <TableHead className="text-right text-gray-300">کاربر</TableHead>
              <TableHead className="text-right text-gray-300">
                متن نظر
              </TableHead>
              <TableHead className="text-right text-gray-300">وضعیت</TableHead>
              <TableHead className="text-right text-gray-300">
                تاریخ ثبت
              </TableHead>
              <TableHead className="text-left text-gray-300">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length === 0 ? (
              <TableRow className="border-gray-700">
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-gray-400"
                >
                  <div className="flex flex-col items-center gap-3">
                    <MessageSquare className="h-12 w-12 text-gray-600" />
                    <span>نظری یافت نشد</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              comments.map((comment, index) => {
                const userName = getUserName(comment);

                // Debug: Check isPublished value
                if (index === 0) {
                  console.log(
                    "Comment isPublished:",
                    comment.isPublished,
                    "Type:",
                    typeof comment.isPublished
                  );
                  console.log("Full comment:", comment);
                }

                return (
                  <TableRow
                    key={comment.uuid}
                    className="border-gray-700 hover:bg-gray-700/30 transition-colors"
                  >
                    <TableCell className="text-right">
                      <Link
                        href={`/product/${comment.product.slug}`}
                        className="flex items-center gap-3 hover:opacity-75 transition-opacity"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
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
                        <div className="min-w-0">
                          <p className="font-medium text-white line-clamp-1">
                            {comment.product.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatPriceDivided(comment.product.price)}
                          </p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-white">{userName}</p>
                          <p className="text-xs text-gray-400 font-mono">
                            {comment.user.phone}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {truncateText(comment.text)}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        // Check different possible field names and values
                        const isPublished = comment.isPublished === true;

                        return isPublished ? (
                          <Badge
                            variant="default"
                            className="bg-green-900/30 text-green-400 border-green-700"
                          >
                            <CheckCircle className="h-3 w-3 ml-1" />
                            منتشر شده
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-900/30 text-yellow-400 border-yellow-700"
                          >
                            <Clock className="h-3 w-3 ml-1" />
                            در انتظار
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-right text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                    </TableCell>
                    <TableCell className="text-left">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewComment(comment)}
                        className="hover:bg-gray-700 text-gray-300 hover:text-white"
                        title="مشاهده جزئیات"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <CommentDetailModal
        comment={selectedComment}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
