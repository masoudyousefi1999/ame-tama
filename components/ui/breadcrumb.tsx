"use client";

import * as React from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  homeLabel?: string;
  separator?: ReactNode;
  children?: ReactNode;
}

/* ────────────────────────────────────────────────────────────────────────────
   ‣ <Breadcrumb /> – tokenised styles only
   ------------------------------------------------------------------------- */
export function Breadcrumb({
  items,
  className,
  showHome = true,
  homeLabel = "خانه",
  separator = <ChevronLeft className="h-4 w-4" />,
  children,
}: BreadcrumbProps) {
  /* custom JSX passed – leave layout/styling up to the caller */
  if (children) {
    return (
      <nav
        aria-label="breadcrumb"
        className={cn(
          "flex min-h-12 w-full items-center justify-center rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground",
          className
        )}
      >
        {children}
      </nav>
    );
  }

  /* default breadcrumb rendering from `items` */
  return (
    <nav
      aria-label="breadcrumb"
      className={cn(
        "w-full overflow-x-auto whitespace-nowrap rounded-lg bg-muted px-3 py-3 text-xs text-muted-foreground sm:px-6 sm:text-sm",
        className
      )}
    >
      <ol className="flex w-full items-center gap-x-2 sm:gap-x-3">
        {showHome && (
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors duration-200 hover:bg-muted/50 hover:text-primary/80"
            >
              <Home className="h-4 w-4" />
              <span className="max-w-[100px] truncate">{homeLabel}</span>
            </Link>
            {items?.length ? (
              <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            ) : null}
          </li>
        )}

        {items?.filter(Boolean).map((item, idx) => (
          <li key={`${item.href}-${idx}`} className="flex items-center">
            {item.isCurrent ? (
              <BreadcrumbCurrent>{item.label}</BreadcrumbCurrent>
            ) : (
              <>
                {item.href ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                  <span className="rounded-md px-2 py-1">{item.label}</span>
                )}
                {idx < items.length - 1 && (
                  <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   • Primitive sub-components (tokenised)
   ------------------------------------------------------------------------- */
export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn("flex flex-wrap items-center gap-y-2", className)}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("flex items-center", className)} {...props} />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }
>(({ className, href = "/", ...props }, ref) => (
  <Link
    ref={ref as any}
    href={href}
    className={cn(
      "rounded-md px-2 py-1 transition-colors duration-200 hover:bg-muted/50 hover:text-primary/80",
      className
    )}
    {...props}
  />
));
BreadcrumbLink.displayName = "BreadcrumbLink";

export const BreadcrumbSeparator = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("mx-1 sm:mx-2", className)}
    aria-hidden="true"
    {...props}
  >
    {children ?? <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />}
  </span>
));
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export const BreadcrumbCurrent = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    aria-current="page"
    className={cn(
      "rounded-md px-2 py-1 text-foreground font-medium",
      className
    )}
    {...props}
  >
    {children}
  </span>
));
BreadcrumbCurrent.displayName = "BreadcrumbCurrent";
