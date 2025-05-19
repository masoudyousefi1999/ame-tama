"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import SearchModal from "@/components/search/search-modal"
import { useMediaQuery } from "@/hooks/use-media-query"
import { usePathname } from "next/navigation"

interface SearchBarProps {
  isScrolled?: boolean
}

export default function SearchBar({ isScrolled = false }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const pathname = usePathname()

  // Focus on search field when opened
  useEffect(() => {
    if ((isOpen || isMobileSearchOpen) && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, isMobileSearchOpen])

  // Close search when route changes
  useEffect(() => {
    setIsMobileSearchOpen(false)
    setIsOpen(false)
    setQuery("")
  }, [pathname])

  // Close mobile search with Escape key
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

  // Handle clicks outside the search container
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isMobileSearchOpen && searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        // Don't close if clicking on the search toggle button
        const target = e.target as HTMLElement
        if (target.closest("[data-search-toggle]")) {
          return
        }
        setIsMobileSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [isMobileSearchOpen])

  // Open search modal when typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 0) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  // Clear search field
  const clearSearch = () => {
    setQuery("")
    setIsOpen(false)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Toggle mobile search
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

  // Handle cancel button click
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMobileSearchOpen(false)
    setIsOpen(false)
    setQuery("")
  }

  // Show search button in mobile
  if (!isDesktop && !isMobileSearchOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={toggleMobileSearch}
        aria-label="جستجو"
        data-search-toggle="true"
      >
        <Search className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <>
      <div
        ref={searchContainerRef}
        className={cn(
          "relative flex items-center transition-all duration-300",
          isDesktop ? "w-full max-w-md" : "fixed inset-x-0 top-0 z-[100] p-3 shadow-md",
          !isDesktop && !isScrolled && "bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm",
          !isDesktop && isScrolled && "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm",
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
            className={cn(
              "w-full pr-10 pl-10 rounded-full border-gray-300 dark:border-gray-700 font-vazirmatn text-right",
              !isScrolled && "bg-white/90 dark:bg-gray-800/90",
              isScrolled && "bg-white/90 dark:bg-gray-900/90",
            )}
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
          <Button variant="ghost" size="sm" className="mr-2 font-vazirmatn" onClick={handleCancel}>
            لغو
          </Button>
        )}
      </div>

      <SearchModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          if (!isDesktop) {
            setIsMobileSearchOpen(false)
          }
        }}
        query={query}
        onQueryChange={setQuery}
      />
    </>
  )
}
