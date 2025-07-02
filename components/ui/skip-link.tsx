"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SkipLinkProps {
  href: string;
  children?: React.ReactNode;
}

export function SkipLink({
  href,
  children = "رفتن به محتوای اصلی",
}: SkipLinkProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Reset focus state when route changes
  useEffect(() => {
    setIsFocused(false);
  }, []);

  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-white dark:focus:bg-gray-900 focus:border-2 focus:border-purple-500 focus:rounded-md focus:outline-none",
        isFocused && "not-sr-only absolute top-4 right-4 z-[200]"
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {children}
    </a>
  );
}
