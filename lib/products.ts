// داده‌های نمونه برای محصولات
const products = [
  {
    id: 1,
    name: "مجسمه لوفی گیر ۵",
    price: 299.99,
    originalPrice: 349.99,
    images: [
      {
        id: 1,
        url: "https://figar.ir/wp-content/uploads/2023/08/one-piec-gear-five-figure-1.jpg",
        alt: "مجسمه لوفی گیر ۵ - نمای جلو",
      },
      {
        id: 2,
        url: "https://image.torob.com/base/images/QH/7y/QH7yeUEtrjqt5a45.jpg",
        alt: "مجسمه لوفی گیر ۵ - نمای پشت",
      },
      {
        id: 3,
        url: "https://dkstatics-public.digikala.com/digikala-products/4c82e08a908d37ca2eb969599c31ca984d9c3392_1705934054.jpg?x-oss-process=image%2Fresize%2Cm_lfit%2Ch_800%2Cw_800%2Fformat%2Cwebp%2Fquality%2Cq_90",
        alt: "مجسمه لوفی گیر ۵ - نمای جانبی",
      },
      {
        id: 4,
        url: "https://image.torob.com/base/images/81/kE/81kE9hDYpOtlXhEa.jpg",
        alt: "مجسمه لوفی گیر ۵ - جزئیات",
      },
    ],
    rating: 4.8,
    reviewCount: 124,
    availability: "in-stock" as const,
    isNew: true,
    isLimited: false,
    category: "one-piece",
    series: "وان پیس",
    character: "مانکی دی. لوفی",
    manufacturer: "AME-TAMA",
    releaseDate: "۱۴۰۲/۰۳/۱۵",
    scale: "۱/۶",
    material: "PVC و ABS",
    height: "۳۰ سانتی‌متر",
    weight: "۸۰۰ گرم",
    description:
      "مجسمه لوفی گیر ۵ یکی از شاهکارهای مجموعه AME-TAMA است که با دقت فوق‌العاده و جزئیات خیره‌کننده طراحی شده است. این مجسمه لحظه تبدیل لوفی به گیر ۵ را به تصویر می‌کشد، جایی که او به قدرت‌های جدید و شگفت‌انگیز خود دست می‌یابد. هر جزء از این مجسمه، از حالت چهره گرفته تا جزئیات لباس و افکت‌های ویژه، با دقت بی‌نظیری طراحی شده است تا تجربه‌ای فوق‌العاده برای کلکسیونرها فراهم کند. این مجسمه با ارتفاع ۳۰ سانتی‌متر و مقیاس ۱/۶، حضوری چشمگیر در هر مجموعه‌ای خواهد داشت و قطعاً نگاه‌ها را به خود جلب می‌کند. ساخته شده از مواد با کیفیت PVC و ABS، این مجسمه نه تنها زیبا بلکه بادوام نیز هست و می‌تواند سال‌ها بخشی از مجموعه شما باشد.",
    specifications: {
      material: "PVC و ABS با کیفیت بالا",
      height: "۳۰ سانتی‌متر",
      weight: "۸۰۰ گرم",
      packageContents: [
        "مجسمه لوفی گیر ۵",
        "پایه نمایش طراحی شده",
        "جعبه کلکسیونی لوکس",
        "گواهی اصالت",
        "دفترچه راهنمای نگهداری",
      ],
      careInstructions: [
        "از قرار دادن مجسمه در معرض نور مستقیم خورشید خودداری کنید",
        "برای تمیز کردن از برس نرم یا دستمال میکروفیبر استفاده کنید",
        "از مواد شیمیایی قوی برای تمیز کردن استفاده نکنید",
        "در دمای اتاق و دور از رطوبت نگهداری شود",
      ],
    },
    reviews: [
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
  },
  {
    id: 2,
    name: "ناروتو حالت سیج",
    price: 249.99,
    images: [
      {
        id: 1,
        url: "https://m.media-amazon.com/images/I/71705Dlep2L._AC_SL1500_.jpg",
        alt: "ناروتو حالت سیج - نمای جلو",
      },
      {
        id: 2,
        url: "https://m.media-amazon.com/images/I/61ktqMVa7FL._AC_SL1500_.jpg",
        alt: "ناروتو حالت سیج - نمای جلو",
      },
    ],
    rating: 4.7,
    reviewCount: 98,
    availability: "in-stock" as const,
    isNew: false,
    isLimited: true,
    category: "naruto",
    series: "ناروتو",
    character: "ناروتو اوزوماکی",
    manufacturer: "AME-TAMA",
    releaseDate: "۱۴۰۲/۰۲/۱۰",
    scale: "۱/۶",
    material: "PVC",
    height: "۲۸ سانتی‌متر",
    weight: "۷۵۰ گرم",
    description: "مجسمه ناروتو در حالت سیج با جزئیات فوق‌العاده",
    specifications: {
      material: "PVC با کیفیت بالا",
      height: "۲۸ سانتی‌متر",
      weight: "۷۵۰ گرم",
      packageContents: [
        "مجسمه ناروتو حالت سیج",
        "پایه نمایش",
        "جعبه کلکسیونی",
        "گواهی اصالت",
      ],
      careInstructions: [
        "از قرار دادن مجسمه در معرض نور مستقیم خورشید خودداری کنید",
        "برای تمیز کردن از برس نرم استفاده کنید",
      ],
    },
    reviews: [
      {
        id: 1,
        user: "امیر رضایی",
        date: "۱۴۰۲/۰۳/۱۵",
        rating: 5,
        comment: "طراحی فوق‌العاده و جزئیات بی‌نظیر. کاملاً راضی هستم.",
      },
    ],
  },
  {
    id: 3,
    name: "تانجیرو کامادو نخبه",
    price: 279.99,
    images: [
      {
        id: 1,
        url: "https://m.media-amazon.com/images/I/81ezF952zIS._AC_SL1500_.jpg",
        alt: "تانجیرو کامادو نخبه - نمای جلو",
      },
      {
        id: 2,
        url: "https://m.media-amazon.com/images/I/61qh9SbVtxS._AC_SL1200_.jpg",
        alt: "تانجیرو کامادو نخبه - نمای جلو",
      },
    ],
    rating: 4.9,
    reviewCount: 112,
    availability: "low-stock" as const,
    isNew: true,
    isLimited: false,
    category: "demon-slayer",
    series: "شیطان کش",
    character: "تانجیرو کامادو",
    manufacturer: "AME-TAMA",
    releaseDate: "۱۴۰۲/۰۴/۰۵",
    scale: "۱/۷",
    material: "PVC و رزین",
    height: "۲۵ سانتی‌متر",
    weight: "۶۵۰ گرم",
    description: "مجسمه تانجیرو کامادو با طراحی نخبه و جزئیات فوق‌العاده",
    specifications: {
      material: "PVC و رزین با کیفیت بالا",
      height: "۲۵ سانتی‌متر",
      weight: "۶۵۰ گرم",
      packageContents: [
        "مجسمه تانجیرو کامادو",
        "پایه نمایش طراحی شده",
        "جعبه کلکسیونی",
        "گواهی اصالت",
      ],
      careInstructions: [
        "از قرار دادن مجسمه در معرض نور مستقیم خورشید خودداری کنید",
        "در دمای اتاق نگهداری شود",
      ],
    },
    reviews: [
      {
        id: 1,
        user: "سارا احمدی",
        date: "۱۴۰۲/۰۴/۲۰",
        rating: 5,
        comment:
          "این مجسمه فراتر از انتظارات من بود. جزئیات شمشیر و لباس تانجیرو فوق‌العاده است.",
      },
    ],
  },
  {
    id: 4,
    name: "گوجو ساتورو چشم‌بند",
    price: 329.99,
    images: [
      {
        id: 1,
        url: "https://m.media-amazon.com/images/I/61a5-FlTmcL._AC_SL1500_.jpg",
        alt: "گوجو ساتورو چشم‌بند - نمای جلو",
      },
      {
        id: 2,
        url: "https://m.media-amazon.com/images/I/61zRpW12MZL._AC_SL1500_.jpg",
        alt: "گوجو ساتورو چشم‌بند - نمای جلو",
      },
    ],
    rating: 5.0,
    reviewCount: 156,
    availability: "in-stock" as const,
    isNew: false,
    isLimited: true,
    category: "jujutsu-kaisen",
    series: "جوجوتسو کایزن",
    character: "گوجو ساتورو",
    manufacturer: "AME-TAMA",
    releaseDate: "۱۴۰۲/۰۱/۲۰",
    scale: "۱/۶",
    material: "PVC و ABS",
    height: "۳۲ سانتی‌متر",
    weight: "۸۵۰ گرم",
    description: "مجسمه گوجو ساتورو با چشم‌بند و در حالت مبارزه",
    specifications: {
      material: "PVC و ABS با کیفیت بالا",
      height: "۳۲ سانتی‌متر",
      weight: "۸۵۰ گرم",
      packageContents: [
        "مجسمه گوجو ساتورو",
        "پایه نمایش ویژه",
        "جعبه کلکسیونی لوکس",
        "گواهی اصالت",
      ],
      careInstructions: [
        "از قرار دادن مجسمه در معرض نور مستقیم خورشید خودداری کنید",
        "برای تمیز کردن از برس نرم استفاده کنید",
      ],
    },
    reviews: [
      {
        id: 1,
        user: "محمد علیزاده",
        date: "۱۴۰۲/۰۲/۱۵",
        rating: 5,
        comment:
          "بهترین مجسمه گوجو که تا به حال دیده‌ام. جزئیات چشم‌بند و موهای او فوق‌العاده است.",
      },
    ],
  },
  {
    id: 5,
    name: "ارن یگر فرم تایتان",
    price: 349.99,
    images: [
      {
        id: 1,
        url: "https://m.media-amazon.com/images/I/71gKa3QMRLL._AC_SL1500_.jpg",
        alt: "ارن یگر فرم تایتان - نمای جلو",
      },
      {
        id: 2,
        url: "https://m.media-amazon.com/images/I/51kyO8oBWDL._AC_.jpg",
        alt: "ارن یگر فرم تایتان - نمای جلو",
      },
    ],
    rating: 4.6,
    reviewCount: 87,
    availability: "out-of-stock" as const,
    isNew: false,
    isLimited: false,
    category: "attack-on-titan",
    series: "حمله به تایتان",
    character: "ارن یگر",
    manufacturer: "AME-TAMA",
    releaseDate: "۱۴۰۱/۱۱/۱۰",
    scale: "۱/۶",
    material: "PVC و رزین",
    height: "۳۵ سانتی‌متر",
    weight: "۹۵۰ گرم",
    description: "مجسمه ارن یگر در فرم تایتان با جزئیات فوق‌العاده",
    specifications: {
      material: "PVC و رزین با کیفیت بالا",
      height: "۳۵ سانتی‌متر",
      weight: "۹۵۰ گرم",
      packageContents: [
        "مجسمه ارن یگر فرم تایتان",
        "پایه نمایش طراحی شده",
        "جعبه کلکسیونی",
        "گواهی اصالت",
      ],
      careInstructions: [
        "از قرار دادن مجسمه در معرض نور مستقیم خورشید خودداری کنید",
        "در دمای اتاق نگهداری شود",
      ],
    },
    reviews: [
      {
        id: 1,
        user: "نیما رضایی",
        date: "۱۴۰۱/۱۲/۰۵",
        rating: 5,
        comment:
          "جزئیات عضلات و چهره تایتان ارن فوق‌العاده است. اندازه مجسمه هم عالی است.",
      },
    ],
  },
  {
    id: 6,
    name: "آل مایت حالت قهرمانی",
    price: 259.99,
    images: [
      {
        id: 1,
        url: "https://m.media-amazon.com/images/I/61XdhA3cHjL._AC_SL1417_.jpg",
        alt: "آل مایت حالت قهرمانی - نمای جلو",
      },
      {
        id: 2,
        url: "https://m.media-amazon.com/images/I/713CAtOQgeL._AC_SL1500_.jpg",
        alt: "آل مایت حالت قهرمانی - نمای جلو",
      },
    ],
    rating: 4.8,
    reviewCount: 103,
    availability: "in-stock" as const,
    isNew: true,
    isLimited: false,
    category: "my-hero-academia",
    series: "آکادمی قهرمان من",
    character: "آل مایت",
    manufacturer: "AME-TAMA",
    releaseDate: "۱۴۰۲/۰۳/۲۵",
    scale: "۱/۶",
    material: "PVC",
    height: "۳۳ سانتی‌متر",
    weight: "۸۲۰ گرم",
    description: "مجسمه آل مایت در حالت قهرمانی با ژست نمادین",
    specifications: {
      material: "PVC با کیفیت بالا",
      height: "۳۳ سانتی‌متر",
      weight: "۸۲۰ گرم",
      packageContents: [
        "مجسمه آل مایت",
        "پایه نمایش",
        "جعبه کلکسیونی",
        "گواهی اصالت",
      ],
      careInstructions: [
        "از قرار دادن مجسمه در معرض نور مستقیم خورشید خودداری کنید",
        "برای تمیز کردن از برس نرم استفاده کنید",
      ],
    },
    reviews: [
      {
        id: 1,
        user: "پریسا محمدی",
        date: "۱۴۰۲/۰۴/۰۱",
        rating: 5,
        comment:
          "لبخند آل مایت در این مجسمه دقیقاً مثل انیمه است! عاشق جزئیات لباس و عضلات او هستم.",
      },
    ],
  },
];

// دریافت محصول با آیدی مشخص
export function getProductById(id: number) {
  return products.find((product) => product.id === id);
}

// دریافت محصولات مرتبط بر اساس دسته‌بندی
export function getRelatedProducts(category: string, excludeId: number) {
  return products
    .filter(
      (product) => product.category === category && product.id !== excludeId
    )
    .slice(0, 4);
}

// دریافت همه محصولات
export function getAllProducts() {
  return products;
}

// دریافت محصولات بر اساس دسته‌بندی
export function getProductsByCategory(categoryId: string) {
  const products = getAllProducts();
  return products.filter((product) => product.category === categoryId);
}

// اضافه کردن لینک به ناوبار
