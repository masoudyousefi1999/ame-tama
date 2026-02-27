import type { Metadata } from "next"
import LoginPageComponent from "@/components/auth/login-page"

export const metadata: Metadata = {
  title: "ورود به حساب کاربری | AME-TAMA",
  description: "وارد حساب کاربری خود شوید و از امکانات ویژه بهره‌مند شوید",
}

export default function LoginPage() {
  return <LoginPageComponent />
}
