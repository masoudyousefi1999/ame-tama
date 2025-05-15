interface PersianDateProps {
  date: Date | string
  format?: "short" | "medium" | "long" | "full"
  className?: string
}

export function PersianDate({ date, format = "medium", className }: PersianDateProps) {
  const formatDate = () => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date

      // تبدیل به تاریخ شمسی با استفاده از API های داخلی مرورگر
      const options: Intl.DateTimeFormatOptions = {
        calendar: "persian",
        numberingSystem: "latn",
      }

      switch (format) {
        case "short":
          Object.assign(options, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })
          break
        case "medium":
          Object.assign(options, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          break
        case "long":
          Object.assign(options, {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })
          break
        case "full":
          Object.assign(options, {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
            hour: "numeric",
            minute: "numeric",
          })
          break
      }

      return new Intl.DateTimeFormat("fa-IR", options).format(dateObj)
    } catch (error) {
      console.error("Error formatting date to Persian:", error)
      return String(date)
    }
  }

  return <time className={`persian-nums ${className || ""}`}>{formatDate()}</time>
}
