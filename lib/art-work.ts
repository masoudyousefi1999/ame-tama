import { customFetch } from "./utils";
import { ITagType } from "./tags";

// تعریف نوع تصویر
export interface ArtWorkImage {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  fileExtension: string;
  mediaType: string;
  fileSize: number;
  url: string;
}

// تعریف نوع کاربر
export interface ArtWorkUser {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: any[];
}

// تعریف نوع Art Work
export interface IArtWorkType {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  title: string;
  description?: string;
  image: ArtWorkImage;
  user: ArtWorkUser;
  tag: ITagType;
  likeCount: number;
  dislikeCount: number;
  viewCount: number;
}

// تعریف نوع response برای art works
export interface IArtWorksResponse {
  artWorks: IArtWorkType[];
  totalCount: number;
}

// DTO برای ایجاد art work
export interface CreateArtWorkDto {
  title: string;
  description?: string;
  image: string; // UUID
  tag: string; // UUID
}

// دریافت همه art work ها
export async function getAllArtWorks(
  page: number = 1,
  limit: number = 12,
  init?: Parameters<typeof customFetch>[1]
): Promise<IArtWorksResponse> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const res = await customFetch(`/art-work?${params.toString()}`, {
      method: "GET",
      ...init,
    });

    if (!res.ok) {
      console.error(`Failed to fetch art works: ${res.status}`);
      return { artWorks: [], totalCount: 0 };
    }

    const data = await res.json();
    return {
      artWorks: data.artWorks || [],
      totalCount: data.totalCount || 0,
    };
  } catch (error) {
    console.error("Error fetching art works:", error);
    return { artWorks: [], totalCount: 0 };
  }
}

// دریافت یک art work با UUID
export async function getArtWorkByUuid(
  uuid: string,
  init?: Parameters<typeof customFetch>[1]
): Promise<IArtWorkType | null> {
  try {
    const res = await customFetch(`/art-work/${uuid}`, {
      method: "GET",
      ...init,
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      console.error(`Failed to fetch art work: ${res.status}`);
      return null;
    }

    const artWork = await res.json();
    return artWork || null;
  } catch (error) {
    console.error("Error fetching art work:", error);
    return null;
  }
}

// واکنش به art work (لایک/دیسلایک)
export async function reactToArtWork(
  uuid: string,
  reaction: 1 | -1
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await customFetch(`/art-work/${uuid}/react`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reaction }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || "خطا در ثبت واکنش",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error reacting to art work:", error);
    return {
      success: false,
      message: "خطا در ثبت واکنش",
    };
  }
}

// افزایش view count
export async function incrementViewCount(
  uuid: string
): Promise<{
  success: boolean;
  message?: string | null;
  shouldIncrement: boolean;
}> {
  try {
    const res = await customFetch(`/art-work/${uuid}/watch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || "خطا در افزایش view count",
        shouldIncrement: false,
      };
    }

    const data = await res.json().catch(() => ({}));

    // اگر message null باشد، یعنی کاربر قبلاً این اثر را دیده است
    const shouldIncrement = data.message !== null;

    return {
      success: true,
      message: data.message,
      shouldIncrement,
    };
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return {
      success: false,
      message: "خطا در افزایش view count",
      shouldIncrement: false,
    };
  }
}

// ایجاد art work جدید
export async function createArtWork(
  dto: CreateArtWorkDto
): Promise<{ success: boolean; message: string; artWork?: IArtWorkType }> {
  try {
    const res = await customFetch("/art-work", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return {
        success: false,
        message: error.message || "خطا در ایجاد اثر هنری",
      };
    }

    const artWork = await res.json();
    return {
      success: true,
      message: "اثر هنری با موفقیت ایجاد شد",
      artWork,
    };
  } catch (error) {
    console.error("Error creating art work:", error);
    return {
      success: false,
      message: "خطا در ایجاد اثر هنری",
    };
  }
}
