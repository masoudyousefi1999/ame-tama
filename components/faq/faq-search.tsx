"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface FAQSearchProps {
  onSearch: (query: string) => void
}

export function FAQSearch({ onSearch }: FAQSearchProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative mb-8">
      <div className="relative">
        <Input
          type="text"
          placeholder="جستجوی سوالات..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pr-10 pl-20 py-6 text-lg"
        />
        <Button type="submit" size="sm" className="absolute left-1 top-1/2 transform -translate-y-1/2">
          جستجو
        </Button>
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      </div>
    </form>
  )
}
