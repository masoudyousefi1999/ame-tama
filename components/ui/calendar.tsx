"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = DayPickerProps;

/**
 * Calendar – token-aware styles
 *
 *  • Colours use semantic Tailwind tokens (`bg-primary`, `bg-accent`, …)
 *  • Buttons inherit the design-system variants (`buttonVariants`)
 *  • All hard-coded grays replaced with `muted / foreground / background` tokens
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        /* layout */
        months: "flex flex-col gap-y-4 sm:flex-row sm:gap-x-4",
        month: "space-y-4",
        caption: "relative flex items-center justify-center pt-1",
        caption_label: "text-sm font-medium",

        /* navigation (left / right arrows) */
        nav: "flex items-center gap-x-1",
        nav_button: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-background p-0 opacity-60 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1 rtl:left-auto rtl:right-1",
        nav_button_next: "absolute right-1 rtl:right-auto rtl:left-1",

        /* table & grid */
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground",

        /* day cells */
        row: "mt-2 flex w-full",
        cell: [
          "relative h-9 w-9 p-0 text-center text-sm",
          /* selection rounding */
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md",
          /* range highlight */
          "[&:has([aria-selected])]:bg-accent",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "focus-within:relative focus-within:z-20",
        ].join(" "),
        day: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_today: "bg-accent text-accent-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_range_end: "day-range-end",
        day_hidden: "invisible",

        /* allow consumer overrides */
        ...classNames,
      }}
      /* custom arrow buttons that use the design-system variant */
      components={{
        PreviousMonthButton: ({ ...p }) => (
          <button
            {...p}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-7 w-7 bg-background p-0 opacity-60 hover:opacity-100"
            )}
            aria-label="ماه قبل"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ),
        NextMonthButton: ({ ...p }) => (
          <button
            {...p}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-7 w-7 bg-background p-0 opacity-60 hover:opacity-100"
            )}
            aria-label="ماه بعد"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        ),
      }}
      {...props}
    />
  );
}
