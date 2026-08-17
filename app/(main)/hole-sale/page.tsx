import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "خرید فیگور انیمه ای به صورت عمده | AME-TAMA",
  description:
    "خرید عمده فیگور و مجسمه‌های انیمه‌ای با شرایط ویژه همکاری برای فروشگاه‌ها، همکاران و پخش‌کنندگان از AME-TAMA.",
  alternates: {
    canonical: "https://ame-tama.com/hole-sale",
  },
  openGraph: {
    title: "خرید فیگور انیمه ای به صورت عمده | AME-TAMA",
    description:
      "شرایط ویژه خرید عمده فیگورهای انیمه برای همکاران، فروشگاه‌ها و پخش‌کنندگان در سراسر ایران.",
    url: "https://ame-tama.com/hole-sale",
    siteName: "AME-TAMA",
    locale: "fa_IR",
    type: "website",
  },
};

export default function HoleSalePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pb-24 lg:mt-20">
      {/* Breadcrumb */}
      <main className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumb
          items={[
            {
              label: "خرید فیگور انیمه ای به صورت عمده",
              href: "/hole-sale",
              isCurrent: true,
            },
          ]}
          className="mb-6"
        />
      </main>

      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-indigo-500/30 to-blue-500/30 animate-pulse" />

        <div
          className="absolute top-20 left-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-24 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-24 left-1/3 w-28 h-28 bg-fuchsia-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.35),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(79,70,229,0.35),transparent_45%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            خرید فیگور انیمه ای به صورت عمده
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium">
            اگر فروشگاه اسباب‌بازی، فروشگاه انیمه یا کسب‌وکار مرتبط دارید،
            می‌توانید فیگورهای انیمه را با شرایط ویژه و قیمت همکاری از AME-TAMA
            تأمین کنید.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 md:px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* توضیحات شرایط همکاری */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 md:p-8 space-y-4 leading-8">
                <h2 className="text-2xl font-bold mb-4">
                  شرایط خرید عمده فیگور انیمه
                </h2>
                <p>
                  ما در AME-TAMA امکان تأمین عمده فیگور و مجسمه‌های انیمه‌ای را
                  برای فروشگاه‌ها، همکاران و پخش‌کنندگان در سراسر ایران فراهم
                  کرده‌ایم.
                </p>
                <ul className="list-disc list-inside space-y-2 pr-2">
                  <li>
                    حداقل مبلغ سفارش عمده (قابل توافق با توجه به نوع محصولات)
                  </li>
                  <li>امکان تأمین محصولات پرفروش و خاص با تنوع بالا</li>
                  <li>ارسال امن و حرفه‌ای به سراسر کشور</li>
                  <li>مشاوره برای انتخاب محصولات مناسب بازار هدف شما</li>
                </ul>
                <p className="mt-4">
                  برای دریافت لیست محصولات، شرایط دقیق همکاری و استعلام قیمت
                  عمده، لطفاً از طریق فرم تماس یا راه‌های ارتباطی درج‌شده در
                  صفحه{" "}
                  <Link
                    href="/contact"
                    className="text-primary underline underline-offset-4"
                    prefetch={false}
                  >
                    تماس با ما
                  </Link>{" "}
                  با تیم فروش ما در ارتباط باشید.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* باکس تماس سریع */}
          <aside>
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col gap-4">
                <h2 className="text-xl font-bold mb-2">درخواست همکاری عمده</h2>
                <p className="text-sm text-muted-foreground">
                  برای خرید عمده و اطلاع از قیمت با ما در تلگرام یا واتساپ در
                  ارتباط باشید
                </p>

                <div className="space-y-1 text-sm">
                  <p className="font-semibold">تلفن تماس:</p>
                  <a
                    href="tel:+989375116262"
                    className="text-primary hover:underline block"
                  >
                    09375116262
                  </a>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="font-semibold">ایمیل:</p>
                  <a
                    href="mailto:info@ametama.com"
                    className="text-primary hover:underline block break-all"
                  >
                    info@ametama.com
                  </a>
                </div>

                <Link href="https://t.me/ame_tama" prefetch={false}>
                  <Button className="w-full mt-2">
                    ثبت درخواست از طریق تلگرام
                  </Button>
                </Link>
                <Link href="https://wa.me/09375116262" prefetch={false}>
                  <Button className="w-full mt-2">
                    ثبت درخواست از طریق واتساپ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
