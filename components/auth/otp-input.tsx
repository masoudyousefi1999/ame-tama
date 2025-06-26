"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function OtpInput({
  length = 4,
  value,
  onChange,
  disabled = false,
  className,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update internal state when value prop changes
  useEffect(() => {
    const newOtp = Array(length).fill("");
    for (let i = 0; i < Math.min(value.length, length); i++) {
      newOtp[i] = value[i] || "";
    }
    setOtp(newOtp);
  }, [value, length]);

  const handleInputChange = (index: number, inputValue: string) => {
    // Only allow numeric input
    const numericValue = inputValue.replace(/\D/g, "");

    if (numericValue.length > 1) {
      // Handle paste scenario
      const pastedDigits = numericValue.slice(0, length - index);
      const newOtp = [...otp];

      for (let i = 0; i < pastedDigits.length && index + i < length; i++) {
        newOtp[index + i] = pastedDigits[i];
      }

      setOtp(newOtp);
      onChange(newOtp.join(""));

      // Focus next empty input or last input
      const nextIndex = Math.min(index + pastedDigits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Single digit input
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Move to next input if current is filled
    if (numericValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Select all text when focusing
    inputRefs.current[index]?.select();
  };

  return (
    <div
      className={cn("flex flex-row-reverse gap-2 justify-center", className)}
      dir="rtl"
    >
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el) as any}
          type="tel"
          inputMode="numeric"
          dir="ltr"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          className={cn(
            "w-12 h-12 text-center text-lg font-bold border-2 transition-all duration-200",
            /* focus state */
            "focus:border-primary focus:ring-2 focus:ring-primary/30",
            /* filled state */
            digit
              ? "border-primary bg-primary/10 dark:bg-primary/10"
              : "border-border",
            /* disabled */
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      ))}
    </div>
  );
}
