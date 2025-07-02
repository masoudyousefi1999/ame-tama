"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({
  href,
  label = "بازگشت",
  className,
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        /*────────── design-tokens instead of raw grays ──────────*/
        "flex items-center text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={handleClick}
    >
      {/* RTL support → flip when needed (optional) */}
      <ArrowRight className="ml-1 h-4 w-4 rtl:rotate-180" />
      {label}
    </Button>
  );
}
