import { TagForm } from "@/components/admin/tags/tag-form";

export default function NewTagPage() {
  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ایجاد انیمه جدید</h1>
        <p className="text-muted-foreground text-sm mt-1">
          انیمه جدید به لیست اضافه کنید
        </p>
      </div>

      <TagForm />
    </div>
  );
}


