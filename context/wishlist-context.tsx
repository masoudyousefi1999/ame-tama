"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"

// Define the product type
export interface WishlistProduct {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: { id: number; url: string; alt: string }[]
  rating?: number
  inStock?: boolean
  category?: string
  type?: string
}

// Define the context type
interface WishlistContextType {
  wishlist: WishlistProduct[]
  addToWishlist: (product: WishlistProduct) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  clearWishlist: () => void
}

// Create context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// Provider component
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([])
  const { toast } = useToast()
  const { user } = useAuth()

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist-${user.id}`)
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist))
        } catch (error) {
          console.error("Failed to parse wishlist from localStorage:", error)
        }
      }
    }
  }, [user])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user && wishlist.length > 0) {
      localStorage.setItem(`wishlist-${user.id}`, JSON.stringify(wishlist))
    }
  }, [wishlist, user])

  // Add product to wishlist
  const addToWishlist = (product: WishlistProduct) => {
    if (!user) {
      toast({
        title: "لطفا وارد شوید",
        description: "برای افزودن محصول به علاقه‌مندی‌ها، ابتدا وارد حساب کاربری خود شوید.",
        variant: "destructive",
      })
      return
    }

    if (!isInWishlist(product.id)) {
      setWishlist((prev) => [...prev, product])
      toast({
        title: "به علاقه‌مندی‌ها اضافه شد",
        description: `${product.name} به لیست علاقه‌مندی‌های شما اضافه شد.`,
      })
    } else {
      toast({
        title: "قبلاً اضافه شده",
        description: "این محصول قبلاً به لیست علاقه‌مندی‌های شما اضافه شده است.",
      })
    }
  }

  // Remove product from wishlist
  const removeFromWishlist = (productId: number) => {
    const product = wishlist.find((item) => item.id === productId)
    setWishlist((prev) => prev.filter((item) => item.id !== productId))

    if (product) {
      toast({
        title: "از علاقه‌مندی‌ها حذف شد",
        description: `${product.name} از لیست علاقه‌مندی‌های شما حذف شد.`,
      })
    }
  }

  // Check if product is in wishlist
  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.id === productId)
  }

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([])
    if (user) {
      localStorage.removeItem(`wishlist-${user.id}`)
    }
  }

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
  )
}

// Custom hook to use the wishlist context
export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
