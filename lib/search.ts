import { getAllProducts } from "@/lib/products"

// نوع داده نتیجه جستجو
export interface SearchResult {
  id: number
  name: string
  price: number
  image: string
  category: string
  isNew: boolean
  isLimited: boolean
  description?: string
  releaseDate: string
}

// جستجوی محصولات
export function searchProducts(query: string, categories: string[] | null = null): SearchResult[] {
  if (!query && !categories?.length) {
    return getAllProducts().map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || "/placeholder.svg",
      category: product.category,
      isNew: product.isNew,
      isLimited: product.isLimited,
      description: product.description,
      releaseDate: product.releaseDate,
    }))
  }

  const products = getAllProducts()
  const normalizedQuery = query.toLowerCase().trim()

  return products
    .filter((product) => {
      // فیلتر بر اساس دسته‌بندی
      if (categories?.length && !categories.includes(product.category)) {
        return false
      }

      // اگر کوئری خالی باشد و فقط فیلتر دسته‌بندی داشته باشیم
      if (!normalizedQuery) {
        return true
      }

      // جستجو در نام محصول
      if (product.name.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      // جستجو در توضیحات محصول
      if (product.description?.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      // جستجو در دسته‌بندی محصول
      if (product.category.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      // جستجو در نام شخصیت
      if (product.character?.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      // جستجو در نام سری
      if (product.series?.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      return false
    })
    .map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || "/placeholder.svg",
      category: product.category,
      isNew: product.isNew,
      isLimited: product.isLimited,
      description: product.description,
      releaseDate: product.releaseDate,
    }))
}

// جستجوی پیشنهادات
export function getSearchSuggestions(query: string): string[] {
  if (!query) return []

  const products = getAllProducts()
  const normalizedQuery = query.toLowerCase().trim()
  const suggestions = new Set<string>()

  products.forEach((product) => {
    if (product.name.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(product.name)
    }
    if (product.category.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(product.category)
    }
    if (product.character?.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(product.character)
    }
    if (product.series?.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(product.series)
    }
  })

  return Array.from(suggestions).slice(0, 5)
}
