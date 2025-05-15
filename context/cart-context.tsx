"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// تعریف نوع محصول در سبد خرید
export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

// تعریف نوع context سبد خرید
interface CartContextType {
  items: CartItem[]
  addItem: (product: any, quantity: number) => void
  updateQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  discount: number
  total: number
  applyDiscount: (code: string) => boolean
}

// ایجاد context با مقدار پیش‌فرض
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotal: 0,
  discount: 0,
  total: 0,
  applyDiscount: () => false,
})

// کدهای تخفیف معتبر (در یک پروژه واقعی، این داده‌ها از سرور دریافت می‌شوند)
const validDiscountCodes = [
  { code: "WELCOME10", percentage: 10 },
  { code: "SUMMER20", percentage: 20 },
  { code: "ANIME30", percentage: 30 },
]

export function CartProvider({ children }: { children: ReactNode }) {
  // وضعیت سبد خرید
  const [items, setItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState<number>(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // بارگذاری سبد خرید از localStorage در هنگام اولین رندر
  useEffect(() => {
    const storedCart = localStorage.getItem("ame-tama-cart")
    const storedDiscount = localStorage.getItem("ame-tama-discount")

    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
        setItems([])
      }
    }

    if (storedDiscount) {
      try {
        setDiscount(JSON.parse(storedDiscount))
      } catch (error) {
        console.error("Error parsing discount from localStorage:", error)
        setDiscount(0)
      }
    }

    setIsInitialized(true)
  }, [])

  // ذخیره سبد خرید در localStorage هر زمان که تغییر می‌کند
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("ame-tama-cart", JSON.stringify(items))
      localStorage.setItem("ame-tama-discount", JSON.stringify(discount))
    }
  }, [items, discount, isInitialized])

  // محاسبه تعداد کل محصولات در سبد خرید
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // محاسبه مجموع قیمت محصولات
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  // محاسبه مبلغ تخفیف
  const discountAmount = (subtotal * discount) / 100

  // محاسبه مجموع نهایی
  const total = subtotal - discountAmount

  // افزودن محصول به سبد خرید
  const addItem = (product: any, quantity: number) => {
    setItems((prevItems) => {
      // بررسی اینکه آیا محصول قبلاً در سبد خرید وجود دارد
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id)

      if (existingItemIndex !== -1) {
        // اگر محصول وجود دارد، تعداد آن را افزایش می‌دهیم
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // اگر محصول وجود ندارد، آن را به سبد خرید اضافه می‌کنیم
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0]?.url || product.image || "/placeholder.svg",
            quantity,
          },
        ]
      }
    })
  }

  // به‌روزرسانی تعداد محصول در سبد خرید
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // حذف محصول از سبد خرید
  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // پاک کردن کل سبد خرید
  const clearCart = () => {
    setItems([])
    setDiscount(0)
  }

  // اعمال کد تخفیف
  const applyDiscount = (code: string): boolean => {
    const discountCode = validDiscountCodes.find((dc) => dc.code.toLowerCase() === code.toLowerCase())

    if (discountCode) {
      setDiscount(discountCode.percentage)
      return true
    }

    return false
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        discount,
        total,
        applyDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// هوک سفارشی برای استفاده آسان از context سبد خرید
export function useCart() {
  return useContext(CartContext)
}
