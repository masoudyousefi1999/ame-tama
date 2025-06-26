"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------------
 * Progress – token-aware palette & motion (no logic change)
 * -------------------------------------------------------------------------- */

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    // ——— Track
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-full",
      "bg-muted/40 dark:bg-muted/30", // uses `bg-muted` token so both light/dark vibes match
      "ring-1 ring-inset ring-border/20", // subtle outline so track is visible on any surface
      className
    )}
    {...props}
  >
    {/* ——— Filled bar */}
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 transition-transform duration-300 ease-out",
        // nice gradient that respects the design-tokens
        "bg-gradient-to-r from-primary to-primary/70"
      )}
      // translateX keeps ARIA percentage visually in-sync
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
