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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  uuid: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  category: string;
  rating: number;
  image: string;
}

interface ProductsTableProps {
  data: {
    products: Product[];
    total: number;
    page: number;
    limit: number;
  };
}

export function ProductsTable({ data }: ProductsTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (productId: string) => {
    setIsDeleting(productId);
    try {
      // Replace with actual API call
      const response = await fetch(`/api/product/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast({
        title: "موفقیت",
        description: "محصول با موفقیت حذف شد",
        className: "bg-green-600 text-white",
      });

      // Refresh the page or update the data
      window.location.reload();
    } catch (error) {
      toast({
        title: "خطا",
        description: "حذف محصول با شکست مواجه شد",
        variant: "error",
        className: "bg-red-600 text-white",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="overflow-hidden" dir="rtl">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-gray-700">
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                تصویر
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                نام
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                قیمت
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                موجودی
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                دسته‌بندی
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                امتیاز
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium text-left">
                عملیات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.products.map((product, index) => (
              <TableRow
                key={product.uuid}
                className={`border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50/50 dark:bg-gray-700/25"
                }`}
              >
                <TableCell>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                  />
                </TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-gray-100 max-w-xs">
                  <div className="truncate">{product.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {product.slug}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                  ${product.price.toLocaleString("fa-IR")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={product.quantity > 0 ? "default" : "destructive"}
                    className={`${
                      product.quantity > 0
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                    }`}
                  >
                    {product.quantity.toLocaleString("fa-IR")} موجود
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  {product.category}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-1" />
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {product.rating.toLocaleString("fa-IR")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex items-center justify-start space-x-2 space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Link href={`/admin/products/${product.uuid}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        className="bg-white dark:bg-gray-800"
                        dir="rtl"
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                            آیا مطمئن هستید؟
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                            این عمل قابل بازگشت نیست. این کار محصول را به طور
                            دائم حذف خواهد کرد.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            لغو
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.uuid)}
                            disabled={isDeleting === product.uuid}
                            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeleting === product.uuid
                              ? "در حال حذف..."
                              : "حذف"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
