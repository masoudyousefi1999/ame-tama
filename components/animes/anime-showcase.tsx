import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "@/components/ui/custom-image";
import type { ITagType } from "@/lib/tags";

interface AnimeShowcaseProps {
  tags: ITagType[];
}

function AnimeCard({ tag }: { tag: ITagType }) {
  return (
    <Link
      href={`/anime/${tag.slug}`}
      prefetch={false}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02]"
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        {tag.image?.url ? (
          <Image
            src={tag.image.url}
            alt={tag.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            quality={80}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
            <span className="text-4xl opacity-50">🎭</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        <div className="absolute inset-0 flex items-end p-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 w-full">
            <h3 className="text-white font-semibold text-sm md:text-base truncate">
              {tag.name}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function AnimeShowcase({ tags }: AnimeShowcaseProps) {
  const displayedTags = tags;

  if (!tags || tags.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">هیچ انیمه‌ای یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {displayedTags.map((tag) => (
        <AnimeCard key={tag.uuid} tag={tag} />
      ))}
    </div>
  );
}
