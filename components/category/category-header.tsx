import { CustomImage as Image } from "@/components/ui/custom-image";
import { cn } from "@/lib/utils";
import type { ICategoryType } from "@/lib/categories";
import Link from "next/link";

interface CategoryHeaderProps {
  category: ICategoryType;
}

export default function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <header className="relative mb-12 overflow-hidden rounded-3xl group transition-all ease-in-out">
      <section className="relative py-12 md:py-20 overflow-hidden min-h-[300px] md:min-h-[350px]">
        {/* Dynamic gradient background based on category */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />

        {/* Animated floating elements */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-32 right-20 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-primary/10 rounded-full blur-2xl animate-pulse delay-2000" />
        <div className="absolute bottom-32 right-1/3 w-28 h-28 bg-accent/10 rounded-full blur-2xl animate-pulse delay-500" />

        {/* Background Image with enhanced overlay */}
        <div className="absolute inset-0">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="100vw"
              className="object-cover opacity-25 group-hover:opacity-35 transition-all duration-700 scale-105 group-hover:scale-110"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-8xl opacity-60 animate-bounce">📦</span>
            </div>
          )}
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
        </div>

        {/* Content with better typography and layout */}
        <div className="relative z-10 flex items-center h-full">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl">
              {/* Category title with enhanced styling */}
              <div className="mb-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-white via-primary/80 to-accent/80 bg-clip-text text-transparent">
                    {category.name}
                  </span>
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full mb-4"></div>
              </div>

              {/* Description with better styling */}
              {category.description && (
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed font-medium">
                  {category.description}
                </p>
              )}

              {/* Stats with enhanced design */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium text-sm">
                    محصولات متنوع
                  </span>
                </div>
                {category.tags && category.tags.length > 0 && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                    <span className="text-white font-medium text-sm">
                      {category.tags.length} انیمه موجود
                    </span>
                  </div>
                )}
              </div>

              {/* Call to action buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <span>مشاهده محصولات</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  <span>مشاهده فروشگاه</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section>
    </header>
  );
}
