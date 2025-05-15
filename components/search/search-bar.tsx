"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import SearchModal from "@/components/search/search-modal"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // فوکوس روی فیلد جستجو هنگام باز شدن
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // بستن جستجوی موبایل با کلید Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileSearchOpen(false)
        setIsOpen(false)
        setQuery("")
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  // باز کردن مودال جستجو هنگام تایپ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 0) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  // پاک کردن فیلد جستجو
  const clearSearch = () => {
    setQuery("")
    setIsOpen(false)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // باز/بسته کردن جستجوی موبایل
  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen)
    if (!isMobileSearchOpen) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 100)
    } else {
      setQuery("")
      setIsOpen(false)
    }
  }

  // نمایش دکمه جستجو در موبایل
  if (!isDesktop && !isMobileSearchOpen) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleMobileSearch} aria-label="جستجو">
        <Search className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <>
      <div
        className={cn(
          "relative flex items-center transition-all duration-300",
          isDesktop ? "w-full max-w-md" : "fixed inset-x-0 top-0 z-50 bg-white dark:bg-gray-900 p-3 shadow-md",
        )}
      >
        <div className="relative w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="جستجوی محصولات..."
            value={query}
            onChange={handleInputChange}
            className="w-full pr-10 pl-10 rounded-full border-gray-300 dark:border-gray-700 font-vazirmatn text-right"
            dir="rtl"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
              onClick={clearSearch}
            >
              <X className="h-4 w-4 text-gray-400" />
              <span className="sr-only">پاک کردن جستجو</span>
            </Button>
          )}
        </div>

        {!isDesktop && (
          <Button variant="ghost" size="sm" className="mr-2 font-vazirmatn" onClick={toggleMobileSearch}>
            لغو
          </Button>
        )}
      </div>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} query={query} onQueryChange={setQuery} />
    </>
  )
}
