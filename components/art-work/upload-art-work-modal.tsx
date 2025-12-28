"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { uploadFile, MediaType, validateFile } from "@/lib/upload-utils";
import { createArtWork, CreateArtWorkDto } from "@/lib/art-work";
import { getAllTags, ITagType } from "@/lib/tags";
import { useAuth } from "@/context/auth-context";
import { useLoginModal } from "@/context/login-modal-context";
import Image from "next/image";
import {
  X,
  Upload,
  Loader2,
  CheckCircle2,
  Sparkles,
  Heart,
} from "lucide-react";

interface UploadArtWorkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UploadArtWorkModal({
  open,
  onOpenChange,
  onSuccess,
}: UploadArtWorkModalProps) {
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [tags, setTags] = useState<ITagType[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{
    uuid: string;
    url: string;
    preview: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // بارگذاری تگ‌ها هنگام باز شدن مودال
  useEffect(() => {
    if (open && tags.length === 0) {
      loadTags();
    }
  }, [open]);

  // پاک کردن فرم هنگام بسته شدن مودال
  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setSelectedTag("");
      setUploadedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open]);

  const loadTags = async () => {
    setIsLoadingTags(true);
    try {
      const response = await getAllTags(1, 100);
      setTags(response.tags || []);
    } catch (error) {
      console.error("Error loading tags:", error);
      toast({
        title: "خطا",
        description: "خطا در بارگذاری تگ‌ها",
        variant: "error",
      });
    } finally {
      setIsLoadingTags(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // اعتبارسنجی فایل
    const validation = validateFile(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    });

    if (!validation.isValid) {
      toast({
        title: "خطا",
        description: validation.error || "فایل نامعتبر است",
        variant: "error",
      });
      return;
    }

    setIsUploading(true);

    try {
      // ایجاد پیش‌نمایش
      const preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      // آپلود فایل
      const uploadedMedia = await uploadFile(file, MediaType.ART_WORK);

      setUploadedImage({
        uuid: uploadedMedia.uuid,
        url: uploadedMedia.url,
        preview,
      });

      toast({
        title: "موفقیت",
        description: "تصویر با موفقیت آپلود شد",
        className: "bg-success text-success-foreground",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "خطا",
        description:
          error instanceof Error
            ? error.message
            : "آپلود تصویر با شکست مواجه شد",
        variant: "error",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // بررسی ورود کاربر
    if (!user) {
      openLoginModal();
      return;
    }

    // اعتبارسنجی فرم
    if (!title.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً عنوان را وارد کنید",
        variant: "error",
      });
      return;
    }

    if (!uploadedImage) {
      toast({
        title: "خطا",
        description: "لطفاً تصویر را آپلود کنید",
        variant: "error",
      });
      return;
    }

    if (!selectedTag) {
      toast({
        title: "خطا",
        description: "لطفاً تگ را انتخاب کنید",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const dto: CreateArtWorkDto = {
        title: title.trim(),
        description: description.trim() || undefined,
        image: uploadedImage.uuid,
        tag: selectedTag,
      };

      const result = await createArtWork(dto);

      if (result.success) {
        onOpenChange(false);
        setShowSuccessModal(true);
        onSuccess?.();
      } else {
        toast({
          title: "خطا",
          description: result.message,
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error creating art work:", error);
      toast({
        title: "خطا",
        description: "خطا در ایجاد اثر هنری",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="fixed inset-0 z-50 flex flex-col w-full h-full max-w-none max-h-none translate-x-0 translate-y-0 rounded-none border-none p-0 bg-background overflow-hidden data-[state=open]:slide-in-from-top-0 data-[state=closed]:slide-out-to-top-0 sm:left-1/2 sm:top-1/2 sm:inset-auto sm:grid sm:max-w-2xl sm:h-auto sm:max-h-[90vh] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border sm:p-6 sm:bg-card sm:gap-4 sm:data-[state=open]:slide-in-from-top-[48%] sm:data-[state=closed]:slide-out-to-top-[48%]">
          <DialogHeader className="flex-shrink-0 pt-10 pb-3 px-4 text-right border-b border-border sm:pt-0 sm:px-0 sm:pb-4 sm:border-none relative">
            <DialogTitle className="text-lg font-bold pr-8 sm:text-xl sm:pr-0">
              آپلود اثر هنری
            </DialogTitle>
            <DialogDescription className="text-xs mt-1 pr-8 sm:text-sm sm:pr-0">
              اثر هنری خود را با دیگران به اشتراک بگذارید
            </DialogDescription>
          </DialogHeader>

          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <form
              id="artwork-form"
              onSubmit={handleSubmit}
              className="p-4 space-y-4 sm:p-0 sm:pt-6 sm:space-y-6 pb-20 sm:pb-6"
            >
              {/* عنوان */}
              <div className="space-y-1.5 text-right sm:space-y-2">
                <Label
                  htmlFor="title"
                  className="text-xs font-semibold sm:text-sm"
                >
                  عنوان <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عنوان اثر هنری خود را وارد کنید"
                  required
                  className="bg-muted/30 text-right"
                  dir="rtl"
                />
              </div>

              {/* توضیحات */}
              <div className="space-y-1.5 text-right sm:space-y-2">
                <Label
                  htmlFor="description"
                  className="text-xs font-semibold sm:text-sm"
                >
                  توضیحات (اختیاری)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="توضیحات اثر هنری خود را وارد کنید"
                  rows={3}
                  className="bg-muted/30 resize-none text-right text-sm sm:rows-4"
                  dir="rtl"
                />
              </div>

              {/* انتخاب تگ */}
              <div className="space-y-1.5 text-right sm:space-y-2">
                <Label
                  htmlFor="tag"
                  className="text-xs font-semibold sm:text-sm"
                >
                  تگ <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedTag}
                  onValueChange={setSelectedTag}
                  disabled={isLoadingTags}
                >
                  <SelectTrigger
                    id="tag"
                    className="bg-muted/30 text-right"
                    dir="rtl"
                  >
                    <SelectValue placeholder="تگ را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    {isLoadingTags ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : tags.length > 0 ? (
                      tags.map((tag) => (
                        <SelectItem key={tag.uuid} value={tag.uuid}>
                          {tag.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        تگی یافت نشد
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* آپلود تصویر */}
              <div className="space-y-1.5 text-right sm:space-y-2">
                <Label className="text-xs font-semibold sm:text-sm">
                  تصویر <span className="text-destructive">*</span>
                </Label>
                {uploadedImage ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border group">
                    <Image
                      src={uploadedImage.preview}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        حذف و تغییر تصویر
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 z-10 sm:hidden"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="relative w-full aspect-video border-2 border-dashed border-border rounded-xl flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all p-4 bg-muted/10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="relative">
                          <Loader2 className="h-10 w-10 animate-spin text-primary" />
                          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                        </div>
                        <p className="text-xs font-medium text-primary sm:text-sm">
                          در حال آپلود و بهینه‌سازی...
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center px-3 sm:gap-3 sm:px-4">
                        <div className="p-3 rounded-full bg-primary/10 sm:p-4">
                          <Upload className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
                        </div>
                        <div className="space-y-0.5 sm:space-y-1">
                          <p className="text-xs font-bold text-foreground sm:text-sm">
                            برای آپلود تصویر کلیک کنید
                          </p>
                          <p className="text-[10px] text-muted-foreground sm:text-xs">
                            فرمت‌های JPG, PNG, WEBP (حداکثر ۱۰ مگابایت)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 p-3 border-t border-border bg-background sm:bg-transparent sm:border-none sm:pt-2 sm:px-0 sm:p-4 flex flex-col sm:flex-row-reverse gap-2 sm:gap-3 sm:justify-start">
            <Button
              form="artwork-form"
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full sm:w-auto h-11 sm:h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg font-bold text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال ارسال...
                </>
              ) : (
                "انتشار اثر هنری"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-11 sm:h-10 text-sm sm:text-base"
            >
              انصراف
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* مودال موفقیت */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-lg overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          <DialogHeader className="text-center relative z-10">
            {/* Animated Success Icon */}
            <div className="mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-ping" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 shadow-lg ring-4 ring-primary/10">
                <CheckCircle2 className="h-12 w-12 text-primary animate-in zoom-in-95 duration-500" />
              </div>
              {/* Sparkles around icon */}
              <Sparkles
                className="absolute -top-2 -right-2 h-6 w-6 text-primary animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <Sparkles
                className="absolute -bottom-2 -left-2 h-5 w-5 text-accent animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
              <Heart
                className="absolute top-0 -left-4 h-4 w-4 text-pink-500 animate-pulse"
                style={{ animationDelay: "0.6s" }}
              />
            </div>

            <DialogTitle className="text-2xl font-bold text-foreground mb-2 animate-in fade-in-0 slide-in-from-top-2 duration-500">
              {user && user.firstName
                ? `متشکریم ${user.firstName} عزیز! 🎨`
                : "متشکریم! 🎨"}
            </DialogTitle>
            <DialogDescription
              className="text-base text-muted-foreground mb-1 animate-in fade-in-0 slide-in-from-top-2 duration-500"
              style={{ animationDelay: "0.1s" }}
            >
              اثر هنری شما با موفقیت آپلود شد
            </DialogDescription>
            <p
              className="text-sm text-muted-foreground/80 animate-in fade-in-0 slide-in-from-top-2 duration-500"
              style={{ animationDelay: "0.2s" }}
            >
              پس از تایید ادمین، اثر هنری شما در سایت نمایش داده خواهد شد
            </p>
          </DialogHeader>

          {/* Thank you message */}
          <div
            className="mt-6 mb-4 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20">
              <Sparkles
                className="h-4 w-4 text-primary animate-spin"
                style={{ animationDuration: "3s" }}
              />
              <span className="text-sm font-medium text-foreground">
                {user && user.firstName
                  ? `${user.firstName} عزیز از مشارکت شما در جامعه هنری متشکریم`
                  : "از مشارکت شما در جامعه هنری متشکریم"}
              </span>
              <Heart className="h-4 w-4 text-pink-500 animate-pulse" />
            </div>
          </div>

          <div
            className="mt-6 flex justify-center animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                // پاک کردن فرم
                setTitle("");
                setDescription("");
                setSelectedTag("");
                setUploadedImage(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="min-w-[140px] bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-100"
            >
              <CheckCircle2 className="ml-2 h-4 w-4" />
              متوجه شدم
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
