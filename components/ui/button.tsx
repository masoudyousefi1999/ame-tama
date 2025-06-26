"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* ────────────────────────────────────────────────────────── */
/* Base + variants                                            */
/* ────────────────────────────────────────────────────────── */
const buttonVariants = cva(
  [
    // base
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold",
    "rounded-full select-none transition-all motion-reduce:transition-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    // tactile
    "active:scale-[.97] active:shadow-sm",
    // icon defaults
    "[&_svg]:shrink-0 [&_svg]:size-4 rtl:space-x-reverse",
  ].join(" "),
  {
    variants: {
      variant: {
        // SOLID
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground shadow hover:bg-secondary/80 hover:shadow-md",

        // NON-SOLID
        outline:
          "border border-border bg-transparent hover:bg-muted hover:text-foreground",
        ghost: "bg-transparent hover:bg-muted/50",
        link: "bg-transparent text-primary underline-offset-4 hover:underline",

        // EXTRAS
        gradient:
          "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow hover:brightness-110",
      },
      size: {
        xs: "h-8 px-3 text-xs",
        sm: "h-9 px-4 text-sm",
        md: "h-10 px-5 text-sm", // default
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
      iconPosition: {
        start: "flex-row",
        end: "flex-row-reverse",
      },
      block: {
        true: "w-full justify-center",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      iconPosition: "start",
      block: false,
    },
    compoundVariants: [
      // subtle shadow only on solid buttons
      {
        variant: ["default", "destructive", "secondary", "gradient"],
        className: "shadow",
      },
    ],
  }
)

/* ────────────────────────────────────────────────────────── */
/* Component                                                  */
/* ────────────────────────────────────────────────────────── */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** render as child (for e.g. `next/link`) */
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      iconPosition,
      block,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, iconPosition, block }),
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
