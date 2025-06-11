// تعریف نوع دسته‌بندی با پشتیبانی از ساختار سلسله مراتبی
export interface ICategoryType {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  children: ICategoryType[];
}

// دریافت همه دسته‌بندی‌ها
export async function getAllCategories(): Promise<ICategoryType[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/category`
  );

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
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/category/${slug}`
  );

  const categories = await res.json();
  return categories;
}

// دریافت دسته‌بندی‌های اصلی (آنهایی که children دارند یا سطح بالا هستند)
export function getRootCategories(): ICategoryType[] {
  return [];
}

// دریافت زیر دسته‌های یک دسته‌بندی
export function getSubcategories(parentUuid: string): ICategoryType[] {
  const findSubcategories = (cats: ICategoryType[]): ICategoryType[] => {
    for (const cat of cats) {
      if (cat.uuid === parentUuid) {
        return cat.children;
      }
      const found = findSubcategories(cat.children);
      if (found.length > 0) return found;
    }
    return [];
  };
  return [];
}

// دریافت مسیر کامل دسته‌بندی (از ریشه تا دسته‌بندی فعلی)
export function getCategoryPath(categoryUuid: string): ICategoryType[] {
  const path: ICategoryType[] = [];

  const findPath = (
    cats: ICategoryType[],
    targetUuid: string,
    currentPath: ICategoryType[]
  ): boolean => {
    for (const cat of cats) {
      const newPath = [...currentPath, cat];
      if (cat.uuid === targetUuid) {
        path.push(...newPath);
        return true;
      }
      if (findPath(cat.children, targetUuid, newPath)) {
        return true;
      }
    }
    return false;
  };

  return path;
}

// بررسی اینکه آیا یک دسته‌بندی زیرمجموعه دسته‌بندی دیگری است
export function isChildCategory(
  childUuid: string,
  parentUuid: string
): boolean {
  const findInChildren = (cats: ICategoryType[], targetUuid: string): boolean => {
    for (const cat of cats) {
      if (cat.uuid === targetUuid) return true;
      if (findInChildren(cat.children, targetUuid)) return true;
    }
    return false;
  };

  const parent = getCategoryByUuid(parentUuid);
  if (!parent) return false;

  return findInChildren(parent.children, childUuid);
}

// دریافت دسته‌بندی با UUID
export function getCategoryByUuid(uuid: string): ICategoryType | undefined {
  const findCategory = (cats: ICategoryType[]): ICategoryType | undefined => {
    for (const cat of cats) {
      if (cat.uuid === uuid) return cat;
      const found = findCategory(cat.children);
      if (found) return found;
    }
    return undefined;
  };
  return;
}
