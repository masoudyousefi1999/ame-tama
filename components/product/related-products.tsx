"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRelatedProducts, IProductType } from "@/lib/products";
import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  uuid: string;
}

export default function RelatedProducts({ uuid }: RelatedProductsProps) {
  const [products, setProducts] = useState<IProductType[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getRelatedProducts(uuid, 1, 5);
      setProducts(products.products);
    };
    fetchProducts();
  }, [uuid]);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      {/* Heading & arrows */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          محصولات مشابه
        </h2>

        <div className="flex gap-x-2 rtl:gap-x-reverse">
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">قبلی</span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">بعدی</span>
          </Button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-flow-col auto-cols-[80%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:auto-cols-[24%] gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
        {products.map((product) => (
          <div key={product.uuid} className="snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
