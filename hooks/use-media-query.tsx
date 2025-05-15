"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // تنظیم مقدار اولیه
    setMatches(media.matches)

    // تابع برای به‌روزرسانی وضعیت
    const listener = () => {
      setMatches(media.matches)
    }

    // اضافه کردن event listener
    media.addEventListener("change", listener)

    // پاک کردن event listener
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}
