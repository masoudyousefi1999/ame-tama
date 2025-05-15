"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { cn } from "@/lib/utils"

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart()

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart Button */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full relative"
        onClick={toggleDropdown}
        aria-label="سبد خرید"
      >
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>

      {/* Cart Dropdown */}
      <div
        className={cn(
          "absolute left-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 transition-all duration-300 transform origin-top",
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none",
        )}
      >
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-lg font-vazirmatn">سبد خرید</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">بستن</span>
          </Button>
        </div>

        {/* Cart Content */}
        <div className="max-h-80 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-vazirmatn">سبد خرید شما خالی است</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-x-4 gap-x-reverse">
                  {/* Product Image */}
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 mr-4">
                    <h4 className="text-sm font-medium font-vazirmatn">{item.name}</h4>
                    <div className="flex items-center mt-1">
                      <button
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="کاهش تعداد"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="mx-2 text-sm font-vazirmatn">
                        {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                      </span>
                      <button
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="افزایش تعداد"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-medium font-vazirmatn">
                        {new Intl.NumberFormat("fa-IR").format(item.price * item.quantity)} تومان
                      </span>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                        aria-label="حذف محصول"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between mb-4">
              <span className="font-vazirmatn">مجموع:</span>
              <span className="font-semibold font-vazirmatn">
                {new Intl.NumberFormat("fa-IR").format(subtotal)} تومان
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/cart"
                className="bg-white text-purple-600 border border-purple-600 hover:bg-purple-50 rounded-full py-2 px-4 text-center text-sm font-medium transition-colors font-vazirmatn"
                onClick={() => setIsOpen(false)}
              >
                مشاهده سبد خرید
              </Link>
              <Link
                href="/checkout"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full py-2 px-4 text-center text-sm font-medium transition-colors font-vazirmatn"
                onClick={() => setIsOpen(false)}
              >
                تسویه حساب
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
