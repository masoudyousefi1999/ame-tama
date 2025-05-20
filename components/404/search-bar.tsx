"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="جستجوی محصولات..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pr-10 rounded-full border-gray-300 dark:border-gray-700 font-vazirmatn text-right"
        dir="rtl"
      />
      <Button type="submit" size="sm" className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full h-8 px-3">
        جستجو
      </Button>
    </form>
  )
}
