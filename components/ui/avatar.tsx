"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

/*───────────────────────────────────────────────────────────────────────────*
 *  NOTES                                                                    *
 *  • Only **utility / token classes** were changed to align with your       *
 *    design-system (border, background, text, etc.).                        *
 *  • All behaviour & API remain 100 % identical.                            *
 *───────────────────────────────────────────────────────────────────────────*/

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      `
        relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full
        ring-1 ring-border                                /* design-token ring */
        bg-card                                          /* fallback bg if img fails to load first */
      `,
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

/* ─────────────────────────────── Image ─────────────────────────────────── */

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full object-cover" /* cover ⇒ no stretching */,
      className
    )}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

/* ────────────────────────────── Fallback ───────────────────────────────── */

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      `
        flex h-full w-full items-center justify-center rounded-full
        bg-muted text-muted-foreground                    /* tokenised colours  */
      `,
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

/* ───────────────────────────────────────────────────────────────────────── */

export { Avatar, AvatarImage, AvatarFallback };
