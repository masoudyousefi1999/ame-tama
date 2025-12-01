"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { X, ImageIcon, Loader2 } from "lucide-react";
import { customFetch } from "@/lib/utils";
import { ITagType } from "@/lib/tags";

interface TagFormProps {
  tag?: ITagType;
}

export function TagForm({ tag }: TagFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUuid, setImageUuid] = useState<string>(
    tag?.image?.uuid || ""
  );
  const [imagePreview, setImagePreview] = useState<string>(
    tag?.image?.url || ""
  );

  const [formData, setFormData] = useState({
    name: tag?.name || "",
    slug: tag?.slug || "",
    description: tag?.description || "",
  });

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !tag) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF\s]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, tag]);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "خطا",
        description: "لطفاً فقط فایل‌های تصویری انتخاب کنید",
        variant: "error",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطا",
        description: "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
        variant: "error",
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await customFetch("/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error("آپلود تصویر با شکست مواجه شد");
      }

      const uploadResult = await uploadResponse.json();
      setImageUuid(uploadResult.uuid);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "خطا",
        description: "نام انیمه الزامی است",
        variant: "error",
      });
      return;
    }

    if (!formData.slug.trim()) {
      toast({
        title: "خطا",
        description: "نامک انیمه الزامی است",
        variant: "error",
      });
      return;
    }

    // For new tags, require image
    if (!tag && !imageUuid) {
      toast({
        title: "خطا",
        description: "لطفاً تصویر انیمه را انتخاب کنید",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload: {
        name: string;
        slug: string;
        description: string;
        image?: string;
      } = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
      };

      // Include image if new image uploaded, or if editing and image exists
      if (imageUuid) {
        payload.image = imageUuid;
      } else if (tag?.image?.uuid) {
        // Keep existing image if no new image uploaded
        payload.image = tag.image.uuid;
      }

      const url = tag ? `/tag/${tag.uuid}` : `/tag`;
      const method = tag ? "PATCH" : "POST";

      const response = await customFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "عملیات با شکست مواجه شد");
      }

      toast({
        title: "موفقیت",
        description: tag
          ? "انیمه با موفقیت به‌روزرسانی شد"
          : "انیمه با موفقیت ایجاد شد",
        className: "bg-success text-success-foreground",
      });

      router.push("/admin/tags");
      router.refresh();
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "خطا",
        description:
          error instanceof Error ? error.message : "عملیات با شکست مواجه شد",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setImageUuid("");
    setImagePreview("");
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  return (
    <Card className="max-w-2xl bg-card/80 border-border" dir="rtl">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          {tag ? "ویرایش انیمه" : "ایجاد انیمه جدید"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              نام انیمه *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="نام انیمه را وارد کنید"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="slug"
              className="text-sm font-medium text-foreground"
            >
              اسلاگ
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="اسلاگ"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              نامک برای URL استفاده می‌شود و باید منحصر به فرد باشد
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-foreground"
            >
              توضیحات
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="توضیحات انیمه را وارد کنید"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              تصویر انیمه {!tag && "*"}
            </Label>

            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="پیش‌نمایش تصویر"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -left-2 h-6 w-6 rounded-full p-0"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {isUploading
                      ? "در حال آپلود..."
                      : "برای انتخاب تصویر کلیک کنید"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    حداکثر ۵ مگابایت - JPG, PNG, GIF
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || isUploading || (!tag && !imageUuid)}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال پردازش...
                </span>
              ) : tag ? (
                "به‌روزرسانی انیمه"
              ) : (
                "ایجاد انیمه"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/tags")}
              className="w-full sm:w-auto border-border text-foreground hover:bg-muted"
            >
              لغو
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

