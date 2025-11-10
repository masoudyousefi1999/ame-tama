import Link from "next/link";
import { CustomImage as Image } from "@/components/ui/custom-image";
import { cn } from "@/lib/utils";
import type React from "react";

type HeroStat = {
  label: string;
};

type HeroAction = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
  prefetch?: boolean;
};

interface GradientHeroProps {
  title: string;
  description?: string | null;
  image?: string | null;
  fallbackIcon?: string;
  stats?: HeroStat[];
  actions?: HeroAction[];
  containerClassName?: string;
  className?: string;
}

const INDICATOR_COLORS = [
  "bg-green-400",
  "bg-blue-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-cyan-400",
];

export default function GradientHero({
  title,
  description,
  image,
  fallbackIcon = "📦",
  stats,
  actions,
  containerClassName,
  className,
}: GradientHeroProps) {
  const hasActions = actions && actions.length > 0;

  const renderAction = (action: HeroAction, index: number) => {
    const variant = action.variant ?? (index === 0 ? "primary" : "secondary");
    const content = (
      <>
        <span>{action.label}</span>
        {action.icon}
      </>
    );

    const baseClasses =
      "inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

    const variantClasses =
      variant === "primary"
        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 hover:shadow-xl"
        : "bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20";

    const className = cn(baseClasses, variantClasses);

    if (action.href.startsWith("#")) {
      return (
        <a key={action.href} href={action.href} className={className}>
          {content}
        </a>
      );
    }

    return (
      <Link
        key={action.href}
        href={action.href}
        className={className}
        prefetch={action.prefetch ?? false}
      >
        {content}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-3xl group transition-all ease-in-out",
        className
      )}
    >
      <section className="relative py-8 md:py-16 lg:py-20 overflow-hidden min-h-[260px] md:min-h-[320px] lg:min-h-[350px]">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />

        <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-32 right-20 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-primary/10 rounded-full blur-2xl animate-pulse delay-2000" />
        <div className="absolute bottom-32 right-1/3 w-28 h-28 bg-accent/10 rounded-full blur-2xl animate-pulse delay-500" />

        <div className="absolute inset-0">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="100vw"
              className="object-cover opacity-25 group-hover:opacity-35 transition-all duration-700 scale-105 group-hover:scale-110"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-8xl opacity-60 animate-bounce">
                {fallbackIcon}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
        </div>

        <div className="relative z-10 flex items-center h-full">
          <div className={cn("container mx-auto px-6", containerClassName)}>
            <div className="max-w-5xl">
              <div className="mb-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-white via-primary/80 to-accent/80 bg-clip-text text-transparent">
                    {title}
                  </span>
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full mb-4" />
              </div>

              {description && (
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed font-medium">
                  {description}
                </p>
              )}

              {stats && stats.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-6">
                  {stats.map((stat, idx) => (
                    <div
                      key={`${stat.label}-${idx}`}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full animate-pulse",
                          INDICATOR_COLORS[idx % INDICATOR_COLORS.length]
                        )}
                      />
                      <span className="text-white font-medium text-sm">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {hasActions && (
                <div className="flex flex-wrap gap-3">
                  {actions!.map((action, idx) => renderAction(action, idx))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent" />
      </section>
    </header>
  );
}

