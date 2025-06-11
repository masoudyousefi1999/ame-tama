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
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  // بارگذاری سبد خرید از localStorage در هنگام اولین رندر
  useEffect(() => {
    let userCart;
    const getOrder = async () => {
      userCart = await getUserOrder();
      if (userCart) {
        setItems(userCart.items);
      }
    };
    getOrder();

    // if (storedDiscount) {
    //   try {
    //     setDiscount(JSON.parse(storedDiscount));
    //   } catch (error) {
    //     console.error("Error parsing discount from localStorage:", error);
    //     setDiscount(0);
    //   }
    // }

    setIsInitialized(true);
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
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // محاسبه مجموع قیمت محصولات
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // محاسبه مبلغ تخفیف
  const discountAmount = (subtotal * discount) / 100;

  // محاسبه مجموع نهایی
  const total = subtotal - discountAmount;

  // افزودن محصول به سبد خرید
  const addItem = async (productUuid: string, quantity: number) => {
    await increaseOrderItem({
      productId: productUuid,
      quantity,
    });
    const updatedCart = await getUserOrder();
    if (updatedCart) {
      setItems(updatedCart.items);
    }
    setRecentlyAdded(productUuid);
  };

  const decreaseItem = async (productUuid: string, quantity: number) => {
    await decreaseOrderItem({
      productId: productUuid,
      quantity,
    });
    const updatedCart = await getUserOrder();
    if (updatedCart) {
      setItems(updatedCart.items);
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
