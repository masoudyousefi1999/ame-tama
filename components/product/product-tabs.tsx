"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IProductType } from "@/lib/products";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
  product: IProductType;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="mb-16" dir="rtl">
      <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
        <TabsTrigger value="description" className="font-vazirmatn">
          توضیحات
        </TabsTrigger>
        <TabsTrigger value="specifications" className="font-vazirmatn">
          مشخصات
        </TabsTrigger>
        <TabsTrigger value="reviews" className="font-vazirmatn">
          نظرات
        </TabsTrigger>
      </TabsList>

      {/* توضیحات محصول */}
      <TabsContent value="description" className="mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-6 font-vazirmatn text-gray-900 dark:text-white">
            درباره این محصول
          </h3>

          {/* کارت پس‌زمینه کم‌رنگ */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-600">
            <div
              className="prose prose-lg dark:prose-invert max-w-none font-vazirmatn leading-relaxed text-justify"
              dangerouslySetInnerHTML={{
                __html:
                  product?.detail?.description ||
                  "<p>توضیحی برای این محصول ثبت نشده است.</p>",
              }}
            />
          </div>
        </div>
      </TabsContent>

      {/* مشخصات فنی */}
      <TabsContent value="specifications" className="mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-6 font-vazirmatn text-gray-900 dark:text-white">
            مشخصات فنی
          </h3>

          {Object.keys(product?.detail?.specifications || {}).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(product?.detail?.specifications ?? {}).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-300 font-vazirmatn mb-1">
                      {key} :
                    </div>
                    <div className="text-base text-gray-900 dark:text-white font-vazirmatn">
                      {Array.isArray(value) ? value.join("، ") : String(value)}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 font-vazirmatn">
                مشخصات فنی این محصول در دسترس نیست.
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* نظرات کاربران */}
      <TabsContent value="reviews" className="mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6 font-vazirmatn">
            نظرات کاربران
          </h3>

          <div className="space-y-6">
            {
              //@ts-ignore
              product?.reviews?.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0"
                >
                  <div className="flex justify-between mb-2">
                    <h4 className="font-semibold font-vazirmatn">
                      {review.user}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
                      {review.date}
                    </span>
                  </div>

                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={cn(
                          "w-4 h-4 ml-1",
                          i < review.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300 dark:text-gray-600"
                        )}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 font-vazirmatn">
                    {review.comment}
                  </p>
                </div>
              ))
            }
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
