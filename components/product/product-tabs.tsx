"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IProductType } from "@/lib/products";
import { useEffect, useState } from "react";
import {
  createComment,
  getCommentsByProductId,
  type ProductComment,
} from "@/lib/comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";
import { useLoginModal } from "@/context/login-modal-context";
import { CommentUserInfoModal } from "@/components/product/comment-user-info-modal";

interface ProductTabsProps {
  product: IProductType;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [pendingComment, setPendingComment] = useState<string>("");
  const [tabValue, setTabValue] = useState<string>("description");
  const maxLength = 600;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      const list = await getCommentsByProductId(product.uuid);
      if (!ignore) setComments(list);
      setLoading(false);
    }
    if (product?.uuid) load();
    return () => {
      ignore = true;
    };
  }, [product?.uuid]);

  // If there is a saved intent, pre-select the reviews tab (even before user loads)
  useEffect(() => {
    try {
      const intent = localStorage.getItem(
        `pending-comment-intent-${product?.uuid}`
      );
      if (intent) setTabValue("reviews");
    } catch {}
  }, [product?.uuid]);

  // Check for pending comment on mount and after login
  useEffect(() => {
    const storedComment = (() => {
      try {
        return localStorage.getItem(`pending-comment-${product?.uuid}`);
      } catch {
        return null;
      }
    })();
    if (storedComment && user) {
      setTabValue("reviews");
      setPendingComment(storedComment);
      setText(storedComment);

      // Auto-submit if user has complete info, otherwise show user info modal
      if (user.firstName && user.lastName) {
        setTimeout(() => {
          submitCommentCore();
        }, 100);
      } else {
        setShowUserInfoModal(true);
      }
    }
  }, [user, product?.uuid]);

  async function submitCommentCore() {
    const uuidOk = /^[0-9a-fA-F-]{36}$/.test(product?.uuid || "");
    const textOk = text.trim().length >= 3;
    if (!uuidOk || !textOk) return;
    setSubmitting(true);
    try {
      const created = await createComment({
        productId: product.uuid,
        text: text.trim(),
      });
      if (created) {
        setText("");
        // Clear any pending draft and intent after successful submission
        try {
          localStorage.removeItem(`pending-comment-${product?.uuid}`);
          localStorage.removeItem(`pending-comment-intent-${product?.uuid}`);
        } catch {}
        toast({
          variant: "success",
          title: "نظر شما ثبت شد",
          description: "نظر پس از تایید مدیر منتشر خواهد شد.",
        });
      } else {
        toast({
          variant: "error",
          title: "خطا در ثبت نظر",
          description: "لطفاً دوباره تلاش کنید.",
        });
      }
    } catch (err: any) {
      toast({
        variant: "error",
        title: "خطا در ثبت نظر",
        description: err?.message || "مشکلی رخ داد.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!user) {
      // Store comment and intent in localStorage before opening login modal
      try {
        localStorage.setItem(`pending-comment-${product?.uuid}`, text);
        localStorage.setItem(`pending-comment-intent-${product?.uuid}`, "1");
      } catch {}
      openLoginModal();
      return;
    }

    // Check if user has firstName and lastName
    if (!user.firstName || !user.lastName) {
      setShowUserInfoModal(true);
      return;
    }

    await submitCommentCore();
  }

  const handleUserInfoComplete = () => {
    setShowUserInfoModal(false);
    // Immediately create the comment after user info is completed
    void submitCommentCore();
  };

  // Auto-scroll to comments section when pending comment is processed
  useEffect(() => {
    if (pendingComment) {
      const commentsSection =
        document.querySelector('[data-tab="reviews-content"]') ||
        document.querySelector('[data-tab="reviews"]');
      if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [pendingComment]);
  return (
    <Tabs
      value={tabValue}
      onValueChange={setTabValue}
      className="mb-16"
      dir="rtl"
    >
      {/* -------- tab bar -------- */}
      <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto mb-8">
        <TabsTrigger value="description">توضیحات</TabsTrigger>
        <TabsTrigger value="specifications">مشخصات</TabsTrigger>
        <TabsTrigger value="reviews" data-tab="reviews">
          نظرات
        </TabsTrigger>
      </TabsList>

      {/* -------- توضیحات -------- */}
      <TabsContent value="description" className="mt-4">
        <div className="rounded-2xl p-6 shadow-sm bg-background">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            درباره این محصول
          </h2>

          {product?.detail?.description ? (
            <div className="rounded-xl p-5 shadow-sm border bg-muted">
              <div
                className="prose prose-lg max-w-none leading-relaxed text-justify dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: product.detail.description,
                }}
              />
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              توضیحی برای این محصول ثبت نشده است.
            </p>
          )}
        </div>
      </TabsContent>

      {/* -------- مشخصات -------- */}
      <TabsContent value="specifications" className="mt-4">
        <div className="rounded-2xl p-6 shadow-sm bg-background">
          <h3 className="mb-6 text-2xl font-bold text-foreground">
            مشخصات فنی
          </h3>

          {Object.keys(product?.detail?.specifications ?? {}).length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(product.detail!.specifications!).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl p-4 shadow-sm border bg-muted"
                  >
                    <div className="mb-1 text-sm text-muted-foreground">
                      {key} :
                    </div>
                    <div className="text-base text-foreground">
                      {Array.isArray(value) ? value.join("، ") : String(value)}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              مشخصات فنی این محصول در دسترس نیست.
            </p>
          )}
        </div>
      </TabsContent>

      {/* -------- نظرات (Comments) -------- */}
      <TabsContent value="reviews" className="mt-4" data-tab="reviews-content">
        <div className="rounded-2xl p-6 shadow-sm bg-background">
          <h3 className="mb-6 text-xl font-bold text-foreground">
            نظرات کاربران
          </h3>

          {/* Submit comment */}
          <form onSubmit={handleSubmit} className="mb-6 space-y-2">
            <div className="rounded-xl border bg-muted/40 focus-within:ring-2 focus-within:ring-primary/40 transition">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, maxLength))}
                placeholder="نظر خود را بنویسید..."
                rows={4}
                className="border-0 bg-transparent focus-visible:ring-0"
              />
              <div className="flex items-center justify-between px-3 pb-2 text-xs text-muted-foreground">
                <span>
                  {text.trim().length
                    ? "نظر شما آماده ارسال است."
                    : "نظر محترمانه و مرتبط با محصول ثبت کنید."}
                </span>
                <span>
                  {text.length}/{maxLength}
                </span>
              </div>
            </div>
            {!/^[0-9a-fA-F-]{36}$/.test(product?.uuid || "") && (
              <p className="text-xs text-destructive">
                شناسه محصول نامعتبر است.
              </p>
            )}
            {text.trim().length > 0 && text.trim().length < 3 && (
              <p className="text-xs text-destructive">
                متن نظر حداقل ۳ کاراکتر باشد.
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setText("")}
                disabled={submitting || text.length === 0}
                className="rounded-full"
              >
                پاک کردن
              </Button>
              <Button
                type="submit"
                disabled={
                  submitting ||
                  !/^[0-9a-fA-F-]{36}$/.test(product?.uuid || "") ||
                  text.trim().length < 3
                }
                className="rounded-full"
              >
                {submitting ? "در حال ارسال..." : "ارسال نظر"}
              </Button>
            </div>
          </form>

          {/* Comments list */}
          {loading ? (
            <div className="space-y-4 py-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>مجموع نظرات: {comments.length}</span>
              </div>
              {comments.map((c) => (
                <div
                  key={c.uuid}
                  className="rounded-xl border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                      {(c.user?.firstName + " " + c.user?.lastName || "? ")
                        .trim()
                        .slice(0, 1)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                          {c.user?.firstName + " " + c.user?.lastName ||
                            "کاربر"}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(c.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 leading-7 text-foreground whitespace-pre-line">
                        {c.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              هنوز نظری برای این محصول ثبت نشده است.
            </p>
          )}
        </div>
      </TabsContent>

      <CommentUserInfoModal
        open={showUserInfoModal}
        onOpenChange={setShowUserInfoModal}
        user={user}
        onComplete={handleUserInfoComplete}
      />
    </Tabs>
  );
}
