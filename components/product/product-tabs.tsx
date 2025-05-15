"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProductTabsProps {
  product: {
    id: number
    description: string
    specifications: {
      material: string
      height: string
      weight: string
      packageContents: string[]
      careInstructions: string[]
    }
    reviews: {
      id: number
      user: string
      date: string
      rating: number
      comment: string
    }[]
  }
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
          <h3 className="text-xl font-bold mb-4 font-vazirmatn">درباره این محصول</h3>
          <div className="prose prose-lg dark:prose-invert max-w-none font-vazirmatn">
            <p>{product.description}</p>
          </div>
        </div>
      </TabsContent>

      {/* مشخصات فنی */}
      <TabsContent value="specifications" className="mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4 font-vazirmatn">مشخصات فنی</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-3 font-vazirmatn">جزئیات محصول</h4>
              <ul className="space-y-2">
                <li className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-vazirmatn">جنس:</span>
                  <span className="font-medium font-vazirmatn">{product.specifications.material}</span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-vazirmatn">ارتفاع:</span>
                  <span className="font-medium font-vazirmatn">{product.specifications.height}</span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-vazirmatn">وزن:</span>
                  <span className="font-medium font-vazirmatn">{product.specifications.weight}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 font-vazirmatn">محتویات بسته</h4>
              <ul className="space-y-2">
                {product.specifications.packageContents.map((item, index) => (
                  <li key={index} className="flex items-center py-1 font-vazirmatn">
                    <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
                    {item}
                  </li>
                ))}
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3 font-vazirmatn">دستورالعمل‌های نگهداری</h4>
              <ul className="space-y-2">
                {product.specifications.careInstructions.map((item, index) => (
                  <li key={index} className="flex items-center py-1 font-vazirmatn">
                    <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* نظرات کاربران */}
      <TabsContent value="reviews" className="mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6 font-vazirmatn">نظرات کاربران</h3>

          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0">
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold font-vazirmatn">{review.user}</h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">{review.date}</span>
                </div>

                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={cn(
                        "w-4 h-4 ml-1",
                        i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600",
                      )}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 dark:text-gray-300 font-vazirmatn">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
