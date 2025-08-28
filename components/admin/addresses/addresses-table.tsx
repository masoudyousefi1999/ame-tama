"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Address {
  id: string;
  user: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  houseNumber: string;
  floorNumber: string;
}

interface AddressesTableProps {
  addresses: Address[];
}

export function AddressesTable({ addresses }: AddressesTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (addressId: string) => {
    setIsDeleting(addressId);
    try {
      // Replace with actual API call
      const response = await fetch(`/api/address/${addressId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      toast({
        title: "موفقیت",
        description: "آدرس با موفقیت حذف شد",
        className: "bg-green-600 text-white",
      });

      // Refresh the page or update the data
      window.location.reload();
    } catch (error) {
      toast({
        title: "خطا",
        description: "حذف آدرس با شکست مواجه شد",
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
                کاربر
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                استان
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                شهر
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                آدرس
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                کد پستی
              </TableHead>
              <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium text-left">
                عملیات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.map((address, index) => (
              <TableRow
                key={address.id}
                className={`border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50/50 dark:bg-gray-700/25"
                }`}
              >
                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                  {address.user}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  {address.province}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  {address.city}
                </TableCell>
                <TableCell className="max-w-xs truncate text-gray-600 dark:text-gray-400">
                  {address.address}، واحد {address.houseNumber}، طبقه{" "}
                  {address.floorNumber}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  {address.postalCode}
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex items-center justify-start space-x-2 space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Link href={`/admin/addresses/${address.id}/edit`}  prefetch={false}>
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
                            این عمل قابل بازگشت نیست. این کار آدرس را به طور
                            دائم حذف خواهد کرد.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            لغو
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(address.id)}
                            disabled={isDeleting === address.id}
                            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeleting === address.id
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
