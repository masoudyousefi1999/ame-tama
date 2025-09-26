import { Badge } from "@/components/ui/badge";
import { CheckCircle, Truck, Package, Clock, AlertCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export const OrderStatusBadge = ({
  status,
  className = "",
}: OrderStatusBadgeProps) => {
  switch (status) {
    case "confirmed":
      return (
        <Badge
          className={`bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-800/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 ${className}`}
        >
          <CheckCircle className="ml-1 h-3 w-3" />
          تایید شده
        </Badge>
      );
    case "shipping":
      return (
        <Badge
          className={`bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800/20 dark:text-blue-400 border-blue-200 dark:border-blue-800 ${className}`}
        >
          <Truck className="ml-1 h-3 w-3" />
          ارسال شده
        </Badge>
      );
    case "shipped":
      return (
        <Badge
          className={`bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/20 dark:text-green-400 border-green-200 dark:border-green-800 ${className}`}
        >
          <Package className="ml-1 h-3 w-3" />
          دریافت شده
        </Badge>
      );
    case "delivered":
      return (
        <Badge
          className={`bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/20 dark:text-green-400 border-green-200 dark:border-green-800 ${className}`}
        >
          <CheckCircle className="ml-1 h-3 w-3" />
          تحویل شده
        </Badge>
      );
    case "processing":
      return (
        <Badge
          className={`bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-800/20 dark:text-amber-400 border-amber-200 dark:border-amber-800 ${className}`}
        >
          <Clock className="ml-1 h-3 w-3" />
          در حال پردازش
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          className={`bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800/20 dark:text-red-400 border-red-200 dark:border-red-800 ${className}`}
        >
          <AlertCircle className="ml-1 h-3 w-3" />
          لغو شده
        </Badge>
      );
    case "pending":
      return (
        <Badge
          className={`bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 ${className}`}
        >
          <Clock className="ml-1 h-3 w-3" />
          در انتظار
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className={`border-muted-foreground/20 ${className}`}
        >
          <Clock className="ml-1 h-3 w-3" />
          نامشخص
        </Badge>
      );
  }
};

// Status configuration for easy access
export const ORDER_STATUS_CONFIG = {
  confirmed: {
    label: "تایید شده",
    icon: CheckCircle,
    className:
      "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-800/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  shipping: {
    label: "ارسال شده",
    icon: Truck,
    className:
      "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800/20 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  shipped: {
    label: "دریافت شده",
    icon: Package,
    className:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/20 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  delivered: {
    label: "تحویل شده",
    icon: CheckCircle,
    className:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/20 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  processing: {
    label: "در حال پردازش",
    icon: Clock,
    className:
      "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-800/20 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  cancelled: {
    label: "لغو شده",
    icon: AlertCircle,
    className:
      "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800/20 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  pending: {
    label: "در انتظار",
    icon: Clock,
    className:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS_CONFIG;
