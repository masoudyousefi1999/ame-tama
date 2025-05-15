import Link from "next/link"
import type { Metadata } from "next"
import Breadcrumb from "@/components/seo/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "تماس با ما | AME-TAMA",
  description: "با تیم پشتیبانی AME-TAMA در تماس باشید. ما آماده پاسخگویی به سوالات، پیشنهادات و درخواست‌های شما هستیم.",
  alternates: {
    // canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
    canonical: `https://ametama.com/contact`,
  },
  openGraph: {
    title: "تماس با ما | AME-TAMA",
    description: "با تیم پشتیبانی AME-TAMA در تماس باشید. ما آماده پاسخگویی به سوالات شما هستیم.",
    // url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
    url: `https://ametama.com/contact`,
    siteName: "AME-TAMA",
    locale: "fa_IR",
    type: "website",
  },
}

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      {/* بردکرامب */}
      <Breadcrumb
        items={[
          { name: "خانه", path: "/" },
          { name: "تماس با ما", path: "/contact" },
        ]}
        className="mb-6"
      />

      {/* هدر صفحه */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">تماس با ما</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          ما مشتاقانه منتظر شنیدن نظرات، پیشنهادات و سوالات شما هستیم
        </p>
        <Separator className="mt-6 max-w-md mx-auto" />
      </div>

      {/* بخش اصلی */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* اطلاعات تماس */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">راه‌های ارتباطی</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full ml-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">تلفن تماس</h3>
                    <p className="text-muted-foreground">۰۲۱-۱۲۳۴۵۶۷۸</p>
                    <p className="text-muted-foreground">۰۹۱۲۳۴۵۶۷۸۹</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full ml-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">ایمیل</h3>
                    <p className="text-muted-foreground">info@ametama.com</p>
                    <p className="text-muted-foreground">support@ametama.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full ml-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">آدرس</h3>
                    <p className="text-muted-foreground">
                      تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۳، طبقه ۴، واحد ۸
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <h2 className="text-xl font-bold mb-4">ساعات کاری</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>شنبه تا چهارشنبه:</span>
                  <span className="text-muted-foreground">۹ صبح تا ۶ عصر</span>
                </div>
                <div className="flex justify-between">
                  <span>پنجشنبه:</span>
                  <span className="text-muted-foreground">۹ صبح تا ۱ بعدازظهر</span>
                </div>
                <div className="flex justify-between">
                  <span>جمعه:</span>
                  <span className="text-muted-foreground">تعطیل</span>
                </div>
              </div>

              <Separator className="my-6" />

              <h2 className="text-xl font-bold mb-4">شبکه‌های اجتماعی</h2>
              <div className="flex space-x-4 space-x-reverse">
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-pink-500"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                    <span className="sr-only">اینستاگرام</span>
                  </Button>
                </Link>
                <Link href="https://telegram.org" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-500"
                    >
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                    <span className="sr-only">تلگرام</span>
                  </Button>
                </Link>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-400"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                    <span className="sr-only">توییتر</span>
                  </Button>
                </Link>
                <Link href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <path d="M17.6 6.8A7.8 7.8 0 0 0 12 4.5a8 8 0 0 0-8 8 8 8 0 0 0 1.2 4.2l-1.3 3.9 4.1-1.2a8 8 0 0 0 12.1-6.7 8 8 0 0 0-2.5-5.9z" />
                      <path d="M14.5 15a1 1 0 0 1-.7.3 9.5 9.5 0 0 1-3.8-1.3 10.5 10.5 0 0 1-3.3-3.3 9.5 9.5 0 0 1-1.3-3.8 1 1 0 0 1 .3-.7l.7-.7a.5.5 0 0 1 .7 0l1.5 1.5a.5.5 0 0 1 0 .7l-.7.7a.5.5 0 0 0 0 .6 6.5 6.5 0 0 0 1.2 1.5 6.5 6.5 0 0 0 1.5 1.2.5.5 0 0 0 .6 0l.7-.7a.5.5 0 0 1 .7 0l1.5 1.5a.5.5 0 0 1 0 .7l-.7.7z" />
                    </svg>
                    <span className="sr-only">واتس‌اپ</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* فرم تماس */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">ارسال پیام</h2>
              <p className="text-muted-foreground mb-6">
                برای ارسال سوالات، پیشنهادات یا انتقادات خود، لطفاً فرم زیر را تکمیل کنید. تیم پشتیبانی ما در اسرع وقت با
                شما تماس خواهد گرفت.
              </p>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* نقشه */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">موقعیت ما روی نقشه</h2>
        <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4 text-muted-foreground"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p className="text-muted-foreground">نقشه موقعیت فروشگاه</p>
          </div>
        </div>
      </div>

      {/* سوالات متداول */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">سوالات متداول درباره تماس با ما</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              question: "چقدر طول می‌کشد تا به پیام من پاسخ دهید؟",
              answer:
                "ما تلاش می‌کنیم به تمامی پیام‌ها در کمتر از ۲۴ ساعت کاری پاسخ دهیم. در روزهای شلوغ یا تعطیلات، ممکن است این زمان کمی بیشتر شود.",
            },
            {
              question: "آیا می‌توانم به صورت حضوری از فروشگاه بازدید کنم؟",
              answer:
                "بله، شما می‌توانید در ساعات کاری به آدرس فروشگاه مراجعه کنید. توصیه می‌کنیم قبل از مراجعه، با شماره تماس ما هماهنگی‌های لازم را انجام دهید.",
            },
            {
              question: "چگونه می‌توانم درباره وضعیت سفارش خود اطلاع پیدا کنم؟",
              answer:
                "شما می‌توانید با وارد شدن به حساب کاربری خود، در بخش «سفارش‌های من» وضعیت سفارش خود را مشاهده کنید. همچنین می‌توانید از طریق ایمیل یا تماس تلفنی با پشتیبانی، وضعیت سفارش خود را پیگیری کنید.",
            },
          ].map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
