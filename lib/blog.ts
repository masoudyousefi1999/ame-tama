// Blog types and utilities
export interface IBlogImageType {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  fileExtension: string;
  mediaType: number;
  fileSize: number;
  url: string;
}

export interface IBlogPostType {
  slug: string;
  createdAt: string;
  updatedAt: string;
  uuid: string;
  title: string;
  content: string;
  viewCount: number;
  isPublished: boolean;
  publishedAt: string | null;
  image: IBlogImageType | null;
  topic: IBlogTopicType;
}

export interface IBlogTopicType {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  name: string;
  slug: string;
  description: string;
  image: IBlogImageType | null;
  blogs: IBlogPostType[];
}

export interface BlogTopicsResponse {
  blogTopics: IBlogTopicType[];
  totalCount: number;
}

// Legacy types for mock data (keeping for backward compatibility)
export interface ILegacyBlogPostType {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt: string;
  updatedAt: string;
  tags?: string[];
  category?: string;
  author?: string;
  readTime?: number;
}

export interface BlogPostsResponse {
  posts: ILegacyBlogPostType[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export async function getAllBlogTopics(
  page: number = 1,
  limit: number = 10
): Promise<BlogTopicsResponse> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";
    const response = await fetch(
      `${baseUrl}/api/blog-topic?page=${page}&limit=${limit}`,
      {
        next: { tags: ["blog-topics"] },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog topics:", error);
    // Return empty response on error
    return {
      blogTopics: [],
      totalCount: 0,
    };
  }
}

// Get blog topic by slug with pagination
export async function getBlogTopicBySlug(
  slug: string,
  page: number = 1,
  limit: number = 8
): Promise<{
  totalCount: number;
  blogs: IBlogPostType[];
  topic?: IBlogTopicType;
} | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response = await fetch(
      `${baseUrl}/api/blog-topic/${slug}?${params}`,
      {
        next: { tags: [`blog-topic-${slug}`] },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog topic:", error);
    return null;
  }
}

// Get blog post by topic and blog slug
export async function getBlogPostBySlugs(
  blogSlug: string
): Promise<IBlogPostType | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";
    const response = await fetch(`${baseUrl}/api/blog/${blogSlug}`, {
      next: { tags: ["blog-post"] },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

// Get latest blogs from all topics
export async function getLatestBlogs(
  limit: number = 3
): Promise<IBlogPostType[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";

    const response = await fetch(`${baseUrl}/api/blog/latest?limit=${limit}`, {
      next: { tags: ["latest-blogs"], revalidate: 60 }, // Revalidate every minute for debugging
    });

    if (!response.ok) {
      console.error(`Latest blogs API error: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching latest blogs:", error);
    return [];
  }
}

// Get popular blogs (by view count) from all topics
export async function getPopularBlogs(
  limit: number = 3
): Promise<IBlogPostType[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";

    const response = await fetch(`${baseUrl}/api/blog/popular?limit=${limit}`, {
      next: { tags: ["popular-blogs"] },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching popular blogs:", error);
    return [];
  }
}
