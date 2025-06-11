import { ProductForm } from "@/components/admin/products/product-form"

export default function NewProductPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-vazirmatn">
          ایجاد محصول جدید
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-vazirmatn">محصول جدید به کاتالوگ اضافه کنید</p>
      </div>

      <ProductForm />
    </div>
  )
}
