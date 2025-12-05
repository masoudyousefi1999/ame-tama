import Link from "next/link";
import { CustomImage as Image } from "@/components/ui/custom-image";
import { Eye, ArrowLeft } from "lucide-react";
import { IBlogPostType } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface BlogSectionProps {
  blogs: IBlogPostType[];
  title: string;
  description?: string;
  bgColor?: string;
}

const BlogCard = ({ post }: { post: IBlogPostType }) => {
  return (
    <Link
      href={`/topic/${post.topic.slug}/${post.slug}`}
      prefetch={false}
      className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02]"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        {post.image && post.image.url ? (
          <Image
            src={post.image.url}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            quality={80}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
            <span className="text-4xl opacity-50">📰</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      </div>

      <div className="p-4 md:p-6">
        {/* Meta info */}
        <div className="flex items-center flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
          <span>{new Date(post.createdAt).toLocaleDateString("fa-IR")}</span>
          <span>•</span>
          <span className="text-primary">{post.topic.name}</span>
          {post.viewCount !== undefined && post.viewCount !== null && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 md:h-4 md:w-4" />
                <span>{post.viewCount.toLocaleString("fa-IR")}</span>
              </div>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg lg:text-xl font-bold text-card-foreground mb-2 md:mb-3 line-clamp-2 group-hover:text-primary/80 transition-colors duration-200">
          {post.title}
        </h3>

        {/* Content preview */}
        {post.content && (
          <div
            className="text-muted-foreground text-xs md:text-sm lg:text-base line-clamp-2 md:line-clamp-3"
            dangerouslySetInnerHTML={{
              __html:
                post.content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
            }}
          />
        )}
      </div>
    </Link>
  );
};

export default function BlogSection({
  blogs,
  title,
  description,
  bgColor = "bg-muted/60",
}: BlogSectionProps) {
  return (
    <section className={`relative py-16 md:py-24 ${bgColor}`}>
      <div className="absolute inset-0 bg-pattern-dots opacity-10 pointer-events-none" />
      <div className="relative container mx-auto px-6 lg:px-8 z-10">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 md:mb-8 section-title">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {!blogs || blogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>در حال حاضر بلاگی برای نمایش وجود ندارد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.uuid} post={blog} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/topic"
            className="inline-flex items-center gap-2 px-8 md:px-10 py-3 md:py-4 rounded-full border border-border/70 text-foreground hover:text-primary hover:border-primary font-semibold transition-all duration-200 hover:scale-105 bg-transparent"
          >
            <span>مشاهده همه بلاگ‌ها</span>
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
