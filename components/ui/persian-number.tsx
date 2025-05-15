interface PersianNumberProps {
  number: number
  currency?: boolean
  compact?: boolean
  className?: string
}

export function PersianNumber({ number, currency = false, compact = false, className }: PersianNumberProps) {
  const formatNumber = () => {
    try {
      if (currency) {
        return new Intl.NumberFormat("fa-IR", {
          style: "currency",
          currency: "IRR",
          maximumFractionDigits: 0,
          notation: compact ? "compact" : "standard",
        }).format(number)
      }

      return new Intl.NumberFormat("fa-IR", {
        notation: compact ? "compact" : "standard",
      }).format(number)
    } catch (error) {
      console.error("Error formatting number to Persian:", error)
      return number.toString()
    }
  }

  return (
    <span dir="ltr" className={`inline-block persian-nums ${className || ""}`}>
      {formatNumber()}
    </span>
  )
}
