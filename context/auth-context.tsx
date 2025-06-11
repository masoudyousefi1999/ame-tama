"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getUserByEmail, type User } from "@/lib/users";
import { getMe } from "@/hooks/use-user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    userData: Omit<User, "id">
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (
    userData: Partial<User>
  ) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
}

// ایجاد context با مقدار پیش‌فرض
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false, message: "" }),
  register: async () => ({ success: false, message: "" }),
  logout: () => {},
  updateProfile: async () => ({ success: false, message: "" }),
  forgotPassword: async () => ({ success: false, message: "" }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const user = await getMe();

      if (user && !user?.statusCode) {
        setUser(user);
      } else {
        setUser(null);
      }
    };
    getUser();

    setIsLoading(false);
  }, []);

  // ورود کاربر
  const login = async (email: string, password: string) => {
    try {
      // در یک پروژه واقعی، این بخش با API سرور ارتباط برقرار می‌کند
      // اما در اینجا از داده‌های نمونه استفاده می‌کنیم
      const foundUser = getUserByEmail(email);

      if (!foundUser) {
        return { success: false, message: "کاربری با این ایمیل یافت نشد" };
      }

      if (foundUser.password !== password) {
        return { success: false, message: "رمز عبور اشتباه است" };
      }

      // حذف رمز عبور از اطلاعات کاربر قبل از ذخیره
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem(
        "ame-tama-user",
        JSON.stringify(userWithoutPassword)
      );

      return { success: true, message: "ورود موفقیت‌آمیز بود" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "خطا در ورود به حساب کاربری" };
    }
  };

  // ثبت‌نام کاربر جدید
  const register = async (userData: Omit<User, "id">) => {
    try {
      // در یک پروژه واقعی، این بخش با API سرور ارتباط برقرار می‌کند
      // اما در اینجا فقط بررسی می‌کنیم که آیا ایمیل قبلاً استفاده شده است یا خیر
      const existingUser = getUserByEmail(userData.email);

      if (existingUser) {
        return { success: false, message: "این ایمیل قبلاً ثبت شده است" };
      }

      // در یک پروژه واقعی، کاربر جدید در دیتابیس ذخیره می‌شود
      // اما در اینجا فقط شبیه‌سازی می‌کنیم
      const newUser = {
        id: Date.now().toString(),
        ...userData,
      };

      // حذف رمز عبور از اطلاعات کاربر قبل از ذخیره
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem(
        "ame-tama-user",
        JSON.stringify(userWithoutPassword)
      );

      return { success: true, message: "ثبت‌نام با موفقیت انجام شد" };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "خطا در ثبت‌نام" };
    }
  };

  // خروج از حساب کاربری
  const logout = () => {
    setUser(null);
    localStorage.removeItem("ame-tama-user");
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

  // بازیابی رمز عبور
  const forgotPassword = async (email: string) => {
    try {
      // در یک پروژه واقعی، این بخش با API سرور ارتباط برقرار می‌کند
      // و یک ایمیل بازیابی رمز عبور ارسال می‌کند
      const foundUser = getUserByEmail(email);

      if (!foundUser) {
        return { success: false, message: "کاربری با این ایمیل یافت نشد" };
      }

      // شبیه‌سازی ارسال ایمیل بازیابی رمز عبور
      return {
        success: true,
        message: "لینک بازیابی رمز عبور به ایمیل شما ارسال شد",
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, message: "خطا در بازیابی رمز عبور" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
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
