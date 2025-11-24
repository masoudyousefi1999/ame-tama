import { ITagType } from "./tags";
import { customFetch, SeoDto } from "./utils";
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
  discountPrice?: number;
  detail: ProductDetail;
  category: ProductCategory;
  productMedia: ProductMedia[];
  reviews?: any[];
  tags: ITagType[];
  seoMetadata?: SeoDto;
}

export interface ProductReview {
  id: number;
  user: string;
  date: string;
  rating: number;
  comment: string;
}

export async function getProductBySlug(
  slug: string,
  init?: Parameters<typeof customFetch>[1]
): Promise<IProductType | null> {
  try {
    // Use regular fetch to call Next.js API route (not customFetch to avoid NestJS backend)
    const baseUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";
    const res = await fetch(`${baseUrl}/api/product/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      ...init,
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${res.status}`);
    }

    const product = await res.json();

    if (product && product.error) {
      return null;
    }

    return product as IProductType;
  } catch (error) {
    return null;
  }
}

export async function getProductsByTagSlug(
  tagSlug: string,
  page: number = 1,
  limit: number = 8
): Promise<{ products: IProductType[]; totalCount: number }> {
  try {
    const res = await customFetch(
      `/tag/${tagSlug}?page=${page}&limit=${limit}`,
      { method: "GET" }
    );
    const result = await res.json();
    const { products, totalCount } = result;
    return { products: products || [], totalCount: totalCount || 0 };
  } catch (error) {
    console.error("Error fetching products by tag:", error);
    return { products: [], totalCount: 0 };
  }
}

export async function getProductByCategoryAndTagSlug(
  categorySlug: string,
  tagSlug: string,
  page: number = 1,
  limit: number = 8
): Promise<{ products: IProductType[]; totalCount: number }> {
  try {
    const res = await customFetch(
      `/category/${categorySlug}/${tagSlug}?page=${page}&limit=${limit}`,
      { method: "GET" }
    );
    const result = await res.json();
    const { products, totalCount } = result;
    return { products: products || [], totalCount: totalCount || 0 };
  } catch (error) {
    console.error("Error fetching products by category and tag:", error);
    return { products: [], totalCount: 0 };
  }
}

export async function getProductByCategorySlug(
  slug: string,
  page: number = 1,
  limit: number = 1
): Promise<{ products: IProductType[]; totalCount: number }> {
  try {
    const res = await customFetch(
      `/product/category/${slug}?page=${page}&limit=${limit}`,
      { method: "GET" }
    );
    const result = await res.json();
    const { products, totalCount } = result;
    return { products: products || [], totalCount: totalCount || 0 };
  } catch (error) {
    return { products: [], totalCount: 0 };
  }
}

// دریافت محصولات مرتبط بر اساس دسته‌بندی
export async function getRelatedProducts(
  productUuid: string,
  page: number = 1,
  limit: number = 8
): Promise<{ products: IProductType[]; totalCount: number }> {
  try {
    const res = await customFetch(
      `/product/similar/${productUuid}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        next: {
          tags: [`related-${productUuid}`],
        },
      }
    );
    const result = await res.json();
    const { products, totalCount } = result;
    return { products: products || [], totalCount: totalCount || 0 };
  } catch (error) {
    console.error("Error fetching related products:", error);
    return { products: [], totalCount: 0 };
  }
}

export async function getAllProducts(
  page: number = 1,
  limit: number = 1,
  init?: Parameters<typeof customFetch>[1]
): Promise<{ products: IProductType[]; totalCount: number }> {
  try {
    const res = await customFetch(`/product?page=${page}&limit=${limit}`, {
      method: "GET",
      ...init,
    });
    const result = await res.json();

    // Handle both array response and object response from backend
    if (Array.isArray(result)) {
      return { products: result, totalCount: result.length };
    } else {
      const { products, totalCount } = result;
      return { products: products || [], totalCount: totalCount || 0 };
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], totalCount: 0 };
  }
}
