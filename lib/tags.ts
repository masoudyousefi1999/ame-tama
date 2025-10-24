import { ICategoryType } from "./categories";
import { IProductType } from "./products";
import { customFetch } from "./utils";

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
  slug: string
): Promise<ITagType | undefined> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_CLIENT}/tag/${slug}`
  );

  const tagData = await res.json();
  return tagData;
}
