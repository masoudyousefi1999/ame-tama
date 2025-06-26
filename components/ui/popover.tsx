"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------------
 * Popover – token-aware styles only (no logic change)
 * -------------------------------------------------------------------------- */

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        // —— layout & surface
        "z-50 w-72 max-w-[92vw] rounded-lg border border-border bg-background text-foreground shadow-lg",
        // —— ring / focus
        "ring-1 ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // —— entry / exit animations  (Radix’ data-state)
        "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0",
        // —— directional slide
        "data-[side=top]:slide-in-from-bottom-4",
        "data-[side=bottom]:slide-in-from-top-4",
        "data-[side=left]:slide-in-from-right-4",
        "data-[side=right]:slide-in-from-left-4",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
