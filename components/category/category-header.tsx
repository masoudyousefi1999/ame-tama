import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ICategoryType } from "@/lib/categories";

interface CategoryHeaderProps {
  category: ICategoryType;
}

export default function CategoryHeader({ category }: CategoryHeaderProps) {
  const isRoot = category.name === "figures";
  return (
    <header
      className={cn(
        "relative mb-10 rounded-3xl overflow-hidden group",
        isRoot ? "h-[14rem] md:h-[18rem]" : "h-40 md:h-48"
      )}
    >
      {/* تصویر پس‌زمینه  (کیفیت بالاتر + رنگ زنده) */}
      <div className="relative w-full h-64">
        <Image
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          fill
          priority
          quality={70}
          sizes="(max-width: 768px) 100vw, 80vw"
          className="
                      object-cover
                      brightness-95 saturate-110 
                      transition-transform duration-700
                      group-hover:scale-105 group-hover:rotate-1
    "
        />
      </div>

      {/* گرادیان ملایم‌تر برای خوانایی متن */}
      <div
        className="
      absolute inset-0
      bg-gradient-to-tr from-black/60 via-black/25 to-transparent
      /*   ⬆️   تاریک‌تر فقط پایین/چپ  —— بدون blur  */
    "
      />

      {/* متن */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1
          className={cn(
            "font-vazirmatn font-extrabold tracking-tight text-white drop-shadow-lg",
            isRoot ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
          )}
        >
          {category.name}
        </h1>

        {category.description && (
          <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-white/85 font-vazirmatn">
            {category.description}
          </p>
        )}
      </div>

      {/* هالهٔ نور پایین کارت (دست‌نخورده) */}
      <div
        className="
      pointer-events-none absolute -bottom-12 left-1/2 w-[120%] h-24
      -translate-x-1/2 bg-purple-500/20 blur-[60px]
      group-hover:bg-purple-600/30 transition-colors
    "
      />
    </header>
  );
}
