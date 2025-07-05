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
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface IUser {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  phone: string;
  avatar: string;
}

interface UsersTableProps {
  data: {
    users: IUser[];
    total: number;
    page: number;
    limit: number;
  };
}

export function UsersTable({ data }: UsersTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (userId: string) => {
    setIsDeleting(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast({
        title: "موفقیت",
        description: "کاربر با موفقیت حذف شد",
        className: "bg-green-600 text-white",
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: "خطا",
        description: "حذف کاربر با شکست مواجه شد",
        variant: "destructive",
        className: "bg-red-600 text-white",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="overflow-x-auto p-2" dir="rtl">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-200 dark:border-gray-700">
            <TableHead className="sticky top-0 z-10 bg-gray-50/90 dark:bg-gray-800/90 text-right text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap px-4 py-2">
              نام
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-gray-50/90 dark:bg-gray-800/90 text-right text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap px-4 py-2">
              ایمیل
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-gray-50/90 dark:bg-gray-800/90 text-right text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap px-4 py-2">
              نقش
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-gray-50/90 dark:bg-gray-800/90 text-right text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap px-4 py-2">
              تاریخ ایجاد
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-gray-50/90 dark:bg-gray-800/90 text-right text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap px-4 py-2">
              عملیات
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.users.map((user, index) => (
            <TableRow
              key={user.uuid}
              className={`border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                index % 2 === 0
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-50/50 dark:bg-gray-700/25"
              }`}
            >
              <TableCell className="text-right font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap px-4 py-2">
                {`${user.firstName} ${user.lastName}`}
              </TableCell>
              <TableCell className="text-right text-gray-600 dark:text-gray-400 whitespace-nowrap px-4 py-2">
                {user.email}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap px-4 py-2">
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className={`${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {user.role === "ADMIN" ? "مدیر" : "کاربر"}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-gray-600 dark:text-gray-400 whitespace-nowrap px-4 py-2">
                {new Date(user.createdAt).toLocaleDateString("fa-IR")}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap px-4 py-2">
                <div className="flex items-center justify-end space-x-2 space-x-reverse">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Link href={`/admin/users/${user.uuid}/edit`}>
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
                          این عمل قابل بازگشت نیست. این کار حساب کاربری را به
                          طور دائم حذف خواهد کرد.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                          لغو
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(user.uuid)}
                          disabled={isDeleting === user.uuid}
                          className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting === user.uuid ? "در حال حذف..." : "حذف"}
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
  );
}
