"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Trash2, Plus } from "lucide-react";
import { CustomImage as Image } from "@/components/ui/custom-image";
import { customFetch } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  image: string;
  createdAt: string;
}

export function CategoriesTable({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    try {
      const response = await customFetch(`/category/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("حذف دسته‌بندی با خطا مواجه شد");
      }

      setCategories(categories.filter((category) => category.id !== deleteId));

      toast({
        title: "موفقیت",
        description: "دسته‌بندی با موفقیت حذف شد",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      toast({
        title: "خطا",
        description:
          error instanceof Error
            ? error.message
            : "حذف دسته‌بندی با خطا مواجه شد",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex justify-end">
        <Button
          onClick={() => router.push("/admin/categories/new")}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن دسته‌بندی
        </Button>
      </div>

      <div className="bg-gray-800/80 rounded-lg border border-gray-700">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-transparent">
                <TableHead className="w-[80px] text-right text-gray-300">
                  تصویر
                </TableHead>
                <TableHead className="text-right text-gray-300">نام</TableHead>
                <TableHead className="text-right text-gray-300">نامک</TableHead>
                <TableHead className="text-right text-gray-300">
                  توضیحات
                </TableHead>
                <TableHead className="text-right text-gray-300">
                  تاریخ ایجاد
                </TableHead>
                <TableHead className="text-left text-gray-300">
                  عملیات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow className="border-gray-700">
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-gray-400"
                  >
                    هیچ دسته‌بندی یافت نشد
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow
                    key={category.id}
                    className="border-gray-700 hover:bg-gray-700/30 transition-colors"
                  >
                    <TableCell className="text-right">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-700">
                        <Image
                          src={
                            category.image ||
                            "/placeholder.svg?height=40&width=40"
                          }
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-white">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-right text-gray-400">
                      {category.slug}
                    </TableCell>
                    <TableCell className="text-right max-w-[200px] truncate text-gray-400">
                      {category.description}
                    </TableCell>
                    <TableCell className="text-right text-gray-400">
                      {formatDate(category.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-reverse space-x-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(
                              `/admin/categories/${category.slug}/edit`
                            )
                          }
                          className="hover:bg-gray-700 text-gray-300 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">ویرایش</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(category.id)}
                          className="hover:bg-gray-700 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">حذف</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent dir="rtl" className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              تأیید حذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              آیا از حذف این دسته‌بندی اطمینان دارید؟ این عمل غیرقابل بازگشت
              است.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse space-x-reverse space-x-2">
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
              لغو
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "در حال حذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
