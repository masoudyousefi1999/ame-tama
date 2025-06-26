"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Design-tokens ↔︎ class updates
 *  • borders → `border` (alias for token `--border`)
 *  • focus-ring → already tokenised (`ring-ring / ring-offset-background`)
 *  • colours left untouched if they already map to tokens (`bg-foreground`, etc.)
 */

/* ──────────────────────────────────────────────────────────
   ROOT
   ────────────────────────────────────────────────────────── */
const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

/* ──────────────────────────────────────────────────────────
   GROUP
   ────────────────────────────────────────────────────────── */
const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

/* ──────────────────────────────────────────────────────────
   SLOT
   ────────────────────────────────────────────────────────── */
const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const { slots } = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center text-sm transition-all",
        "border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md", // unify border token
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </span>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

/* ──────────────────────────────────────────────────────────
   SEPARATOR
   ────────────────────────────────────────────────────────── */
const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>((props, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
