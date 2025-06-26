"use client";

import * as React from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

/* -------------------------------------------------------------------------- */
/*                                   Root                                    */
/* -------------------------------------------------------------------------- */

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      // ——— container ———
      "flex h-full w-full flex-col overflow-hidden rounded-lg",
      // design-tokens
      "bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

/* -------------------------------------------------------------------------- */
/*                                Dialog shell                               */
/* -------------------------------------------------------------------------- */

const CommandDialog = ({ children, ...props }: DialogProps) => (
  <Dialog {...props}>
    <DialogContent
      className={cn(
        "overflow-hidden p-0 shadow-lg",
        // tokenised surface / radius
        "rounded-lg bg-popover text-popover-foreground"
      )}
    >
      {/* Tailwind-powered styling hooks for cmdk sub-elements */}
      <Command
        className={cn(
          "[&_cmdk-group-heading]:px-3 [&_cmdk-group-heading]:py-1.5",
          "[&_cmdk-group-heading]:text-xs [&_cmdk-group-heading]:font-medium",
          "[&_cmdk-group-heading]:text-muted-foreground",
          "[&_cmdk-group:not([hidden])~cmdk-group]:pt-0",
          "[&_cmdk-group]:px-1",
          "[&_cmdk-input-wrapper_svg]:size-5",
          "[&_cmdk-input]:h-12",
          "[&_cmdk-item]:px-2 [&_cmdk-item]:py-3",
          "[&_cmdk-item_svg]:size-5"
        )}
      >
        {children}
      </Command>
    </DialogContent>
  </Dialog>
);

/* -------------------------------------------------------------------------- */
/*                                  Input                                    */
/* -------------------------------------------------------------------------- */

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "flex items-center border-b",
      // design tokens
      "border-border bg-popover",
      "px-3"
    )}
    cmdk-input-wrapper=""
  >
    <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none",
        "placeholder:text-muted-foreground text-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

/* -------------------------------------------------------------------------- */
/*                                   List                                    */
/* -------------------------------------------------------------------------- */

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

/* -------------------------------------------------------------------------- */
/*                                  Empty                                    */
/* -------------------------------------------------------------------------- */

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm text-muted-foreground"
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

/* -------------------------------------------------------------------------- */
/*                                  Group                                    */
/* -------------------------------------------------------------------------- */

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground",
      "[&_cmdk-group-heading]:px-2 [&_cmdk-group-heading]:py-1.5",
      "[&_cmdk-group-heading]:text-xs [&_cmdk-group-heading]:font-medium",
      "[&_cmdk-group-heading]:text-muted-foreground",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

/* -------------------------------------------------------------------------- */
/*                               Separator                                   */
/* -------------------------------------------------------------------------- */

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

/* -------------------------------------------------------------------------- */
/*                                   Item                                    */
/* -------------------------------------------------------------------------- */

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none",
      "cursor-default data-[disabled=true]:pointer-events-none",
      // states
      "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
      "data-[disabled=true]:opacity-50",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

/* -------------------------------------------------------------------------- */
/*                                Shortcut                                   */
/* -------------------------------------------------------------------------- */

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "ml-auto text-xs tracking-widest text-muted-foreground",
      className
    )}
    {...props}
  />
);
CommandShortcut.displayName = "CommandShortcut";

/* -------------------------------------------------------------------------- */
/*                                  Exports                                  */
/* -------------------------------------------------------------------------- */

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
