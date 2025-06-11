import { ProductForm } from "@/components/admin/products/product-form"

// This would fetch from your API
async function getProduct(uuid: string) {
  // Simulate API call - replace with actual API call
  return {
    uuid: "1",
    name: "آیفون ۱۵ پرو",
    slug: "iphone-15-pro",
    price: 999.99,
    quantity: 50,
    rating: 4.8,
    categoryId: "1",
    detail: {
      series: "آیفون ۱۵",
      character: "پرو",
      description: "جدیدترین آیفون اپل با امکانات پیشرفته",
      specifications: "A17 Pro chip, 128GB storage, Pro camera system",
    },
    productMedia: [
      { mediaId: "media1", order: 0, isDefault: true, url: "/placeholder.svg?height=200&width=200" },
      { mediaId: "media2", order: 1, isDefault: false, url: "/placeholder.svg?height=200&width=200" },
    ],
  }
}

export default async function EditProductPage({
  params,
}: {
  params: { uuid: string }
}) {
  const product = await getProduct(params.uuid)

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-vazirmatn">ویرایش محصول</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-vazirmatn">اطلاعات محصول را ویرایش کنید</p>
      </div>

      <ProductForm product={product} />
    </div>
  )
}
