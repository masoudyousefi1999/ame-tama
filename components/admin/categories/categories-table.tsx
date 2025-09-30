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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">دسته‌بندی‌ها</h2>
        <Button
          onClick={() => router.push("/admin/categories/new")}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن دسته‌بندی
        </Button>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800 shadow-sm">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">تصویر</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>نامک</TableHead>
                <TableHead>توضیحات</TableHead>
                <TableHead>تاریخ ایجاد</TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    هیچ دسته‌بندی یافت نشد
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="relative w-10 h-10 rounded-md overflow-hidden">
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
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {category.description}
                    </TableCell>
                    <TableCell>{formatDate(category.createdAt)}</TableCell>
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
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">ویرایش</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(category.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأیید حذف</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف این دسته‌بندی اطمینان دارید؟ این عمل غیرقابل بازگشت
              است.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse space-x-reverse space-x-2">
            <AlertDialogCancel>لغو</AlertDialogCancel>
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
