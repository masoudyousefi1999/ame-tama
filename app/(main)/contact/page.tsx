import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "تماس با ما | AME-TAMA",
  description:
    "با تیم پشتیبانی AME-TAMA در تماس باشید. ما آماده پاسخگویی به سوالات، پیشنهادات و درخواست‌های شما هستیم.",
  alternates: { canonical: "https://ame-tama.com/contact" },
  openGraph: {
    title: "تماس با ما | AME-TAMA",
    description:
      "با تیم پشتیبانی AME-TAMA در تماس باشید. ما آماده پاسخگویی به سوالات شما هستیم.",
    url: "https://ame-tama.com/contact",
    siteName: "AME-TAMA",
    locale: "fa_IR",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-24 lg:mt-20">
      {/* Breadcrumb */}
      <main className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumb
          items={[{ label: "تماس با ما", href: "/contact", isCurrent: true }]}
          className="mb-6"
        />
      </main>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900" />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-indigo-500/30 animate-pulse" />

        {/* Floating orbs */}
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-28 h-28 bg-indigo-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute bottom-32 right-20 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        />

        {/* Radial gradients for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.3),transparent_50%)]" />

        {/* Animated mesh gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-500/10 to-transparent animate-pulse"
          style={{ animationDuration: "6s" }}
        />

        {/* Top overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            تماس با ما
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium">
            ما مشتاقانه منتظر شنیدن نظرات، پیشنهادات و سوالات شما هستیم
          </p>
          <div className="flex items-center justify-center gap-4">
            <MessageCircle className="h-12 w-12 text-white/80" />
            <div className="text-left">
              <h2 className="text-xl font-bold text-white">24/7 پشتیبانی</h2>
              <p className="text-white/80">در تمام ساعات شبانه‌روز</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 mt-12">
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact details */}
          <aside className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">راه‌های ارتباطی</h2>

                {/* Phone / Email / Address blocks */}
                <div className="space-y-6">
                  {[
                    {
                      title: "تلفن تماس",
                      lines: ["09932607390", "09375116262"],
                      icon: (
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      ),
                    },
                    {
                      title: "ایمیل",
                      lines: ["info@ametama.com", "support@ametama.com"],
                      icon: (
                        <>
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </>
                      ),
                    },
                    {
                      title: "آدرس",
                      lines: ["شیراز - ستارخان "],
                      icon: (
                        <>
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </>
                      ),
                    },
                  ].map((block, i) => (
                    <div key={i} className="flex items-start">
                      <div className="bg-chart-1/10 p-3 rounded-full ml-4">
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
                          className="text-chart-1"
                        >
                          {block.icon}
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{block.title}</h3>

                        <div className="flex flex-col items-start mt-2">
                          {block.lines.map((l) => {
                            const normalized = l.replace(/\D/g, "");
                            const isMobile =
                              normalized.length === 11 &&
                              normalized.startsWith("09");
                            const href = isMobile
                              ? `tel:+98${normalized.slice(1)}`
                              : null;

                            return (
                              <a
                                key={l}
                                href={href ?? undefined}
                                className="text-muted-foreground hover:text-primary"
                              >
                                {l}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Hours */}
                <h2 className="text-xl font-bold mb-4">ساعات کاری</h2>
                {[
                  ["شنبه تا چهارشنبه:", "۹ صبح تا ۶ عصر"],
                  ["پنجشنبه:", "۹ صبح تا ۱ بعدازظهر"],
                  ["جمعه:", "تعطیل"],
                ].map(([label, time]) => (
                  <div key={label} className="flex justify-between">
                    <span>{label}</span>
                    <span className="text-muted-foreground">{time}</span>
                  </div>
                ))}

                <Separator className="my-6" />

                {/* Social */}
                <h2 className="text-xl font-bold mb-4">شبکه‌های اجتماعی</h2>
                <div className="flex space-x-4 space-x-reverse">
                  {[
                    {
                      href: "https://instagram.com",
                      color: "text-pink-500",
                      icon: (
                        <>
                          <rect
                            width="20"
                            height="20"
                            x="2"
                            y="2"
                            rx="5"
                            ry="5"
                          />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </>
                      ),
                      sr: "اینستاگرام",
                    },
                    {
                      href: "https://telegram.org",
                      color: "text-blue-500",
                      icon: (
                        <>
                          <path d="m22 2-7 20-4-9-9-4Z" />
                          <path d="M22 2 11 13" />
                        </>
                      ),
                      sr: "تلگرام",
                    },
                    {
                      href: "https://twitter.com",
                      color: "text-blue-400",
                      icon: (
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      ),
                      sr: "توییتر",
                    },
                    {
                      href: "https://whatsapp.com",
                      color: "text-green-500",
                      icon: (
                        <>
                          <path d="M17.6 6.8A7.8 7.8 0 0 0 12 4.5a8 8 0 0 0-8 8 8 8 0 0 0 1.2 4.2l-1.3 3.9 4.1-1.2a8 8 0 0 0 12.1-6.7 8 8 0 0 0-2.5-5.9z" />
                          <path d="M14.5 15a1 1 0 0 1-.7.3 9.5 9.5 0 0 1-3.8-1.3 10.5 10.5 0 0 1-3.3-3.3 9.5 9.5 0 0 1-1.3-3.8 1 1 0 0 1 .3-.7l.7-.7a.5.5 0 0 1 .7 0l1.5 1.5a.5.5 0 0 1 0 .7l-.7.7a.5.5 0 0 0 0 .6 6.5 6.5 0 0 0 1.2 1.5 6.5 6.5 0 0 0 1.5 1.2.5.5 0 0 0 .6 0l.7-.7a.5.5 0 0 1 .7 0l1.5 1.5a.5.5 0 0 1 0 .7l-.7.7z" />
                        </>
                      ),
                      sr: "واتس‌اپ",
                    },
                  ].map((soc) => (
                    <Link
                      key={soc.href}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      prefetch={false}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                      >
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
                          className={soc.color}
                        >
                          {soc.icon}
                        </svg>
                        <span className="sr-only">{soc.sr}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">فرم تماس</h2>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
