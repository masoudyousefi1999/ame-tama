"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type User } from "@/lib/users";
import { getMe } from "@/hooks/use-user";
import { customFetch } from "@/lib/utils";
import { useCart } from "@/context/cart-context";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  loginWithOtp: (
    phone: string,
    otp: string
  ) => Promise<{ success: boolean; message: string }>;
  loginWithPassword: (
    identifier: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (
    userData: Partial<User>
  ) => Promise<{ success: boolean; message: string }>;
}

// ایجاد context با مقدار پیش‌فرض
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false, message: "" }),
  loginWithOtp: async () => ({ success: false, message: "" }),
  loginWithPassword: async () => ({ success: false, message: "" }),
  logout: () => {},
  updateProfile: async () => ({ success: false, message: "" }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { clearCart } = useCart();

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      try {
        const user = await getMe();
        if (isMounted) {
          if (user && !user?.statusCode) {
            setUser(user);
            localStorage.setItem("ame-tama-user", JSON.stringify(user));
          } else {
            setUser(null);
            localStorage.removeItem("ame-tama-user");
          }
          setIsLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        // Silent error handling - 401/403 are expected for unauthenticated users
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // ورود کاربر با OTP
  const loginWithOtp = async (phone: string, otp: string) => {
    try {
      const res = await customFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          phone,
          otp,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (res.ok && result && result.user) {
        setUser(result.user);
        return { success: true, message: "ورود موفقیت‌آمیز بود" };
      } else {
        return {
          success: false,
          message: result?.message || "کد تأیید وارد شده صحیح نیست",
        };
      }
    } catch (error) {
      console.error("OTP Login error:", error);
      return { success: false, message: "خطا در ورود به حساب کاربری" };
    }
  };

  // ورود کاربر با رمز عبور
  const loginWithPassword = async (identifier: string, password: string) => {
    try {
      let body: any = { password };
      if (identifier.includes("@")) {
        body.email = identifier;
      } else {
        body.phone = identifier;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (res.ok && result && result.user) {
        setUser(result.user);
        return { success: true, message: "ورود موفقیت‌آمیز بود" };
      } else {
        return {
          success: false,
          message: result?.message || "ایمیل/شماره تلفن یا رمز عبور اشتباه است",
        };
      }
    } catch (error) {
      console.error("Password Login error:", error);
      return { success: false, message: "خطا در ورود به حساب کاربری" };
    }
  };

  // ورود کاربر (legacy method for backward compatibility)
  const login = async (email: string, password: string) => {
    return loginWithPassword(email, password);
  };

  // خروج از حساب کاربری
  const logout = async () => {
    try {
      await customFetch("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setUser(null);
      clearCart();
    }
  };

  // به‌روزرسانی اطلاعات پروفایل
  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!user) {
        return { success: false, message: "کاربر وارد نشده است" };
      }

      // در یک پروژه واقعی، این بخش با API سرور ارتباط برقرار می‌کند
      // اما در اینجا فقط اطلاعات کاربر را در حافظه به‌روز می‌کنیم
      const updatedUser = { ...user, ...userData };

      setUser(updatedUser);
      localStorage.setItem("ame-tama-user", JSON.stringify(updatedUser));

      return { success: true, message: "اطلاعات پروفایل با موفقیت به‌روز شد" };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, message: "خطا در به‌روزرسانی اطلاعات پروفایل" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: false,
        login,
        loginWithOtp,
        loginWithPassword,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// هوک سفارشی برای استفاده آسان از context احراز هویت
export function useAuth() {
  return useContext(AuthContext);
}
