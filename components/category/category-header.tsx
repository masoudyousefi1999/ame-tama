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
        "relative mb-12 overflow-hidden rounded-3xl group transition-all ease-in-out",
        isRoot ? "h-[16rem] md:h-[20rem]" : "h-48 md:h-56"
      )}
    >
      {/* Background Image */}
      <div className="relative h-64 w-full">
        <Image
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          fill
          priority
          quality={80}
          className="
            object-fit md:object-cover brightness-95 saturate-110
            transition-transform duration-700
            group-hover:scale-105 group-hover:translate-y-2
          "
        />
      </div>

      {/* Soft Gradient for Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/30 to-transparent" />

      {/* Copy */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1
          className={cn(
            "font-sans font-extrabold tracking-tight text-white drop-shadow-lg",
            isRoot ? "text-5xl md:text-6xl" : "text-4xl md:text-5xl"
          )}
        >
          {category.name}
        </h1>

        {category.description && (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/90 md:text-lg font-sans">
            {category.description}
          </p>
        )}
      </div>

      {/* Bottom Glow */}
      <div
        className="
        pointer-events-none absolute -bottom-12 left-1/2 h-24 w-[120%]
        -translate-x-1/2 bg-primary/20 blur-[60px]
        transition-colors group-hover:bg-primary/30
      "
      />
    </header>
  );
}
