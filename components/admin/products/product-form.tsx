"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ProductMedia {
  mediaId: string;
  order: number;
  isDefault: boolean;
  url?: string;
}

interface Product {
  uuid?: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  rating: number;
  categoryId: string;
  detail: {
    series: string;
    character: string;
    description: string;
    specifications: string;
  };
  productMedia?: ProductMedia[];
}

interface ProductFormProps {
  product?: Product;
}

interface UploadedImage {
  uuid: string;
  preview: string;
  file: File;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [existingImages, setExistingImages] = useState<ProductMedia[]>(
    product?.productMedia || []
  );

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    price: product?.price || 0,
    quantity: product?.quantity || 0,
    rating: product?.rating || 0,
    categoryId: product?.categoryId || "",
    detail: {
      series: product?.detail?.series || "",
      character: product?.detail?.character || "",
      description: product?.detail?.description || "",
      specifications: product?.detail?.specifications || "",
    },
  });

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "خطا",
          description: "لطفاً فقط فایل‌های تصویری انتخاب کنید",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "خطا",
          description: "حجم هر فایل نباید بیشتر از ۵ مگابایت باشد",
          variant: "destructive",
        });
        return;
      }
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        // Create preview
        const preview = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        // Upload to server
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const { uuid } = await response.json();
        return { uuid, preview, file };
      });

      const results = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...results]);

      toast({
        title: "موفقیت",
        description: `${files.length} تصویر با موفقیت آپلود شد`,
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "آپلود تصاویر با شکست مواجه شد",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setAsDefault = (type: "uploaded" | "existing", index: number) => {
    if (type === "uploaded") {
      // Move selected image to first position
      setUploadedImages((prev) => {
        const newImages = [...prev];
        const [selected] = newImages.splice(index, 1);
        return [selected, ...newImages];
      });
    } else {
      // Move selected existing image to first position
      setExistingImages((prev) => {
        const newImages = [...prev];
        const [selected] = newImages.splice(index, 1);
        return [selected, ...newImages];
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalImages = uploadedImages.length + existingImages.length;
    if (!product && totalImages === 0) {
      toast({
        title: "خطا",
        description: "لطفاً حداقل یک تصویر برای محصول انتخاب کنید",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const url = product ? `/api/products/${product.uuid}` : "/api/products";
      const method = product ? "PATCH" : "POST";

      // Combine existing and new images
      const allMediaUuids = [
        ...existingImages.map((img) => img.mediaId),
        ...uploadedImages.map((img) => img.uuid),
      ];

      const productMedia = allMediaUuids.map((uuid, index) => ({
        mediaId: uuid,
        order: index,
        isDefault: index === 0,
      }));

      const payload = {
        ...formData,
        productMedia,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      toast({
        title: "موفقیت",
        description: `محصول با موفقیت ${product ? "به‌روزرسانی" : "ایجاد"} شد`,
        className: "bg-green-600 text-white",
      });

      router.push("/admin/products");
    } catch (error) {
      toast({
        title: "خطا",
        description: `${
          product ? "به‌روزرسانی" : "ایجاد"
        } محصول با شکست مواجه شد`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || isUploading;

  return (
    <div dir="rtl">
      <Card className="max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-gray-200 dark:border-gray-700">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {product ? "ویرایش محصول" : "ایجاد محصول"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  نام محصول
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="نام محصول را وارد کنید"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="slug"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  نامک (Slug)
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                  className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="product-slug"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  قیمت (تومان)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  required
                  className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="quantity"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  موجودی
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value),
                    })
                  }
                  required
                  className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="rating"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  امتیاز
                </Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: Number(e.target.value) })
                  }
                  className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="4.5"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="categoryId"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  دسته‌بندی
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white">
                    <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="1" className="dark:text-gray-300">
                      گوشی هوشمند
                    </SelectItem>
                    <SelectItem value="2" className="dark:text-gray-300">
                      لپ‌تاپ
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="series"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  سری
                </Label>
                <Input
                  id="series"
                  value={formData.detail.series}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detail: { ...formData.detail, series: e.target.value },
                    })
                  }
                  className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="سری محصول"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="character"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  مشخصه
                </Label>
                <Input
                  id="character"
                  value={formData.detail.character}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detail: { ...formData.detail, character: e.target.value },
                    })
                  }
                  className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="مشخصه محصول"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                توضیحات
              </Label>
              <Textarea
                id="description"
                value={formData.detail.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    detail: { ...formData.detail, description: e.target.value },
                  })
                }
                className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="توضیحات محصول را وارد کنید"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="specifications"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                مشخصات فنی
              </Label>
              <Textarea
                id="specifications"
                value={formData.detail.specifications}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    detail: {
                      ...formData.detail,
                      specifications: e.target.value,
                    },
                  })
                }
                className="border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="مشخصات فنی محصول"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                تصاویر محصول
              </Label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    تصاویر موجود:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={image.mediaId} className="relative group">
                        <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                          <Image
                            src={
                              image.url ||
                              "/placeholder.svg?height=128&width=128"
                            }
                            alt={`تصویر ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              اصلی
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          {index !== 0 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => setAsDefault("existing", index)}
                              className="text-xs"
                            >
                              اصلی
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeExistingImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    تصاویر جدید:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={image.uuid} className="relative group">
                        <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                          <Image
                            src={image.preview || "/placeholder.svg"}
                            alt={`تصویر جدید ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {existingImages.length === 0 && index === 0 && (
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              اصلی
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          {!(existingImages.length === 0 && index === 0) && (
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => setAsDefault("uploaded", index)}
                              className="text-xs"
                            >
                              اصلی
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeUploadedImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  برای انتخاب تصاویر کلیک کنید
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  حداکثر ۵ مگابایت برای هر فایل - JPG, PNG, GIF
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />

              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Upload className="h-4 w-4 animate-spin" />
                  در حال آپلود تصاویر...
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "در حال ذخیره..."
                  : product
                  ? "به‌روزرسانی محصول"
                  : "ایجاد محصول"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/products")}
                className="w-full sm:w-auto border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full"
              >
                لغو
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
