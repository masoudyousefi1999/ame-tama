import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* ─────────────────── Brand / about ─────────────────── */}
          <div className="text-right">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-primary">
                AME-TAMA
              </span>
            </Link>

            <p className="mb-6 max-w-md text-muted-foreground font-vazirmatn persian-text">
              ارتقاء کلکسیونی‌های انیمه به هنر زیبا. هر مجسمه AME-TAMA شاهکاری
              از جزئیات، کیفیت و اشتیاق است.
            </p>

            <div className="flex gap-x-4">
              {/* socials */}
              {[
                { Icon: Facebook, label: "فیسبوک" },
                { Icon: Instagram, label: "اینستاگرام" },
                { Icon: Twitter, label: "توییتر" },
                { Icon: Youtube, label: "یوتیوب" },
              ].map(({ Icon, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-accent"
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="sr-only">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* ─────────────────── Shop links ─────────────────── */}
          <div className="text-right">
            <h3 className="mb-4 text-lg font-semibold font-vazirmatn">
              فروشگاه
            </h3>
            <ul className="space-y-3">
              {[
                "محصولات جدید",
                "پرفروش‌ترین‌ها",
                "نسخه‌های محدود",
                "پیش‌فروش",
                "حراج",
              ].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="font-vazirmatn text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─────────────────── Support links ─────────────────── */}
          <div className="text-right">
            <h3 className="mb-4 text-lg font-semibold font-vazirmatn">
              پشتیبانی
            </h3>
            <ul className="space-y-3">
              {[
                "تماس با ما",
                "سوالات متداول",
                "ارسال و مرجوعی",
                "راهنمای نگهداری مجسمه",
                "پیگیری سفارش",
              ].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="font-vazirmatn text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─────────────────── Newsletter ─────────────────── */}
          <div className="text-right">
            <h3 className="mb-4 text-lg font-semibold font-vazirmatn">
              عضویت در خبرنامه
            </h3>
            <p className="mb-4 text-muted-foreground font-vazirmatn persian-text">
              اولین نفری باشید که از محصولات جدید، پیشنهادات ویژه و رویدادهای
              کلکسیونری مطلع می‌شوید.
            </p>

            <div className="flex flex-row-reverse gap-x-2">
              <Input
                type="email"
                placeholder="ایمیل شما"
                dir="rtl"
                className="rounded-full bg-background text-right font-vazirmatn"
              />
              <Button className="rounded-full  hover:from-primary/90 hover:to-accent/90 font-vazirmatn">
                عضویت
              </Button>
            </div>
          </div>
        </div>

        {/* ─────────────────── Bottom bar ─────────────────── */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-border pt-8 md:flex-row">
          <p className="mb-4 text-sm text-muted-foreground md:mb-0 font-vazirmatn">
            © {new Date().getFullYear()} AME-TAMA. تمامی حقوق محفوظ است.
          </p>

          <div className="flex gap-x-6">
            {[
              "سیاست حفظ حریم خصوصی",
              "شرایط استفاده از خدمات",
              "سیاست کوکی",
            ].map((link) => (
              <Link
                href="#"
                key={link}
                className="text-sm text-muted-foreground transition-colors hover:text-primary font-vazirmatn"
              >
                {link}
              </Link>
            ))}

            {/* نماد اعتماد */}
            <a
              referrerPolicy="origin"
              target="_blank"
              href="https://trustseal.enamad.ir/?id=620304&Code=BvOr2VrvxRZhOtMRTyHPz1alYdx7aN4z"
            >
              <img
                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=620304&Code=BvOr2VrvxRZhOtMRTyHPz1alYdx7aN4z"
                alt=""
                data-code="BvOr2VrvxRZhOtMRTyHPz1alYdx7aN4z"
                style={{ cursor: "pointer" }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
