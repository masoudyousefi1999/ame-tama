"use client"

import Link from "next/link"
import { ChevronLeft, Home } from "lucide-react"

interface ProductBreadcrumbProps {
  category: {
    id: number
    name: string
    slug: string
  }
  productName: string
}

export default function ProductBreadcrumb({ category, productName }: ProductBreadcrumbProps) {
  return (
    <nav className="flex mb-6 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 space-x-reverse">
        <li>
          <Link
            href="/"
            className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">خانه</span>
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </li>
        <li>
          <Link
            href={`/category/${category.slug}`}
            className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors font-vazirmatn"
          >
            {category.name}
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </li>
        <li>
          <span className="text-gray-900 dark:text-gray-100 font-vazirmatn line-clamp-1" aria-current="page">
            {productName}
          </span>
        </li>
      </ol>
    </nav>
  )
}
