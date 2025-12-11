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
import Image from "@/components/ui/custom-image";
import { customFetch } from "@/lib/utils";
import { ITagType } from "@/lib/tags";

export function TagsTable({ initialTags }: { initialTags: ITagType[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [tags, setTags] = useState<ITagType[]>(initialTags);
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteUuid) return;

    setIsDeleting(true);

    try {
      const response = await customFetch(`/tag/${deleteUuid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("حذف انیمه با خطا مواجه شد");
      }

      setTags(tags.filter((tag) => tag.uuid !== deleteUuid));

      toast({
        title: "موفقیت",
        description: "انیمه با موفقیت حذف شد",
        className: "bg-success text-success-foreground",
      });
    } catch (error) {
      toast({
        title: "خطا",
        description:
          error instanceof Error ? error.message : "حذف انیمه با خطا مواجه شد",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
      setDeleteUuid(null);
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
          onClick={() => router.push("/admin/tags/new")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن انیمه
        </Button>
      </div>

      <div className="bg-card/80 rounded-lg border border-border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-[80px] text-right text-foreground">
                  تصویر
                </TableHead>
                <TableHead className="text-right text-foreground">
                  نام
                </TableHead>
                <TableHead className="text-right text-foreground">
                  نامک
                </TableHead>
                <TableHead className="text-right text-foreground">
                  توضیحات
                </TableHead>
                <TableHead className="text-right text-foreground">
                  تاریخ ایجاد
                </TableHead>
                <TableHead className="text-left text-foreground">
                  عملیات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.length === 0 ? (
                <TableRow className="border-border">
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    هیچ انیمه‌ای یافت نشد
                  </TableCell>
                </TableRow>
              ) : (
                tags.map((tag) => (
                  <TableRow
                    key={tag.uuid}
                    className="border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="text-right">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={
                            tag.image?.url ||
                            "/placeholder.svg?height=40&width=40"
                          }
                          alt={tag.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {tag.name}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {tag.slug}
                    </TableCell>
                    <TableCell className="text-right max-w-[200px] truncate text-muted-foreground">
                      {tag.description}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(tag.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-reverse space-x-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/admin/tags/${tag.uuid}/edit`)
                          }
                          className="hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">ویرایش</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteUuid(tag.uuid)}
                          className="hover:bg-destructive/10 text-destructive hover:text-destructive"
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
        open={!!deleteUuid}
        onOpenChange={(open) => !open && setDeleteUuid(null)}
      >
        <AlertDialogContent dir="rtl" className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              تأیید حذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              آیا از حذف این انیمه اطمینان دارید؟ این عمل غیرقابل بازگشت است.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse space-x-reverse space-x-2">
            <AlertDialogCancel className="bg-muted hover:bg-muted/80 text-foreground border-border">
              لغو
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? "در حال حذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
