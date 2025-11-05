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

// Mock data for development
const mockPosts: ILegacyBlogPostType[] = [
  {
    id: "1",
    title: "جدیدترین فیگورهای انیمه One Piece",
    slug: "newest-one-piece-figures",
    content: `
      <h2>معرفی جدیدترین فیگورهای One Piece</h2>
      <p>در این مقاله به بررسی جدیدترین فیگورهای انیمه One Piece می‌پردازیم که اخیراً به بازار آمده‌اند.</p>
      
      <h3>فیگور Luffy Gear 5</h3>
      <p>یکی از محبوب‌ترین فیگورهای جدید، فیگور Luffy در حالت Gear 5 است که با جزئیات فوق‌العاده طراحی شده است.</p>
      
      <h3>فیگور Zoro</h3>
      <p>فیگور Zoro با شمشیرهایش یکی از بهترین فیگورهای موجود در بازار است.</p>
      
      <h3>نتیجه‌گیری</h3>
      <p>این فیگورها با کیفیت بالا و قیمت مناسب، انتخاب مناسبی برای علاقه‌مندان به One Piece هستند.</p>
    `,
    excerpt:
      "بررسی جدیدترین فیگورهای انیمه One Piece که اخیراً به بازار آمده‌اند",
    featuredImage:
      "https://ame-tama.storage.c2.liara.space/1/6db9da74-b4f5-45c7-8c5c-7d7ef3438643.webp",
    publishedAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    tags: ["One Piece", "فیگور", "انیمه"],
    category: "محصولات",
    author: "AME-TAMA",
    readTime: 5,
  },
  {
    id: "2",
    title: "راهنمای خرید فیگورهای Demon Slayer",
    slug: "demon-slayer-figures-guide",
    content: `
      <h2>راهنمای کامل خرید فیگورهای Demon Slayer</h2>
      <p>انیمه Demon Slayer یکی از محبوب‌ترین انیمه‌های سال‌های اخیر است و فیگورهای آن نیز بسیار پرطرفدار هستند.</p>
      
      <h3>بهترین فیگورهای Tanjiro</h3>
      <p>فیگورهای Tanjiro با جزئیات بالا و کیفیت عالی در بازار موجود هستند.</p>
      
      <h3>فیگورهای Nezuko</h3>
      <p>فیگورهای Nezuko نیز بسیار زیبا و با کیفیت طراحی شده‌اند.</p>
      
      <h3>نکات مهم خرید</h3>
      <p>هنگام خرید فیگورهای Demon Slayer به کیفیت، قیمت و اصالت محصول توجه کنید.</p>
    `,
    excerpt: "راهنمای کامل برای خرید بهترین فیگورهای انیمه Demon Slayer",
    featuredImage:
      "https://ame-tama.storage.c2.liara.space/1/58ccd2ad-a7ba-49e3-b29f-42853746156a.webp",
    publishedAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    tags: ["Demon Slayer", "راهنما", "خرید"],
    category: "راهنما",
    author: "AME-TAMA",
    readTime: 7,
  },
  {
    id: "3",
    title: "اخبار جدید انیمه Naruto",
    slug: "latest-naruto-news",
    content: `
      <h2>آخرین اخبار انیمه Naruto</h2>
      <p>در این مقاله به بررسی آخرین اخبار و اطلاعات مربوط به انیمه Naruto می‌پردازیم.</p>
      
      <h3>فیلم جدید Naruto</h3>
      <p>فیلم جدید Naruto که قرار است امسال اکران شود، بسیار مورد انتظار است.</p>
      
      <h3>محصولات جدید</h3>
      <p>محصولات جدیدی از انیمه Naruto به زودی به بازار خواهد آمد.</p>
      
      <h3>نظر کارشناسان</h3>
      <p>کارشناسان انیمه نظر مثبتی نسبت به این محصولات دارند.</p>
    `,
    excerpt: "آخرین اخبار و اطلاعات مربوط به انیمه Naruto و محصولات جدید آن",
    featuredImage:
      "https://ame-tama.storage.c2.liara.space/1/0ce3b253-01a5-4ee9-b810-25a8b33cab60.webp",
    publishedAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-05T09:15:00Z",
    tags: ["Naruto", "اخبار", "فیلم"],
    category: "اخبار",
    author: "AME-TAMA",
    readTime: 4,
  },
];

// Get all blog posts (legacy function)
export async function getAllBlogPosts(
  page: number = 1,
  limit: number = 10,
  options?: { next?: { tags: string[] } }
): Promise<BlogPostsResponse> {
  // In a real app, this would fetch from your backend API
  // For now, we'll use mock data

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = mockPosts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    totalCount: mockPosts.length,
    currentPage: page,
    totalPages: Math.ceil(mockPosts.length / limit),
  };
}

// Get blog post by slug (legacy function)
export async function getBlogPostBySlug(
  slug: string
): Promise<ILegacyBlogPostType | null> {
  // In a real app, this would fetch from your backend API
  const post = mockPosts.find((p) => p.slug === slug);
  return post || null;
}

// Get related posts (legacy function)
export async function getRelatedPosts(
  currentPostSlug: string,
  limit: number = 3
): Promise<ILegacyBlogPostType[]> {
  const currentPost = mockPosts.find((p) => p.slug === currentPostSlug);
  if (!currentPost) return [];

  // Find posts with similar tags
  const relatedPosts = mockPosts
    .filter((p) => p.slug !== currentPostSlug)
    .filter((p) => p.tags?.some((tag) => currentPost.tags?.includes(tag)))
    .slice(0, limit);

  return relatedPosts;
}

// Get all blog topics
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
