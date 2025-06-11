// تعریف نوع محصول بر اساس API جدید
export interface ProductMedia {
  order: number;
  isDefault: boolean;
  url: string;
}

export interface ProductDetail {
  series: string;
  character: string;
  description: string;
  specifications?: Record<string, any> | null;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface IProductType {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  rating: number;
  detail: ProductDetail;
  category: ProductCategory;
  productMedia: ProductMedia[];
}

export interface ProductReview {
  id: number;
  user: string;
  date: string;
  rating: number;
  comment: string;
}

export function getProductByUuid(uuid: string): IProductType | null {
  return null;
}

// دریافت محصول با آیدی مشخص (برای سازگاری با کد قدیمی)
export function getProductById(id: number): IProductType | null {
  return null; // فرض می‌کنیم ID ها از 1 شروع می‌شوند
}
export async function getProductBySlug(
  slug: string
): Promise<IProductType | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/product/${slug}`
    );

    const product = await res.json();

    if (product) {
      return product as IProductType;
    }

    return null;
  } catch (error) {
    return null;
  }
}

// export function getProductById(id: number): IProductType | null {
//   return null; // فرض می‌کنیم ID ها از 1 شروع می‌شوند
// }
export async function getProductByCategorySlug(
  slug: string
): Promise<IProductType | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/product/category/${slug}`
    );

    const product = await res.json();

    if (product) {
      return product as IProductType;
    }

    return null;
  } catch (error) {
    return null;
  }
}

// دریافت محصولات مرتبط بر اساس دسته‌بندی
export function getRelatedProducts(
  categorySlug: string,
  excludeUuid: string
): IProductType[] {
  return [];
}

// دریافت همه محصولات
// export function getAllProducts(): Product[] {
//   return products;
// }

export async function getAllProducts(): Promise<IProductType[]> {
  console.log("get products function is calling.....");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/product`
  );

  const products = await res.json();
  return products as IProductType[];
}

// دریافت محصولات بر اساس دسته‌بندی
// export async function getProductBySlug(
//   slug: string
// ): Promise<Category | undefined> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/category/${slug}`
//   );

//   const categories = await res.json();
//   return categories;
// }

// دریافت محصولات جدید (محصولات با تاریخ ایجاد اخیر)
export function getNewProducts(limit = 8): IProductType[] {
  return [];
}

// دریافت محصولات با موجودی کم
export function getLowStockProducts(limit = 8): IProductType[] {
  return [];
}

// برای سازگاری با کد قدیمی - reviews جداگانه
export const productReviews: { [productUuid: string]: ProductReview[] } = {
  "prod-58b1f289-be86-4344-8d07-3a55a01badbe": [
    {
      id: 1,
      user: "علی محمدی",
      date: "۱۴۰۲/۰۴/۱۲",
      rating: 5,
      comment:
        "کیفیت این مجسمه فوق‌العاده است! جزئیات چهره و لباس لوفی بی‌نظیر است و رنگ‌آمیزی آن عالی انجام شده. قطعاً ارزش خرید دارد.",
    },
    {
      id: 2,
      user: "مریم حسینی",
      date: "۱۴۰۲/۰۴/۰۵",
      rating: 4,
      comment:
        "مجسمه بسیار زیبایی است و طراحی آن عالی است. تنها ایراد کوچکی که داشت، بسته‌بندی آن بود که کمی آسیب دیده بود، اما خود مجسمه سالم بود.",
    },
    {
      id: 3,
      user: "رضا کریمی",
      date: "۱۴۰۲/۰۳/۲۰",
      rating: 5,
      comment:
        "به عنوان یک کلکسیونر حرفه‌ای، باید بگویم که این یکی از بهترین مجسمه‌های لوفی است که تا به حال دیده‌ام. جزئیات و کیفیت ساخت آن فوق‌العاده است.",
    },
  ],
};

export function getProductReviews(productUuid: string): ProductReview[] {
  return productReviews[productUuid] || [];
}
