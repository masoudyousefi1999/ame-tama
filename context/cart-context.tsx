"use client";

import {
  decreaseOrderItem,
  getUserOrder,
  increaseOrderItem,
} from "@/lib/order";
import { IProductType } from "@/lib/products";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "@/components/ui/use-toast";

// تعریف نوع محصول در سبد خرید
export interface CartItem {
  product: IProductType;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  uuid: string;
}

// تعریف نوع context سبد خرید
interface CartContextType {
  items: CartItem[];
  addItem: (productUuid: string, quantity: number) => void;
  updateQuantity: (
    productUuid: string,
    quantity: number,
    type: "increase" | "decrease"
  ) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  applyDiscount: (code: string) => boolean;
  recentlyAdded: string | null;
  isLoading: boolean;
  isInitialized: boolean;
}

// ایجاد context با مقدار پیش‌فرض
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotal: 0,
  discount: 0,
  total: 0,
  applyDiscount: () => false,
  recentlyAdded: null,
  isLoading: false,
  isInitialized: false,
});

// کدهای تخفیف معتبر (در یک پروژه واقعی، این داده‌ها از سرور دریافت می‌شوند)
const validDiscountCodes = [
  { code: "WELCOME10", percentage: 10 },
  { code: "SUMMER20", percentage: 20 },
  { code: "ANIME30", percentage: 30 },
];

export function CartProvider({ children }: { children: ReactNode }) {
  // وضعیت سبد خرید
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  // بارگذاری سبد خرید از localStorage در هنگام اولین رندر
  useEffect(() => {
    let isMounted = true;

    const getOrder = async () => {
      try {
        setIsLoading(true);
        // Check localStorage first for immediate UI feedback
        const cachedCart = localStorage.getItem("ame-tama-cart");
        if (cachedCart && isMounted) {
          try {
            const parsedCart = JSON.parse(cachedCart);
            setItems(parsedCart.items || []);
            setDiscount(parsedCart.discount || 0);
          } catch (error) {
            // Silent error handling for localStorage parsing issues
            localStorage.removeItem("ame-tama-cart");
          }
        }

        // Then fetch fresh data from server
        const userCart = await getUserOrder();
        if (isMounted) {
          const cartData = {
            items: userCart?.items || [],
            discount: 0,
          };
          setItems(cartData.items);
          setDiscount(cartData.discount);
          localStorage.setItem("ame-tama-cart", JSON.stringify(cartData));
          setIsInitialized(true);
        }
      } catch (error) {
        // Silent error handling - 401/403 are expected for unauthenticated users
        if (isMounted) {
          setItems([]);
          setIsInitialized(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getOrder();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (recentlyAdded !== null) {
      const timer = setTimeout(() => {
        setRecentlyAdded(null);
      }, 200000);
      return () => clearTimeout(timer);
    }
  }, [recentlyAdded]);

  // محاسبه تعداد کل محصولات در سبد خرید
  const itemCount =
    items?.length > 0
      ? items.reduce((total, item) => total + item.quantity, 0)
      : 0;

  // محاسبه مجموع قیمت محصولات
  const subtotal =
    itemCount > 0
      ? items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      : 0;

  // محاسبه مبلغ تخفیف
  const discountAmount = (subtotal * discount) / 100;

  // محاسبه مجموع نهایی
  const total = subtotal - discountAmount;

  // افزودن محصول به سبد خرید
  const addItem = async (productUuid: string, quantity: number) => {
    try {
      setIsLoading(true);
      await increaseOrderItem({
        productId: productUuid,
        quantity,
      });
      const updatedCart = await getUserOrder();
      const newItems = updatedCart?.items || [];
      setItems(newItems);
      setRecentlyAdded(productUuid);

      // Update localStorage
      const cartData = {
        items: newItems,
        discount,
      };
      localStorage.setItem("ame-tama-cart", JSON.stringify(cartData));
    } catch (error) {
      // Silent error handling - show user-friendly error via toast instead
      toast({
        variant: "error",
        title: "خطا در افزودن محصول",
        description: "مشکلی در افزودن محصول به سبد خرید رخ داد.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const decreaseItem = async (productUuid: string, quantity: number) => {
    try {
      setIsLoading(true);
      await decreaseOrderItem({
        productId: productUuid,
        quantity,
      });
      const updatedCart = await getUserOrder();
      const newItems = updatedCart?.items || [];
      setItems(newItems);

      // Update localStorage
      const cartData = {
        items: newItems,
        discount,
      };
      localStorage.setItem("ame-tama-cart", JSON.stringify(cartData));
    } catch (error) {
      // Silent error handling - show user-friendly error via toast instead
      toast({
        variant: "error",
        title: "خطا در به‌روزرسانی سبد خرید",
        description: "مشکلی در به‌روزرسانی تعداد محصول رخ داد.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // به‌روزرسانی تعداد محصول در سبد خرید
  const updateQuantity = async (
    productUuid: string,
    quantity: number,
    type: "decrease" | "increase"
  ) => {
    if (type === "decrease") {
      await decreaseItem(productUuid, quantity);
    } else {
      await addItem(productUuid, quantity);
    }
  };

  // پاک کردن کل سبد خرید
  const clearCart = () => {
    setItems([]);
    setDiscount(0);
    localStorage.removeItem("ame-tama-cart");
  };

  // اعمال کد تخفیف
  const applyDiscount = (code: string): boolean => {
    const discountCode = validDiscountCodes.find(
      (dc) => dc.code.toLowerCase() === code.toLowerCase()
    );

    if (discountCode) {
      setDiscount(discountCode.percentage);
      return true;
    }

    return false;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discount,
        total,
        applyDiscount,
        recentlyAdded,
        isLoading,
        isInitialized,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// هوک سفارشی برای استفاده آسان از context سبد خرید
export function useCart() {
  return useContext(CartContext);
}
