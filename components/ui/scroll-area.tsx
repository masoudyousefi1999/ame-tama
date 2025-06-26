"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

/**
 * NOTE – Only **styles** were touched so the component follows the project-wide
 * design-token system. No runtime / API changes.
 */

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn(
      // container ────────────────────────────────────────────────────────────
      "relative overflow-hidden rounded-md",
      /* subtle background so scrollbars sit on a faint rail */
      "bg-muted/30 dark:bg-muted/20",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>

    {/* custom scrollbars */}
    <ScrollBar orientation="vertical" />
    <ScrollBar orientation="horizontal" />

    <ScrollAreaPrimitive.Corner className="bg-muted/40 dark:bg-muted/25" />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

// ──────────────────────────────────────────────────────────────────────────────
// Scrollbar
// ──────────────────────────────────────────────────────────────────────────────
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ orientation = "vertical", className, ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      // track
      "flex touch-none select-none transition-colors",
      orientation === "vertical"
        ? "h-full w-2.5 border-l border-border/50"
        : "h-2.5 w-full flex-col border-t border-border/50",
      "bg-background/40 hover:bg-background/60",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className={cn(
        // thumb
        "relative flex-1 rounded-full",
        "bg-muted-foreground/40 hover:bg-muted-foreground/60"
      )}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
