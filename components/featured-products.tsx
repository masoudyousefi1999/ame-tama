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
        const products = await getAllProducts();

        if (products) {
          setProducts(products as any);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "خطا در بارگذاری محصولات",
          description:
            "امکان بارگذاری محصولات وجود ندارد. لطفاً دوباره تلاش کنید.",
          variant: "destructive",
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
        title: "محصول به سبد خرید اضافه شد",
        description: `${product.name} به سبد خرید شما اضافه شد.`,
      });
    } catch (error) {
      toast({
        title: "خطا در افزودن به سبد خرید",
        description: "امکان افزودن محصول به سبد خرید وجود ندارد.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <section id="featured-products" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* ───── header ───── */}
          <div className="mb-12 text-center">
            <h2 className="font-vazirmatn text-primary text-3xl font-bold mb-4">
              مجسمه‌های لوکس ویژه
            </h2>
            <p className="mx-auto max-w-2xl font-vazirmatn text-muted-foreground">
              در حال بارگذاری محصولات...
            </p>
          </div>

          {/* ───── skeleton grid ───── */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="mb-4 h-64 rounded-lg bg-muted" />
                <div className="mb-2 h-4 rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-products" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* ───── header ───── */}
        <div className="mb-12 text-center">
          <h2 className="font-vazirmatn text-primary text-3xl font-bold mb-4">
            مجسمه‌های لوکس ویژه
          </h2>
          <p className="mx-auto max-w-2xl font-vazirmatn text-muted-foreground">
            محبوب‌ترین کالکشن‌های ما را کاوش کنید، هر کدام شاهکاری از جزئیات و
            صنعتگری.
          </p>
        </div>

        {/* ───── products grid ───── */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                  product={product as any}
                  showAddToCart
                  showAddToWishlist
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="font-vazirmatn text-muted-foreground">
                هیچ محصولی یافت نشد
              </p>
            </div>
          )}
        </div>

        {/* ───── CTA ───── */}
        <div className="mt-12 text-center">
          <Link href="/shop">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-border font-vazirmatn hover:bg-accent hover:text-accent-foreground"
            >
              مشاهده همه مجسمه‌های لوکس
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
