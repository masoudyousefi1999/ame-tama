"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  name: string
  path: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex items-center text-sm text-gray-500 dark:text-gray-400", className)}
    >
      <ol className="flex items-center gap-x-2 gap-x-reverse">
        <li>
          <Link href="/" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn">
            خانه
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={item.path} className="flex items-center">
            <ChevronLeft className="h-4 w-4 mx-1" />
            {index === items.length - 1 ? (
              <span className="text-gray-900 dark:text-gray-100 font-medium font-vazirmatn" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.path}
                className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors font-vazirmatn"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
