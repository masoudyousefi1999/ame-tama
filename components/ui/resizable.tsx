"use client";

import type React from "react";

import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------------
 * Resizable – palette-aware & focus-ring-friendly
 * -------------------------------------------------------------------------- */

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
);

/* The `Panel` itself needs no extra styling tweaks */
const ResizablePanel = ResizablePrimitive.Panel;

type HandleProps = React.ComponentProps<
  typeof ResizablePrimitive.PanelResizeHandle
> & { withHandle?: boolean };

/**
 * Resize handle — now uses token-driven colours + better focus outline.
 */
const ResizableHandle = ({ withHandle, className, ...props }: HandleProps) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      // ── TRACK ─────────────────────────────────────────────────────────────
      "relative flex w-px items-center justify-center",
      /* For dark/light we tint the track a bit lighter */
      "bg-border/60",
      /* Focus ring */
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      // ── VERTICAL LAYOUT SUPPORT ───────────────────────────────────────────
      "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
      // The pseudo element gives the enlarged hit-area
      "after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2",
      "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-2 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0",
      // Rotate decorative grip when vertical
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div
        className={cn(
          "z-10 flex h-4 w-3 items-center justify-center rounded-sm",
          /* Subtle border + background that adapts to theme */
          "border border-border/50 bg-muted/70"
        )}
      >
        <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
