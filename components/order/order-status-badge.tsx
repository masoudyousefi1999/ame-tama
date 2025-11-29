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
    case "open":
      return (
        <Badge
          className={`bg-muted/50 text-muted-foreground hover:bg-muted border-border ${className}`}
        >
          <Package className="ml-1 h-3 w-3" />
          باز
        </Badge>
      );
    case "pending":
      return (
        <Badge
          className={`bg-warning/20 text-warning-foreground hover:bg-warning/30 border-warning/40 ${className}`}
        >
          <Clock className="ml-1 h-3 w-3" />
          در انتظار
        </Badge>
      );
    case "confirmed":
      return (
        <Badge
          className={`bg-success/20 text-success-foreground hover:bg-success/30 border-success/40 ${className}`}
        >
          <CheckCircle className="ml-1 h-3 w-3" />
          تایید شده
        </Badge>
      );
    case "shipping":
      return (
        <Badge
          className={`bg-info/20 text-info-foreground hover:bg-info/30 border-info/40 ${className}`}
        >
          <Truck className="ml-1 h-3 w-3" />
          در حال ارسال
        </Badge>
      );
    case "shipped":
      return (
        <Badge
          className={`bg-success/20 text-success-foreground hover:bg-success/30 border-success/40 ${className}`}
        >
          <Package className="ml-1 h-3 w-3" />
          ارسال شده
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          className={`bg-destructive/20 text-destructive-foreground hover:bg-destructive/30 border-destructive/40 ${className}`}
        >
          <AlertCircle className="ml-1 h-3 w-3" />
          لغو شده
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
  open: {
    label: "باز",
    icon: Package,
    className:
      "bg-muted/50 text-muted-foreground hover:bg-muted border-border",
  },
  pending: {
    label: "در انتظار",
    icon: Clock,
    className:
      "bg-warning/20 text-warning-foreground hover:bg-warning/30 border-warning/40",
  },
  confirmed: {
    label: "تایید شده",
    icon: CheckCircle,
    className:
      "bg-success/20 text-success-foreground hover:bg-success/30 border-success/40",
  },
  shipping: {
    label: "در حال ارسال",
    icon: Truck,
    className:
      "bg-info/20 text-info-foreground hover:bg-info/30 border-info/40",
  },
  shipped: {
    label: "ارسال شده",
    icon: Package,
    className:
      "bg-success/20 text-success-foreground hover:bg-success/30 border-success/40",
  },
  cancelled: {
    label: "لغو شده",
    icon: AlertCircle,
    className:
      "bg-destructive/20 text-destructive-foreground hover:bg-destructive/30 border-destructive/40",
  },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS_CONFIG;
