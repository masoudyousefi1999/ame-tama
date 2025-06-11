"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getAllProducts, getProductByCategorySlug } from "@/lib/products"
import { toast } from "@/components/ui/use-toast"
import  ProductGrid  from "@/components/shop/product-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface ShopPageClientProps {
  initialProducts: any[]
  categories: any[]
  totalPages: number
  currentPage: number
  currentCategory?: string
  currentSearch?: string
}

export default function ShopPageClient({
  initialProducts,
  totalPages: initialTotalPages,
  currentSearch,
}: ShopPageClientProps) {
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [searchTerm, setSearchTerm] = useState(currentSearch || "")

  const router = useRouter()
  const searchParams = useSearchParams()

  const fetchProducts = async (page: number, category?: string, search?: string) => {
    try {
      setLoading(true)
      let fetchedProducts

      if (category) {
        fetchedProducts = await getProductByCategorySlug(category)
      } else {
        fetchedProducts = await getAllProducts()
      }

      setProducts((fetchedProducts as any)?.products || [])
      setTotalPages((fetchedProducts as any)?.totalPages || 1)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "خطا در بارگذاری محصولات",
        description: "امکان بارگذاری محصولات وجود ندارد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      })
      setProducts([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }
    params.delete("page")
    router.push(`/shop?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) {
      params.set("search", searchTerm)
    } else {
      params.delete("search")
    }
    params.delete("page")
    router.push(`/shop?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 font-vazirmatn">فروشگاه</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="جستجو در محصولات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* Category Filters */}
        {/* <CategoryFilters
          categories={categories}
          selectedCategory={currentCategory}
          onCategoryChange={handleCategoryChange}
        /> */}
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        // currentPage={currentPage}
        // totalPages={totalPages}
        // onPageChange={handlePageChange}
      />
    </div>
  )
}
