"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { ErrorMessage } from "@/components/ui/error-message"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorMessage
          title="خطایی رخ داد"
          message="متأسفانه خطایی در نمایش این بخش رخ داده است. لطفاً صفحه را بارگذاری مجدد کنید."
          retry={() => window.location.reload()}
        />
      )
    }

    return this.props.children
  }
}
