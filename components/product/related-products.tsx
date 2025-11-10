"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRelatedProducts, IProductType } from "@/lib/products";
import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  uuid: string;
}

// Cache for related products to prevent duplicate calls
const relatedProductsCache = new Map<string, IProductType[]>();
const pendingRequests = new Map<
  string,
  Promise<{ products: IProductType[]; totalCount: number }>
>();

export default function RelatedProducts({ uuid }: RelatedProductsProps) {
  const [products, setProducts] = useState<IProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchProducts = async () => {
      // Check cache first
      if (relatedProductsCache.has(uuid)) {
        setProducts(relatedProductsCache.get(uuid)!);
        setLoading(false);
        return;
      }

      // Check if request is already pending
      if (pendingRequests.has(uuid)) {
        try {
          const result = await pendingRequests.get(uuid)!;
          setProducts(result.products);
          relatedProductsCache.set(uuid, result.products);
        } catch (error) {
          console.error("Error fetching related products:", error);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Make new request
      setLoading(true);
      const requestPromise = getRelatedProducts(uuid, 1, 5);
      pendingRequests.set(uuid, requestPromise);

      try {
        const result = await requestPromise;
        setProducts(result.products);
        relatedProductsCache.set(uuid, result.products);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        pendingRequests.delete(uuid);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [uuid]);

  if (loading) {
    return (
      <section className="mb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            محصولات مشابه
          </h2>
        </div>
        <div className="grid grid-flow-col auto-cols-[80%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:auto-cols-[24%] gap-4 overflow-x-auto pb-2">
          {/* {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="snap-start">
              <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full"></div>
            </div>
          ))} */}
        </div>
      </section>
    );
  }

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
