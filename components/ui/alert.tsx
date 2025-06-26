import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Alert Variants                                                           */
/* ────────────────────────────────────────────────────────────────────────── *
 *  Only **styling tokens** have been touched.
 *  – All functional / structural logic is unchanged.                        */

const alertVariants = cva(
  `
    relative w-full rounded-lg border
    p-4 pr-5                                        /* 👈 extra room for RTL icons */
    [&>svg~*]:pl-7                                  /* space between icon ⬅ content   */
    [&>svg+div]:translate-y-[-3px]                  /* vertical-align icon / text     */
    [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4
    [&>svg]:text-foreground
  `,
  {
    variants: {
      variant: {
        /* -------------------------------------------------- Default ------ */
        default: `
          bg-card text-card-foreground border-border
          dark:bg-card-dark dark:text-card-foreground-dark
        `,

        /* ------------------------------------------------ Destructive ---- */
        destructive: `
          bg-destructive/10 text-destructive
          border-destructive/40 dark:border-destructive
          [&>svg]:text-destructive
        `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/* ────────────────────────────────────────────────────────────────────────── */
/*  Root                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Title / Description                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground [&_p]:leading-relaxed",
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
