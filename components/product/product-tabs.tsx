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
      {/* -------- tab bar -------- */}
      <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto mb-8">
        <TabsTrigger value="description">توضیحات</TabsTrigger>
        <TabsTrigger value="specifications">مشخصات</TabsTrigger>
        <TabsTrigger value="reviews">نظرات</TabsTrigger>
      </TabsList>

      {/* -------- توضیحات -------- */}
      <TabsContent value="description" className="mt-4">
        <div className="rounded-2xl p-6 shadow-sm bg-background">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            درباره این محصول
          </h2>

          {product?.detail?.description ? (
            <div className="rounded-xl p-5 shadow-sm border bg-muted">
              <div
                className="prose prose-lg max-w-none leading-relaxed text-justify dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: product.detail.description,
                }}
              />
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              توضیحی برای این محصول ثبت نشده است.
            </p>
          )}
        </div>
      </TabsContent>

      {/* -------- مشخصات -------- */}
      <TabsContent value="specifications" className="mt-4">
        <div className="rounded-2xl p-6 shadow-sm bg-background">
          <h3 className="mb-6 text-2xl font-bold text-foreground">
            مشخصات فنی
          </h3>

          {Object.keys(product?.detail?.specifications ?? {}).length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(product.detail!.specifications!).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl p-4 shadow-sm border bg-muted"
                  >
                    <div className="mb-1 text-sm text-muted-foreground">
                      {key} :
                    </div>
                    <div className="text-base text-foreground">
                      {Array.isArray(value) ? value.join("، ") : String(value)}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              مشخصات فنی این محصول در دسترس نیست.
            </p>
          )}
        </div>
      </TabsContent>

      {/* -------- نظرات -------- */}
      <TabsContent value="reviews" className="mt-4">
        <div className="rounded-2xl p-6 shadow-sm bg-background">
          <h3 className="mb-6 text-xl font-bold text-foreground">
            نظرات کاربران
          </h3>

          {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="pb-6 border-b last:border-0 border"
                >
                  <div className="mb-2 flex justify-between">
                    <h4 className="font-semibold">{review.user}</h4>
                    <span className="text-sm text-muted-foreground">
                      {review.date}
                    </span>
                  </div>

                  {/* rating */}
                  <div className="mb-3 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={cn(
                          "ml-1 h-4 w-4",
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        )}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              هنوز نظری برای این محصول ثبت نشده است.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
