import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-right">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent">
                AME-TAMA
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md font-vazirmatn persian-text">
              ارتقاء کلکسیونی‌های انیمه به هنر زیبا. هر مجسمه AME-TAMA شاهکاری از جزئیات، کیفیت و اشتیاق است.
            </p>
            <div className="flex gap-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20"
              >
                <Facebook className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="sr-only">فیسبوک</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20"
              >
                <Instagram className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="sr-only">اینستاگرام</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20"
              >
                <Twitter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="sr-only">توییتر</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20"
              >
                <Youtube className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="sr-only">یوتیوب</span>
              </Button>
            </div>
          </div>

          <div className="text-right">
            <h3 className="font-semibold text-lg mb-4 font-vazirmatn">فروشگاه</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
                >
                  محصولات جدید
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
                >
                  پرفروش‌ترین‌ها
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
                >
                  نسخه‌های محدود
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
                >
                  پیش‌فروش
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
                >
                  حراج
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-right">
            <h3 className="font-semibold text-lg mb-4 font-vazirmatn">پشتیبانی</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
                >
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
                >
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
                >
                  ارسال و مرجوعی
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
                >
                  راهنمای نگهداری مجسمه
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
                >
                  پیگیری سفارش
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-right">
            <h3 className="font-semibold text-lg mb-4 font-vazirmatn">عضویت در خبرنامه</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 font-vazirmatn persian-text">
              اولین نفری باشید که از محصولات جدید، پیشنهادات ویژه و رویدادهای کلکسیونری مطلع می‌شوید.
            </p>
            <div className="flex flex-row-reverse gap-x-2">
              <Input
                type="email"
                placeholder="ایمیل شما"
                className="rounded-full bg-white dark:bg-gray-800 text-right font-vazirmatn"
                dir="rtl"
              />
              <Button className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn">
                عضویت
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0 font-vazirmatn">
            © {new Date().getFullYear()} AME-TAMA. تمامی حقوق محفوظ است.
          </p>
          <div className="flex gap-x-6">
            <Link
              href="#"
              className="text-gray-500 dark:text-gray-400 text-sm hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
            >
              سیاست حفظ حریم خصوصی
            </Link>
            <Link
              href="#"
              className="text-gray-500 dark:text-gray-400 text-sm hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
            >
              شرایط استفاده از خدمات
            </Link>
            <Link
              href="#"
              className="text-gray-500 dark:text-gray-400 text-sm hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
            >
              سیاست کوکی
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
