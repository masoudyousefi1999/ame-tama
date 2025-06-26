"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorMessage({
  title = "خطا",
  message,
  retry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* icon colour → design-token */}
      <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />

      <h3 className="mb-2 text-lg font-medium font-vazirmatn">{title}</h3>

      {/* muted foreground token instead of hard-coded greys */}
      <p className="mb-4 text-muted-foreground font-vazirmatn">{message}</p>

      {retry && (
        <Button onClick={retry} variant="outline" className="font-vazirmatn">
          تلاش مجدد
        </Button>
      )}
    </div>
  );
}
