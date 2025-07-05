"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { getAllProducts, IProductType } from "@/lib/products";
import { toast } from "@/components/ui/use-toast";
import { ProductCard } from "@/components/product/product-card";

export default function FeaturedProducts() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<IProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = (await getAllProducts(2, 6)) as any;

        const { products } = result;

        if (products) {
          setProducts(products as any);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          variant: "error",
          title: "خطا در بارگذاری محصولات",
          description:
            "امکان بارگذاری محصولات وجود ندارد. لطفاً دوباره تلاش کنید.",
          duration: 2000,
        });
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addProductToCart = (product: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      addItem(product, 1);
      toast({
        variant: "cart",
        title: "محصول به سبد خرید اضافه شد",
        description: `${product.name} به سبد خرید شما اضافه شد.`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        variant: "error",
        title: "خطا در افزودن به سبد خرید",
        description: "امکان افزودن محصول به سبد خرید وجود ندارد.",
        duration: 2000,
      });
    }
  };

  if (loading) {
    return (
      <section id="featured-products" className="py-10">
        <div className="container mx-auto px-2 md:px-4">
          {/* ───── header ───── */}
          <div className="mb-6 text-center">
            <h2 className="text-primary text-2xl font-bold mb-2">
              مجسمه‌های لوکس ویژه
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground text-sm">
              در حال بارگذاری محصولات...
            </p>
          </div>

          {/* ───── skeleton grid ───── */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="mb-2 h-40 rounded-lg bg-muted" />
                <div className="mb-1 h-3 rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-products" className="py-10">
      <div className="container mx-auto px-2 md:px-4">
        {/* ───── header ───── */}
        <div className="mb-6 text-center">
          <h2 className="text-primary text-2xl font-bold mb-2">
            مجسمه‌های لوکس ویژه
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground text-sm">
            محبوب‌ترین کالکشن‌های ما را کاوش کنید، هر کدام شاهکاری از جزئیات و
            صنعتگری.
          </p>
        </div>

        {/* ───── products grid ───── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <motion.div
                key={product.uuid}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  showAddToCart
                  showAddToWishlist
                  className="h-full"
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center">
              <p className="text-muted-foreground">هیچ محصولی یافت نشد</p>
            </div>
          )}
        </div>

        {/* ───── CTA ───── */}
        <div className="mt-10 text-center">
          <Link href="/shop">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-border hover:bg-accent hover:text-accent-foreground"
            >
              مشاهده همه مجسمه‌های لوکس
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
