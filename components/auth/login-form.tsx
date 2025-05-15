"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/components/ui/use-toast"

interface LoginFormProps {
  onSuccess?: () => void
  onForgotPassword: () => void
  onRegister: () => void
}

export default function LoginForm({ onSuccess, onForgotPassword, onRegister }: LoginFormProps) {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدها را پر کنید",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        toast({
          title: "ورود موفقیت‌آمیز",
          description: "با موفقیت وارد حساب کاربری خود شدید",
        })

        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast({
          title: "خطا در ورود",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در ورود به حساب کاربری رخ داد",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold font-vazirmatn">ورود به حساب کاربری</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-vazirmatn">
          وارد حساب کاربری خود شوید و از امکانات ویژه بهره‌مند شوید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-vazirmatn">
            ایمیل
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className="font-vazirmatn"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-vazirmatn">
              رمز عبور
            </Label>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-xs text-purple-600 dark:text-purple-400 font-vazirmatn"
              onClick={onForgotPassword}
              disabled={isLoading}
            >
              فراموشی رمز عبور؟
            </Button>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className="font-vazirmatn"
            dir="ltr"
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال ورود...
            </>
          ) : (
            "ورود"
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
          حساب کاربری ندارید؟{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-purple-600 dark:text-purple-400 font-vazirmatn"
            onClick={onRegister}
            disabled={isLoading}
          >
            ثبت‌نام کنید
          </Button>
        </p>
      </div>
    </div>
  )
}
