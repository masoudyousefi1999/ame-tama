"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  title?: string
  message: string
  retry?: () => void
}

export function ErrorMessage({ title = "خطا", message, retry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium mb-2 font-vazirmatn">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4 font-vazirmatn">{message}</p>
      {retry && (
        <Button onClick={retry} variant="outline" className="font-vazirmatn">
          تلاش مجدد
        </Button>
      )}
    </div>
  )
}
