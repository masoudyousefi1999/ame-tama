import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ICategoryType } from "@/lib/categories";

interface CategoryHeaderProps {
  category: ICategoryType;
}

export default function CategoryHeader({ category }: CategoryHeaderProps) {
  const isRoot = category.name === "figures";

  return (
    <header className="relative mb-12 overflow-hidden rounded-3xl group transition-all ease-in-out">
      {/* Hero Section with Gradient Background */}
      <section
        className={cn(
          "relative py-16 md:py-24 overflow-hidden",
          isRoot ? "h-[16rem] md:h-[20rem]" : "h-48 md:h-56"
        )}
      >
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900" />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 animate-pulse" />

        {/* Floating orbs */}
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-teal-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-28 h-28 bg-cyan-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute bottom-32 right-20 w-20 h-20 bg-emerald-400/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        />

        {/* Radial gradients for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(20,184,166,0.4),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.3),transparent_50%)]" />

        {/* Animated mesh gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-emerald-500/10 to-transparent animate-pulse"
          style={{ animationDuration: "6s" }}
        />

        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            fill
            priority
            quality={80}
            className="object-cover brightness-75 saturate-110 transition-transform duration-700 group-hover:scale-105 group-hover:translate-y-2"
          />
          {/* Soft Gradient for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>

        {/* Top overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Content */}
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
        <div className="pointer-events-none absolute -bottom-12 left-1/2 h-24 w-[120%] -translate-x-1/2 bg-emerald-500/20 blur-[60px] transition-colors group-hover:bg-emerald-500/30" />
      </section>
    </header>
  );
}
