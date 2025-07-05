"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";
import { IProductType } from "@/lib/products";

// Define the product type
export interface WishlistProduct extends IProductType {}

// Define the context type
interface WishlistContextType {
  wishlist: WishlistProduct[];
  addToWishlist: (product: WishlistProduct) => void;
  removeFromWishlist: (productUuid: string) => void;
  isInWishlist: (productUuid: string) => boolean;
  clearWishlist: () => void;
}

// Create context
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// Provider component
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist-${user.uuid}`);
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist));
        } catch (error) {
          console.error("Failed to parse wishlist from localStorage:", error);
        }
      }
    }
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user && wishlist.length > 0) {
      localStorage.setItem(`wishlist-${user.uuid}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  // Add product to wishlist
  const addToWishlist = (product: WishlistProduct) => {
    if (!user) {
      toast({
        variant: "info",
        title: "لطفا وارد شوید",
        description:
          "برای افزودن محصول به علاقه‌مندی‌ها، ابتدا وارد حساب کاربری خود شوید.",
        duration: 2000,
      });
      return;
    }

    if (!isInWishlist(product.uuid)) {
      setWishlist((prev) => [...prev, product]);
      toast({
        variant: "wishlist",
        title: "به علاقه‌مندی‌ها اضافه شد",
        description: `${product.name} به لیست علاقه‌مندی‌های شما اضافه شد.`,
        duration: 2000,
      });
    } else {
      toast({
        variant: "info",
        title: "قبلاً اضافه شده",
        description:
          "این محصول قبلاً به لیست علاقه‌مندی‌های شما اضافه شده است.",
        duration: 2000,
      });
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = (productUuid: string) => {
    const product = wishlist.find((item) => item.uuid === productUuid);
    setWishlist((prev) => prev.filter((item) => item.uuid !== productUuid));

    if (product) {
      toast({
        variant: "wishlist",
        title: "از علاقه‌مندی‌ها حذف شد",
        description: `${product.name} از لیست علاقه‌مندی‌های شما حذف شد.`,
        duration: 2000,
      });
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productUuid: string) => {
    return wishlist.some((item) => item.uuid === productUuid);
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([]);
    if (user) {
      localStorage.removeItem(`wishlist-${user.uuid}`);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// Custom hook to use the wishlist context
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
