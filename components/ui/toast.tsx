"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import {
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  ShoppingBag,
  Heart,
  User,
  Shield,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    aria-live="polite"
    aria-atomic="false"
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border p-6 pr-8 shadow-2xl backdrop-blur-sm transition-all duration-300 ease-out data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default:
          "border-gray-200 bg-white text-gray-900 shadow-lg dark:border-gray-700/50 dark:bg-gray-900/95 dark:text-gray-100",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-900 shadow-lg dark:border-emerald-800/50 dark:bg-emerald-950/95 dark:text-emerald-100",
        error:
          "border-red-200 bg-red-50 text-red-900 shadow-lg dark:border-red-800/50 dark:bg-red-950/95 dark:text-red-100",
        warning:
          "border-amber-200 bg-amber-50 text-amber-900 shadow-lg dark:border-amber-800/50 dark:bg-amber-950/95 dark:text-amber-100",
        info: "border-blue-200 bg-blue-50 text-blue-900 shadow-lg dark:border-blue-800/50 dark:bg-blue-950/95 dark:text-blue-100",
        login:
          "border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-900 shadow-lg dark:border-purple-800/50 dark:from-purple-950/95 dark:to-indigo-950/95 dark:text-purple-100",
        cart: "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 text-green-900 shadow-lg dark:border-green-800/50 dark:from-green-950/95 dark:to-emerald-950/95 dark:text-green-100",
        wishlist:
          "border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 text-pink-900 shadow-lg dark:border-pink-800/50 dark:from-pink-950/95 dark:to-rose-950/95 dark:text-pink-100",
        anime:
          "border-violet-200 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 text-violet-900 shadow-lg dark:border-violet-800/50 dark:from-violet-950/95 dark:via-purple-950/95 dark:to-indigo-950/95 dark:text-violet-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      role="alert"
      aria-live="polite"
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border bg-transparent px-3 text-sm font-medium ring-offset-background transition-all duration-200 hover:bg-secondary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-lg p-1.5 text-foreground/50 opacity-0 transition-all duration-200 hover:text-foreground hover:bg-black/5 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring/50 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:hover:bg-red-500/20 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    aria-label="بستن اعلان"
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-6", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm leading-5 opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// New component for toast icons
const ToastIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: VariantProps<typeof toastVariants>["variant"];
  }
>(({ className, variant = "default", ...props }, ref) => {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return (
          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        );
      case "error":
        return (
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        );
      case "warning":
        return (
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        );
      case "info":
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case "login":
        return (
          <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        );
      case "cart":
        return (
          <ShoppingBag className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case "wishlist":
        return <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />;
      case "anime":
        return (
          <Star className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        );
      default:
        return <Info className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-gray-200 dark:bg-black/20 dark:ring-white/10",
        className
      )}
      {...props}
    >
      {getIcon()}
    </div>
  );
});
ToastIcon.displayName = "ToastIcon";

// New component for progress bar
const ToastProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { duration?: number }
>(({ className, duration = 2000, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute bottom-0 left-0 h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-sm",
        className
      )}
      style={{
        width: "100%",
      }}
      data-duration={duration}
      {...props}
    />
  );
});
ToastProgress.displayName = "ToastProgress";

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
  ToastProgress,
};
