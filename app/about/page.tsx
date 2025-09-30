import { CustomImage as Image } from "@/components/ui/custom-image";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "درباره ما | AME-TAMA",
  description:
    "با AME-TAMA، برند پیشرو در زمینه مجسمه‌های انیمه لوکس آشنا شوید. داستان ما، ارزش‌های ما و تعهد ما به کیفیت برتر.",
  alternates: {
    canonical: "https://ametama.com/about",
  },
  openGraph: {
    title: "درباره ما | AME-TAMA",
    description:
      "با AME-TAMA، برند پیشرو در زمینه مجسمه‌های انیمه لوکس آشنا شوید.",
    url: "https://ametama.com/about",
    siteName: "AME-TAMA",
    locale: "fa_IR",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Breadcrumb */}
      <main className="container py-8 md:py-12 mt-12">
        <Breadcrumb
          items={[{ label: "درباره ما", href: "/about", isCurrent: true }]}
          className="mb-6"
        />
      </main>

      {/* Gradient Header (full width, consistent height) */}
      <section className="relative overflow-hidden w-full pb-24 mt-0 min-h-[320px] md:min-h-[380px] flex items-end">
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900" />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-indigo-500/30 to-gray-500/30 animate-pulse" />
        {/* Floating orbs */}
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-28 h-28 bg-fuchsia-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute bottom-32 right-20 w-20 h-20 bg-purple-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        />
        {/* Radial gradients for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.3),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.3),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.2),transparent_50%)]" />
        {/* Animated mesh gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/10 to-transparent animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        {/* Top overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10 pb-10">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            درباره AME-TAMA
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium">
            مرجع برتر مجسمه‌های انیمه لوکس در ایران
          </p>
        </div>
      </section>

      {/* Main content container */}
      <main className="container py-8 md:py-12">
        {/* Page header (hidden) */}
        <header className="mb-10 text-center hidden">
          <h1 className="text-foreground text-3xl md:text-4xl font-bold mb-4">
            درباره AME-TAMA
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            مرجع برتر مجسمه‌های انیمه لوکس در ایران
          </p>
          <Separator className="mt-6 max-w-md mx-auto" />
        </header>

        {/* Our story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-foreground text-2xl font-bold mb-4">
                داستان ما
              </h2>
              <p className="mb-4">
                AME-TAMA در سال ۱۳۹۸ با هدف ارائه مجسمه‌های انیمه با کیفیت برتر
                به علاقه‌مندان و کلکسیونرهای ایرانی تأسیس شد. ما با شناخت عمیق
                از فرهنگ انیمه و مانگا، و با درک نیاز بازار ایران به محصولات اصل
                و با کیفیت، فعالیت خود را آغاز کردیم.
              </p>
              <p className="mb-4">
                در طول این سال‌ها، با تلاش مستمر و جلب اعتماد مشتریان،
                توانسته‌ایم به یکی از معتبرترین فروشگاه‌های مجسمه انیمه در ایران
                تبدیل شویم. همکاری مستقیم با تولیدکنندگان معتبر ژاپنی و
                تأمین‌کنندگان بین‌المللی، به ما این امکان را می‌دهد تا جدیدترین
                و باکیفیت‌ترین مجسمه‌ها را به دست مشتریان برسانیم.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="داستان AME-TAMA"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Our values */}
        <section className="mb-16 bg-muted py-10 px-6 rounded-xl">
          <h2 className="text-foreground text-2xl font-bold mb-8 text-center">
            ارزش‌های ما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ارزش ۱ */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-chart-1/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {/* icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-chart-1"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">کیفیت برتر</h3>
                </div>
                <p className="text-center">
                  ما تنها مجسمه‌های اصل و با کیفیت را ارائه می‌دهیم. هر محصول
                  قبل از ارسال به دقت بررسی می‌شود تا از رضایت مشتریان اطمینان
                  حاصل کنیم.
                </p>
              </CardContent>
            </Card>

            {/* ارزش ۲ */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-chart-2"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">اشتیاق و تخصص</h3>
                </div>
                <p className="text-center">
                  تیم ما متشکل از علاقه‌مندان واقعی به انیمه و کلکسیونرهای
                  حرفه‌ای است. ما با اشتیاق و دانش تخصصی خود، بهترین محصولات را
                  برای شما انتخاب می‌کنیم.
                </p>
              </CardContent>
            </Card>

            {/* ارزش ۳ */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-chart-3"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">اعتماد و اطمینان</h3>
                </div>
                <p className="text-center">
                  رضایت و اعتماد مشتریان، مهم‌ترین سرمایه ماست. ما با ارائه
                  خدمات پس از فروش و پشتیبانی مستمر، همواره در کنار مشتریان خود
                  هستیم.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-foreground text-2xl font-bold mb-8 text-center">
            تیم ما
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "علی محمدی",
                position: "بنیانگذار و مدیرعامل",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "سارا رضایی",
                position: "مدیر محصول",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "محمد کریمی",
                position: "کارشناس فروش",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "نیلوفر احمدی",
                position: "مدیر پشتیبانی مشتریان",
                image: "/placeholder.svg?height=300&width=300",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 relative mx-auto w-40 h-40 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.position}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mb-16 text-center">
          <h2 className="text-foreground text-2xl font-bold mb-4">
            می‌خواهید با ما در تماس باشید؟
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            برای ارسال سوالات، پیشنهادات یا انتقادات خود، می‌توانید از طریق صفحه
            تماس با ما اقدام کنید.
          </p>
          <Link href="/contact" prefetch={false}>
            <Button size="lg" className="px-8">
              تماس با ما
            </Button>
          </Link>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-foreground text-2xl font-bold mb-8 text-center">
            پرسش‌های متداول
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "آیا محصولات شما اورجینال هستند؟",
                answer:
                  "بله، تمامی محصولات ارائه شده در AME-TAMA اصل و اورجینال هستند. ما مستقیماً با تولیدکنندگان و تأمین‌کنندگان معتبر همکاری می‌کنیم.",
              },
              {
                question: "هزینه ارسال به شهرستان‌ها چقدر است؟",
                answer:
                  "هزینه ارسال بر اساس وزن محصول و مقصد متفاوت است. برای خریدهای بالای ۵۰۰ هزار تومان، ارسال به تمام نقاط کشور رایگان است.",
              },
              {
                question: "آیا امکان سفارش محصولات خاص وجود دارد؟",
                answer:
                  "بله، در صورتی که محصول مورد نظر شما در سایت موجود نیست، می‌توانید از طریق فرم سفارش ویژه یا تماس با پشتیبانی، درخواست خود را ثبت کنید.",
              },
              {
                question: "شرایط گارانتی و مرجوعی محصولات چگونه است؟",
                answer:
                  "تمامی محصولات دارای ۷ روز ضمانت بازگشت در صورت وجود مشکل هستند. همچنین، مجسمه‌های برخی برندها دارای گارانتی رسمی هستند که جزئیات آن در صفحه محصول ذکر شده است.",
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
        </section>
      </main>
    </>
  );
}
