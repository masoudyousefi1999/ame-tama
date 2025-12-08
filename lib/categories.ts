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