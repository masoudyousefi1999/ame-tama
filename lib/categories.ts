// تعریف نوع دسته‌بندی
export interface Category {
  id: string
  slug: string
  name: string
  description: string
  image: string
  filterTitle?: string
  filters?: {
    id: string
    name: string
  }[]
}

// داده‌های دسته‌بندی‌ها
const categories: Category[] = [
  {
    id: "one-piece",
    slug: "one-piece",
    name: "وان پیس",
    description: "مجسمه‌های لوکس از دنیای وان پیس، شامل شخصیت‌های محبوب مانند لوفی، زورو، سانجی و دیگران",
    image: "/placeholder.svg?height=600&width=1200",
    filterTitle: "شخصیت‌ها",
    filters: [
      { id: "luffy", name: "لوفی" },
      { id: "zoro", name: "زورو" },
      { id: "sanji", name: "سانجی" },
      { id: "nami", name: "نامی" },
      { id: "chopper", name: "چاپر" },
    ],
  },
  {
    id: "naruto",
    slug: "naruto",
    name: "ناروتو",
    description: "مجسمه‌های با کیفیت از دنیای ناروتو، شامل شخصیت‌های محبوب مانند ناروتو، ساسوکه، کاکاشی و دیگران",
    image: "/placeholder.svg?height=600&width=1200",
    filterTitle: "شخصیت‌ها",
    filters: [
      { id: "naruto", name: "ناروتو" },
      { id: "sasuke", name: "ساسوکه" },
      { id: "kakashi", name: "کاکاشی" },
      { id: "sakura", name: "ساکورا" },
      { id: "itachi", name: "ایتاچی" },
    ],
  },
  {
    id: "demon-slayer",
    slug: "demon-slayer",
    name: "شیطان کش",
    description: "مجسمه‌های فوق‌العاده از انیمه محبوب شیطان کش، شامل تانجیرو، نزوکو، زنیتسو و دیگر شخصیت‌ها",
    image: "/placeholder.svg?height=600&width=1200",
    filterTitle: "شخصیت‌ها",
    filters: [
      { id: "tanjiro", name: "تانجیرو" },
      { id: "nezuko", name: "نزوکو" },
      { id: "zenitsu", name: "زنیتسو" },
      { id: "inosuke", name: "اینوسوکه" },
      { id: "rengoku", name: "رنگوکو" },
    ],
  },
  {
    id: "jujutsu-kaisen",
    slug: "jujutsu-kaisen",
    name: "جوجوتسو کایزن",
    description: "مجسمه‌های با جزئیات دقیق از انیمه جوجوتسو کایزن، شامل گوجو، یوجی، مگومی و دیگر شخصیت‌ها",
    image: "/placeholder.svg?height=600&width=1200",
    filterTitle: "شخصیت‌ها",
    filters: [
      { id: "gojo", name: "گوجو" },
      { id: "yuji", name: "یوجی" },
      { id: "megumi", name: "مگومی" },
      { id: "nobara", name: "نوبارا" },
      { id: "sukuna", name: "سوکونا" },
    ],
  },
  {
    id: "attack-on-titan",
    slug: "attack-on-titan",
    name: "حمله به تایتان",
    description: "مجسمه‌های حیرت‌انگیز از دنیای حمله به تایتان، شامل ارن، میکاسا، لیوای و دیگر شخصیت‌ها",
    image: "/placeholder.svg?height=600&width=1200",
    filterTitle: "شخصیت‌ها",
    filters: [
      { id: "eren", name: "ارن" },
      { id: "mikasa", name: "میکاسا" },
      { id: "levi", name: "لیوای" },
      { id: "armin", name: "آرمین" },
      { id: "titan", name: "تایتان‌ها" },
    ],
  },
  {
    id: "my-hero-academia",
    slug: "my-hero-academia",
    name: "آکادمی قهرمان من",
    description: "مجسمه‌های قهرمانانه از انیمه آکادمی قهرمان من، شامل دکو، آل مایت، باکوگو و دیگر شخصیت‌ها",
    image: "/placeholder.svg?height=600&width=1200",
    filterTitle: "شخصیت‌ها",
    filters: [
      { id: "deku", name: "دکو" },
      { id: "all-might", name: "آل مایت" },
      { id: "bakugo", name: "باکوگو" },
      { id: "todoroki", name: "تودوروکی" },
      { id: "uraraka", name: "اوراراکا" },
    ],
  },
]

// دریافت همه دسته‌بندی‌ها
export function getAllCategories(): Category[] {
  return categories
}

// دریافت دسته‌بندی با شناسه
export function getCategoryById(id: string): Category | undefined {
  return categories.find((category) => category.id === id)
}

// دریافت دسته‌بندی با اسلاگ
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug)
}
