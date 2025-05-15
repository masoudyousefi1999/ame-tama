/**
 * تشخیص می‌دهد که آیا متن داده شده به زبان فارسی است یا خیر
 * @param text متن برای بررسی
 * @returns true اگر متن فارسی باشد، در غیر این صورت false
 */
export function isPersianText(text: string): boolean {
  // محدوده کاراکترهای فارسی در یونیکد
  const persianPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
  return persianPattern.test(text)
}

/**
 * تعیین جهت متن بر اساس محتوای آن
 * @param text متن برای بررسی
 * @returns "rtl" اگر متن فارسی باشد، در غیر این صورت "ltr"
 */
export function getTextDirection(text: string): "rtl" | "ltr" {
  return isPersianText(text) ? "rtl" : "ltr"
}

/**
 * کلاس‌های CSS مناسب برای جهت متن را برمی‌گرداند
 * @param text متن برای بررسی
 * @returns کلاس‌های CSS مناسب برای جهت متن
 */
export function getDirectionClasses(text: string): string {
  const direction = getTextDirection(text)
  return direction === "rtl" ? "text-right font-vazirmatn" : "text-left"
}
