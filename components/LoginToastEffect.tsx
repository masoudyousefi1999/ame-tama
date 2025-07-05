"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function LoginToastEffect() {
  const pathname = usePathname();

  const checkAndShowLoginToast = () => {
    if (typeof window !== "undefined") {
      const justLoggedIn = localStorage.getItem("justLoggedIn");
      if (justLoggedIn) {
        toast({
          variant: "login",
          title: "ورود موفقیت‌آمیز",
          description: "با موفقیت وارد حساب کاربری خود شدید",
        });
        localStorage.removeItem("justLoggedIn");
      }
    }
  };

  // Check on mount
  useEffect(() => {
    checkAndShowLoginToast();
  }, []);

  // Check when pathname changes (navigation)
  useEffect(() => {
    checkAndShowLoginToast();
  }, [pathname]);

  return null;
}
