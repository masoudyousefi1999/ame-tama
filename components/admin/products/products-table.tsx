"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "@/components/ui/custom-image";
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
import { formatPrice } from "@/lib/format-price";

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

  const handleDelete = useCallback(
    async (productId: string) => {
      setIsDeleting(productId);
      try {
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
    },
    [toast]
  );

  return (
    <div className="overflow-hidden" dir="rtl">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-transparent">
              <TableHead className="text-right text-gray-300">تصویر</TableHead>
              <TableHead className="text-right text-gray-300">نام</TableHead>
              <TableHead className="text-right text-gray-300">قیمت</TableHead>
              <TableHead className="text-right text-gray-300">موجودی</TableHead>
              <TableHead className="text-right text-gray-300">
                دسته‌بندی
              </TableHead>
              <TableHead className="text-right text-gray-300">امتیاز</TableHead>
              <TableHead className="text-left text-gray-300">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.products.map((product) => (
              <TableRow
                key={product.uuid}
                className="border-gray-700 hover:bg-gray-700/30 transition-colors"
              >
                <TableCell className="text-right">
                  <Link href={`/admin/products/${product.uuid}/edit`}>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="rounded-lg object-cover border border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </Link>
                </TableCell>
                <TableCell className="text-right font-medium text-white max-w-xs">
                  <Link
                    href={`/admin/products/${product.uuid}/edit`}
                    className="hover:text-purple-400 transition-colors"
                  >
                    <div className="truncate">{product.name}</div>
                    <div className="text-sm text-gray-400 truncate">
                      {product.slug}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-right font-semibold text-white">
                  {formatPrice(product.price)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={product.quantity > 0 ? "default" : "destructive"}
                    className={`${
                      product.quantity > 0
                        ? "bg-emerald-900/30 text-emerald-400 border-emerald-700"
                        : "bg-red-900/30 text-red-400 border-red-700"
                    }`}
                  >
                    {product.quantity} موجود
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-gray-400">
                  {product.category}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-1" />
                    <span className="text-white font-medium">
                      {product.rating}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex items-center justify-start space-x-2 space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-gray-700 text-gray-300 hover:text-white"
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
                          className="hover:bg-gray-700 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        className="bg-gray-800 border-gray-700"
                        dir="rtl"
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">
                            آیا مطمئن هستید؟
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            این عمل قابل بازگشت نیست. این کار محصول را به طور
                            دائم حذف خواهد کرد.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
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
