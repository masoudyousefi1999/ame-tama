import { ICategoryType } from "./categories";
import { IProductType } from "./products";
import { customFetch } from "./utils";
import { productLimit } from "./product-limit";

// تعریف نوع تگ
export interface ITagType {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  name: string;
  slug: string;
  description: string;
  image: {
    createdAt: string;
    updatedAt: string;
    uuid: string;
    fileExtension: string;
    mediaType: number;
    fileSize: number;
    url: string;
  };
  categories: ICategoryType[];
  products: IProductType[];
}

// تعریف نوع response برای tags
export interface ITagsResponse {
  tags: ITagType[];
  totalCount: number;
}

// دریافت همه تگ‌ها
export async function getAllTags(
  page: number = 1,
  limit: number = 10,
  init?: Parameters<typeof customFetch>[1]
): Promise<ITagsResponse> {
  const res = await customFetch(`/tag?page=${page}&limit=${limit}`, {
    method: "GET",
    ...init,
  });

  const tagsData = await res.json();
  return tagsData;
}

// دریافت تگ با شناسه
export async function getTagBySlug(
  slug: string,
  page: number = 1,
  limit: number = productLimit
): Promise<{ tag: ITagType; totalCount: number } | undefined> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const res = await fetch(
      `${baseUrl}/api/tags/${slug}?${params.toString()}`,
      {
        next: { tags: [`tag-${slug}`] },
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch tag: ${res.status}`);
      return undefined;
    }

    const tagData = await res.json();
    return { tag: tagData.tag as ITagType, totalCount: tagData.totalCount };
  } catch (error) {
    console.error("Error fetching tag:", error);
    return undefined;
  }
}
