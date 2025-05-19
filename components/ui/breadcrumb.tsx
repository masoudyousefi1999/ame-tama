"use client";

import type React from "react";
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

export function Breadcrumb({
  items,
  className,
  showHome = true,
  homeLabel = "خانه",
  separator = <ChevronLeft className="h-4 w-4 mx-2 sm:mx-3" />,
  children,
}: BreadcrumbProps) {
  // If children are provided, render them directly
  if (children) {
    return (
      <nav
        aria-label="breadcrumb"
        className={cn(
          "w-full flex items-center justify-center min-h-12 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-1.5 sm:px-6 sm:py-3 text-gray-500 dark:text-gray-400",
          className
        )}
      >
        {children}
      </nav>
    );
  }

  // Otherwise, render using the items prop
  return (
    <nav
      aria-label="breadcrumb"
      className={cn(
        "w-full flex items-center min-h-12 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-1.5 sm:px-6 sm:py-3 text-gray-500 dark:text-gray-400",
        className
      )}
    >
      <ol className="flex items-center justify-center sm:justify-start flex-wrap gap-y-2 text-center w-full">
        {showHome && (
          <li className="flex items-center justify-center">
            <Link
              href="/"
              className="flex items-center px-2 py-1 rounded-md hover:text-purple-500 dark:hover:text-purple-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-vazirmatn text-xs sm:text-sm"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
              <span>{homeLabel}</span>
            </Link>
            {items && items.length > 0 && (
              <span className="mx-2 sm:mx-3">{separator}</span>
            )}
          </li>
        )}

        {items &&
          items
            .filter((item) => item.href && item.label) // Skip invalid items
            .map((item, index) => (
              <li
                key={`${item.href}-${index}`}
                className="flex items-center justify-center"
              >
                {item.isCurrent ? (
                  <span
                    className="text-gray-900 dark:text-gray-100 font-medium font-vazirmatn text-xs sm:text-sm px-2 py-1 rounded-md"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={cn(
                          "px-2 py-1 rounded-md hover:text-purple-500 dark:hover:text-purple-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-vazirmatn text-xs sm:text-sm inline-block text-center",
                          className
                        )}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 font-vazirmatn text-xs sm:text-sm px-2 py-1 rounded-md">
                        {item.label}
                      </span>
                    )}
                    {index < items.length - 1 && (
                      <span className="mx-2 sm:mx-3">{separator}</span>
                    )}
                  </>
                )}
              </li>
            ))}
      </ol>
    </nav>
  );
}

// Individual components for more customized usage
export const BreadcrumbList = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) => {
  return (
    <ol
      className={cn("flex items-center flex-wrap gap-y-2", className)}
      {...props}
    >
      {children}
    </ol>
  );
};

export const BreadcrumbItem = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) => {
  return (
    <li className={cn("flex items-center", className)} {...props}>
      {children}
    </li>
  );
};

export const BreadcrumbLink = ({
  children,
  className,
  href = "/",
  ...props
}: React.HTMLAttributes<HTMLAnchorElement> & { href?: string }) => {
  return (
    <Link
      href={href}
      className={cn(
        "px-2 py-1 rounded-md hover:text-purple-500 dark:hover:text-purple-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-vazirmatn text-xs sm:text-sm",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("mx-2 sm:mx-3", className)}
      aria-hidden="true"
      {...props}
    >
      {children || <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />}
    </span>
  );
};

export const BreadcrumbCurrent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "text-gray-900 dark:text-gray-100 font-medium font-vazirmatn text-xs sm:text-sm px-2 py-1 rounded-md",
        className
      )}
      aria-current="page"
      {...props}
    >
      {children}
    </span>
  );
};
