import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShopCTA() {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="  mb-4 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            مجموعه کامل فیگورهای انیمه
          </h2>

          <p className="  mb-8 text-lg text-muted-foreground">
            بیش از&nbsp;1000&nbsp;فیگور از برترین انیمه‌ها و مانگاهای محبوب شما؛
            از شخصیت‌های کلاسیک گرفته تا جدیدترین سری‌ها.
          </p>

          <Link href="/shop">
            <Button
              size="lg"
              iconPosition="end"
              variant={"default"}
              className="group rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl"
            >
              <span>مشاهده فروشگاه</span>
              <ArrowRight className="h-5 w-5 transition-transform rtl:rotate-180 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
