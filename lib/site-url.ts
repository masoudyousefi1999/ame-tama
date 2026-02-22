/**
 * آدرس کامل سایت را برمی‌گرداند
 * @param path مسیر نسبی (اختیاری)
 * @returns آدرس کامل سایت با مسیر داده شده
 */
export function getSiteUrl(path = ""): string {
  // حذف اسلش اضافی از ابتدای مسیر اگر وجود داشته باشد
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  // استفاده از متغیر محیطی یا مقدار پیش‌فرض برای محیط توسعه
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ame-tama.com";

  // حذف اسلش اضافی از انتهای آدرس پایه اگر وجود داشته باشد
  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  return `${normalizedBaseUrl}/${normalizedPath}`;
}
