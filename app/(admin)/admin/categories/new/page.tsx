import { CategoryForm } from "@/components/admin/categories/category-form";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          ایجاد دسته‌بندی جدید
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          اطلاعات دسته‌بندی جدید را وارد کنید
        </p>
      </div>

      <CategoryForm />
    </div>
  );
}
