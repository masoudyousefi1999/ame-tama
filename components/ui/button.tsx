"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────── */
/* Base + variants                                            */
/* ────────────────────────────────────────────────────────── */
export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/85 hover:scale-[1.02] active:scale-100 shadow-lg hover:shadow-lg transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/85 hover:scale-[1.02] active:scale-100 shadow-lg hover:shadow-lg transition-all duration-200",
        outline:
          "border border-input bg-background hover:bg-muted/50 hover:text-foreground hover:scale-[1.02] active:scale-100 shadow-md hover:shadow-md transition-all duration-200",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/75 hover:scale-[1.02] active:scale-100 shadow-md hover:shadow-md transition-all duration-200",
        ghost:
          "hover:bg-muted/50 hover:text-foreground hover:scale-[1.02] active:scale-100 transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/* ────────────────────────────────────────────────────────── */
/* Component                                                  */
/* ────────────────────────────────────────────────────────── */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** render as child (for e.g. `next/link`) */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<
      Array<{ id: number; x: number; y: number }>
    >([]);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple = {
        id: Date.now(),
        x,
        y,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) =>
          prev.filter((ripple) => ripple.id !== newRipple.id)
        );
      }, 600);
    };

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={buttonRef}
        onClick={createRipple}
        {...props}
      >
        {children}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: "100px",
              height: "100px",
              transform: "scale(0)",
            }}
          />
        ))}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button };
