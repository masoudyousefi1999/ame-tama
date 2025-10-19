import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BrandedIllustration } from "./ui/branded-illustration";

export default function Footer() {
  return (
    <footer className="relative bg-card border-t border-border overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-dots opacity-5" />
      <BrandedIllustration variant="footer" />

      <div className="relative container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* ─────────────────── Brand / about ─────────────────── */}
          <div className="text-right">
            <Link href="/" className="inline-block mb-6 group" prefetch={false}>
              <span className="brand-name text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
                AME-TAMA
              </span>
            </Link>

            <p className="mb-6 max-w-md text-muted-foreground persian-text">
              ارتقاء کلکسیونی‌های انیمه به هنر زیبا. هر مجسمه AME-TAMA شاهکاری
              از جزئیات، کیفیت و اشتیاق است.
            </p>

            <div className="flex gap-x-4">
              {/* socials */}
              {[
                { Icon: Facebook, label: "فیسبوک", href: "#" },
                { Icon: Instagram, label: "اینستاگرام", href: "#" },
                { Icon: Twitter, label: "توییتر", href: "#" },
                { Icon: Youtube, label: "یوتیوب", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a key={label} href={href} className="group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-accent hover:scale-110 transition-all duration-200"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors duration-200" />
                    <span className="sr-only">{label}</span>
                  </Button>
                </a>
              ))}
            </div>
          </div>

          {/* ─────────────────── Shop links ─────────────────── */}
          <div className="text-right">
            <h3 className="mb-4 text-lg font-semibold">فروشگاه</h3>
            <ul className="space-y-3">
              {[
                { name: "محصولات جدید", href: "/shop" },
                { name: "پرفروش‌ترین‌ها", href: "/shop" },
                { name: "نسخه‌های محدود", href: "/shop" },
                { name: "پیش‌فروش", href: "/shop" },
                { name: "حراج", href: "/shop" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-all duration-200 hover:text-primary hover:translate-x-1 block py-2 px-1 min-h-[44px] flex items-center"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─────────────────── Support links ─────────────────── */}
          <div className="text-right">
            <h3 className="mb-4 text-lg font-semibold">پشتیبانی</h3>
            <ul className="space-y-3">
              {[
                { name: "تماس با ما", href: "/contact" },
                { name: "سوالات متداول", href: "/faq" },
                { name: "ارسال و مرجوعی", href: "#" },
                { name: "راهنمای نگهداری مجسمه", href: "#" },
                { name: "پیگیری سفارش", href: "/profile/orders" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-all duration-200 hover:text-primary hover:translate-x-1 block py-2 px-1 min-h-[44px] flex items-center"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─────────────────── Newsletter ─────────────────── */}
          <div className="text-right">
            <h3 className="mb-4 text-lg font-semibold">عضویت در خبرنامه</h3>
            <p className="mb-4 text-muted-foreground persian-text">
              اولین نفری باشید که از محصولات جدید، پیشنهادات ویژه و رویدادهای
              کلکسیونری مطلع می‌شوید.
            </p>

            <div className="flex flex-row-reverse gap-x-2">
              <Input
                type="email"
                placeholder="ایمیل شما"
                dir="rtl"
                className="rounded-full bg-background text-right transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <Button className="rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200 hover:scale-105">
                عضویت
              </Button>
            </div>
          </div>
        </div>

        {/* ─────────────────── Contact Info ─────────────────── */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-right">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">تماس با ما</p>
                <div className="flex flex-col items-start mt-2">
                  <a
                    href="tel:+989174120968"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    09932607390
                  </a>
                  <a
                    href="tel:+989375116262"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    09375116262
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">ایمیل</p>
                <p className="text-sm text-muted-foreground">
                  info@ame-tama.com
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">آدرس</p>
                <p className="text-sm text-muted-foreground">شیراز</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────── Bottom bar ─────────────────── */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-border pt-8 md:flex-row">
          <p className="mb-4 text-sm text-muted-foreground md:mb-0">
            © {new Date().getFullYear()} AME-TAMA. تمامی حقوق محفوظ است.
          </p>

          <div className="flex gap-x-6">
            {[
              { name: "سیاست حفظ حریم خصوصی", href: "#" },
              { name: "شرایط استفاده از خدمات", href: "#" },
              { name: "سیاست کوکی", href: "#" },
            ].map((link) => (
              <Link
                href={link.href}
                key={link.name}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}

            {/* نماد اعتماد */}
            <a
              referrerPolicy="origin"
              target="_blank"
              href="https://trustseal.enamad.ir/?id=620304&Code=BvOr2VrvxRZhOtMRTyHPz1alYdx7aN4z"
              className="transition-transform hover:scale-105"
            >
              <img
                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=620304&Code=BvOr2VrvxRZhOtMRTyHPz1alYdx7aN4z"
                alt="نماد اعتماد الکترونیکی"
                data-code="BvOr2VrvxRZhOtMRTyHPz1alYdx7aN4z"
                style={{ cursor: "pointer" }}
              />
            </a>
          </div>
        </div>
      </div>

      {/* Wave Effect at Bottom */}
      <div className="relative w-full h-16 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,60 600,30 1200,60 L1200,120 L0,120 Z"
            fill="url(#waveGradient)"
            className="animate-wave"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(139,92,246,0.1)" />
              <stop offset="50%" stopColor="rgba(59,130,246,0.15)" />
              <stop offset="100%" stopColor="rgba(6,182,212,0.1)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
}
