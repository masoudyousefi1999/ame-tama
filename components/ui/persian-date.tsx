interface PersianDateProps {
  date: Date | string;
  format?: "short" | "medium" | "long" | "full" | "numeric";
  className?: string;
}

export function PersianDate({
  date,
  format = "medium",
  className,
}: PersianDateProps) {
  const formatDate = () => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;

      // تبدیل به تاریخ شمسی با استفاده از API های داخلی مرورگر
      let options: Intl.DateTimeFormatOptions = {
        calendar: "persian",
        numberingSystem: "latn",
      };

      switch (format) {
        case "numeric":
          options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            calendar: "persian",
            numberingSystem: "latn",
          };
          break;
        case "short":
          Object.assign(options, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
          break;
        case "medium":
          Object.assign(options, {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          break;
        case "long":
          Object.assign(options, {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          });
          break;
        case "full":
          Object.assign(options, {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
            hour: "numeric",
            minute: "numeric",
          });
          break;
      }

      let formatted = new Intl.DateTimeFormat("fa-IR", options).format(dateObj);

      if (format === "numeric") {
        // Ensure yyyy/MM/dd (with leading zeros)
        const parts = formatted.match(
          /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/
        );
        if (parts) {
          const y = parts[1];
          const m = parts[2].padStart(2, "0");
          const d = parts[3].padStart(2, "0");
          formatted = `${y}/${m}/${d}`;
        }
      }

      return formatted;
    } catch (error) {
      console.error("Error formatting date to Persian:", error);
      return String(date);
    }
  };

  return (
    <time className={`persian-nums ${className || ""}`}>{formatDate()}</time>
  );
}
