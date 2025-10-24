import { ITagType } from "./tags";
import { customFetch } from "./utils";


// تعریف نوع دسته‌بندی با پشتیبانی از تگ‌ها
export interface ICategoryType {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  tags: ITagType[];
}

// دریافت همه دسته‌بندی‌ها
export async function getAllCategories(
  init?: Parameters<typeof customFetch>[1]
): Promise<ICategoryType[]> {
  const res = await customFetch(`/category`, {
    method: "GET",
    ...init,
  });

  const categories = await res.json();
  return categories;
}

// دریافت دسته‌بندی با شناسه
export function getCategoryById(id: string): ICategoryType | undefined {
  return;
}

// دریافت دسته‌بندی با اسلاگ
export async function getCategoryBySlug(
  slug: string
): Promise<ICategoryType | undefined> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_CLIENT}/category/${slug}`
  );

  const categories = await res.json();
  return categories;
}

// دریافت دسته‌بندی‌های اصلی (آنهایی که children دارند یا سطح بالا هستند)
export function getRootCategories(): ICategoryType[] {
  return [];
}

// دریافت مسیر کامل دسته‌بندی (از ریشه تا دسته‌بندی فعلی)
export function getCategoryPath(categoryUuid: string): ICategoryType[] {
  // این function باید از API استفاده کند
  return [];
}

// بررسی اینکه آیا یک تگ زیرمجموعه دسته‌بندی است
export function isTagInCategory(
  tagUuid: string,
  categoryUuid: string
): boolean {
  // این function باید از API استفاده کند
  return false;
}

// دریافت دسته‌بندی با UUID
export function getCategoryByUuid(uuid: string): ICategoryType | undefined {
  // این function باید از API استفاده کند
  return undefined;
}
