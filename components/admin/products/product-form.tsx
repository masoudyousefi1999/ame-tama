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
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, ImageIcon, Plus } from "lucide-react";
import { CustomImage as Image } from "@/components/ui/custom-image";
import { formatPrice } from "@/lib/format-price";

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
  categoryUuid?: string;
  detail: {
    series: string;
    character: string;
    description: string;
    specifications: string;
  };
  productMedia?: ProductMedia[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  uuid: string;
  description?: string;
  children?: Category[];
  image?: string;
}

interface ProductFormProps {
  product?: Product;
  categories?: Category[];
}

interface UploadedImage {
  uuid: string;
  preview: string;
  file: File;
  url: string;
  isDefault: boolean;
}

export function ProductForm({ product, categories = [] }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [existingImages, setExistingImages] = useState<ProductMedia[]>(
    product?.productMedia || []
  );

  // Parse specifications from string/array/object to array of key-value pairs
  const parseSpecifications = (
    specs: string | any[] | Record<string, any>
  ): { key: string; value: string }[] => {
    try {
      // If already an array, return it
      if (Array.isArray(specs)) {
        return specs.length > 0 ? specs : [{ key: "", value: "" }];
      }

      // If object (key-value pairs), convert to array
      if (
        typeof specs === "object" &&
        specs !== null &&
        !Array.isArray(specs)
      ) {
        const entries = Object.entries(specs).map(([key, value]) => ({
          key,
          value: String(value),
        }));

        return entries.length > 0 ? entries : [{ key: "", value: "" }];
      }

      // If string, try to parse it
      if (typeof specs === "string" && specs) {
        const parsed = JSON.parse(specs);

        // If parsed result is an array
        if (Array.isArray(parsed)) {
          return parsed.length > 0 ? parsed : [{ key: "", value: "" }];
        }

        // If parsed result is an object, convert to array
        if (typeof parsed === "object" && parsed !== null) {
          const entries = Object.entries(parsed).map(([key, value]) => ({
            key,
            value: String(value),
          }));
          return entries.length > 0 ? entries : [{ key: "", value: "" }];
        }
      }

      // Default: return one empty field
      return [{ key: "", value: "" }];
    } catch (error) {
      console.error("Error parsing specifications:", error);
      return [{ key: "", value: "" }];
    }
  };

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

  const initialSpecs = parseSpecifications(
    product?.detail?.specifications || ""
  );

  const [specifications, setSpecifications] =
    useState<{ key: string; value: string }[]>(initialSpecs);

  // Helper function to get category UUID from ID
  const getCategoryUuidById = (categoryId: string): string => {
    const category = categories.find((cat) => String(cat.id) === categoryId);
    return category?.uuid || "";
  };

  // Add new specification field
  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  // Remove specification field
  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  // Update specification field
  const updateSpecification = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files using utility
    const { validateFile } = await import("@/lib/upload-utils");
    for (const file of files) {
      const validation = validateFile(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ],
      });

      if (!validation.isValid) {
        toast({
          title: "خطا",
          description: validation.error || "فایل نامعتبر است",
          variant: "error",
        });
        return;
      }
    }

    setIsUploading(true);

    try {
      const { uploadFile } = await import("@/lib/upload-utils");

      const uploadPromises = files.map(async (file) => {
        // Create preview
        const preview = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        // Upload to server using utility
        const uploadedMedia = await uploadFile(file);

        return {
          uuid: uploadedMedia.uuid,
          preview,
          file,
          url: uploadedMedia.url,
          isDefault: false,
        };
      });

      const results = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...results]);

      toast({
        title: "موفقیت",
        description: `${files.length} تصویر با موفقیت آپلود شد`,
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "خطا",
        description:
          error instanceof Error
            ? error.message
            : "آپلود تصاویر با شکست مواجه شد",
        variant: "error",
        className: "bg-red-600 text-white",
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

  const toggleDefaultImage = (type: "uploaded" | "existing", index: number) => {
    if (type === "uploaded") {
      setUploadedImages((prev) =>
        prev.map((img, i) => ({
          ...img,
          isDefault: i === index,
        }))
      );
    } else {
      setExistingImages((prev) => {
        const newImages = [...prev];
        const [selected] = newImages.splice(index, 1);
        return [selected, ...newImages];
      });
    }
  };

  const setAsDefault = toggleDefaultImage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalImages = uploadedImages.length + existingImages.length;
    if (!product && totalImages === 0) {
      toast({
        title: "خطا",
        description: "لطفاً حداقل یک تصویر برای محصول انتخاب کنید",
        variant: "error",
      });
      return;
    }

    if (!formData.categoryId) {
      toast({
        title: "خطا",
        description: "لطفاً دسته‌بندی را انتخاب کنید",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get category UUID from selected category ID
      const categoryUuid = getCategoryUuidById(formData.categoryId);

      if (!categoryUuid) {
        throw new Error("دسته‌بندی معتبر نیست");
      }

      // Filter and prepare specifications array (send as array, not string)
      const specificationsArray = specifications.filter(
        (spec) => spec.key.trim() !== "" && spec.value.trim() !== ""
      );

      const specificationsString = JSON.stringify(specificationsArray);

      let payload: any;

      if (product) {
        // For update: only send changed fields
        payload = {};

        // Check each field for changes
        if (formData.name !== product.name) {
          payload.name = formData.name;
        }
        if (formData.slug !== product.slug) {
          payload.slug = formData.slug;
        }
        if (formData.price !== product.price) {
          payload.price = formData.price;
        }
        if (formData.quantity !== product.quantity) {
          payload.quantity = formData.quantity;
        }
        if (formData.rating !== product.rating) {
          payload.rating = formData.rating;
        }

        // Check if category changed
        const currentCategoryUuid =
          product.categoryUuid || getCategoryUuidById(product.categoryId);
        if (categoryUuid !== currentCategoryUuid) {
          payload.category = categoryUuid;
        }

        // Check productDetail fields for changes
        let hasDetailChanges = false;
        const detailChanges: any = {};

        if (formData.detail.series !== product.detail?.series) {
          detailChanges.series = formData.detail.series;
          hasDetailChanges = true;
        }
        if (formData.detail.character !== product.detail?.character) {
          detailChanges.character = formData.detail.character;
          hasDetailChanges = true;
        }
        if (formData.detail.description !== product.detail?.description) {
          detailChanges.description = formData.detail.description;
          hasDetailChanges = true;
        }
        if (specificationsString !== product.detail?.specifications) {
          // Send as array, not string
          detailChanges.specifications = specificationsArray;
          hasDetailChanges = true;
        }

        // If any detail changed, send ALL detail fields (API requirement)
        if (hasDetailChanges) {
          payload.productDetail = {
            series:
              detailChanges.series !== undefined
                ? detailChanges.series
                : formData.detail.series,
            character:
              detailChanges.character !== undefined
                ? detailChanges.character
                : formData.detail.character,
            description:
              detailChanges.description !== undefined
                ? detailChanges.description
                : formData.detail.description,
            specifications:
              detailChanges.specifications !== undefined
                ? detailChanges.specifications
                : specificationsArray,
          };
        }

        // If no changes, show message and return
        if (Object.keys(payload).length === 0) {
          toast({
            title: "اطلاعات",
            description: "هیچ تغییری برای ذخیره وجود ندارد",
            className: "bg-blue-600 text-white",
          });
          setIsLoading(false);
          return;
        }
      } else {
        // For create: send all fields with specifications as array
        payload = {
          name: formData.name,
          slug: formData.slug,
          price: formData.price,
          quantity: formData.quantity,
          rating: formData.rating,
          category: categoryUuid,
          productDetail: {
            series: formData.detail.series,
            character: formData.detail.character,
            description: formData.detail.description,
            specifications: specificationsArray,
          },
        };
      }

      let response;

      if (product) {
        // Update existing product
        const { customFetch } = await import("@/lib/utils");
        response = await customFetch(`/product/${product.uuid}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new product
        const { customFetch } = await import("@/lib/utils");
        response = await customFetch("/product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save product");
      }

      const savedProduct = await response.json();
      const productUuid = product?.uuid || savedProduct.uuid;

      // If there are uploaded images, attach them to the product
      if (uploadedImages.length > 0 && productUuid) {
        const { attachMediaToProduct } = await import("@/lib/upload-utils");

        try {
          // Attach each uploaded image to the product
          for (let i = 0; i < uploadedImages.length; i++) {
            const image = uploadedImages[i];
            await attachMediaToProduct(
              productUuid,
              image.uuid,
              i,
              image.isDefault
            );
          }
        } catch (attachError) {
          console.error("Error attaching media:", attachError);
          toast({
            title: "هشدار",
            description: "محصول ذخیره شد اما برخی تصاویر اضافه نشدند",
            className: "bg-yellow-600 text-white",
          });
        }
      }

      toast({
        title: "موفقیت",
        description: `محصول با موفقیت ${product ? "به‌روزرسانی" : "ایجاد"} شد`,
        className: "bg-green-600 text-white",
      });

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.log("Error:", error);
      console.error("Error saving product:", error);
      toast({
        title: "خطا",
        description:
          error instanceof Error
            ? error.message
            : `${product ? "به‌روزرسانی" : "ایجاد"} محصول با شکست مواجه شد`,
        variant: "error",
        className: "bg-red-600 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || isUploading;

  return (
    <div dir="rtl">
      <Card className="max-w-4xl bg-gray-800/80 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-lg font-semibold text-white">
            {product ? "ویرایش محصول" : "ایجاد محصول"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-300"
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
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                  placeholder="نام محصول را وارد کنید"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="slug"
                  className="text-sm font-medium text-gray-300"
                >
                  اسلاگ محصول
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                  placeholder="product-slug"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-sm font-medium text-gray-300"
                >
                  قیمت (ریال)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  required
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                  placeholder="0"
                />
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    معادل:
                  </span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {formatPrice(formData.price)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="quantity"
                  className="text-sm font-medium text-gray-300"
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
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="rating"
                  className="text-sm font-medium text-gray-300"
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
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                  placeholder="4.5"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="categoryId"
                  className="text-sm font-medium text-gray-300"
                >
                  دسته‌بندی
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500">
                    <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-h-[300px] overflow-y-auto">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                          className="dark:text-gray-300"
                        >
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem
                        value="0"
                        disabled
                        className="dark:text-gray-500"
                      >
                        دسته‌بندی موجود نیست
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="series"
                  className="text-sm font-medium text-gray-300"
                >
                  اسم انیمه
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
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                  placeholder="اسم انیمه"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="character"
                  className="text-sm font-medium text-gray-300"
                >
                  شخصیت
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
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                  placeholder="شخصیت"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-300"
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
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                placeholder="توضیحات محصول را وارد کنید"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-300">
                مشخصات فنی
              </Label>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="کلید (مثال: ارتفاع)"
                        value={spec.key}
                        onChange={(e) =>
                          updateSpecification(index, "key", e.target.value)
                        }
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="مقدار (مثال: ۲۵ سانتی‌متر)"
                        value={spec.value}
                        onChange={(e) =>
                          updateSpecification(index, "value", e.target.value)
                        }
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                      />
                    </div>
                    {specifications.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                        className="hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 mt-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSpecification}
                className="w-full border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <Plus className="h-4 w-4 ml-2" />
                افزودن مشخصه جدید
              </Button>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-300">
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
                            src={
                              image.preview || image.url || "/placeholder.svg"
                            }
                            alt={`تصویر جدید ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {image.isDefault && (
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              اصلی
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2 p-2">
                          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">
                            <input
                              type="checkbox"
                              checked={image.isDefault}
                              onChange={() =>
                                toggleDefaultImage("uploaded", index)
                              }
                              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                            />
                            <span className="text-xs text-gray-900 dark:text-gray-100">
                              پیش‌فرض
                            </span>
                          </div>
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
