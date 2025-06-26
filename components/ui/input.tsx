import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * <Input />
 * ──────────────────────────────────────────────────────────
 * • Borders now use the design-token alias `border`
 * • Colours already point to palette tokens (`bg-background`, etc.)
 * • File input text inherits foreground token
 */

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        // size & layout
        "flex h-10 w-full rounded-md px-3 py-2 md:text-sm",
        // colours
        "border bg-background text-foreground placeholder:text-muted-foreground",
        // ring / focus
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // file input override
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
