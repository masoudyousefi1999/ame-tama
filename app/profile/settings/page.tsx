"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, Bell, Moon, Sun, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "next-themes";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BackButton } from "@/components/ui/back-button";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    newsletter: true,
  });

  // اگر کاربر وارد نشده باشد، به صفحه اصلی هدایت می‌شود
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    } else if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, isLoading, router]);

  // اگر در حال بارگذاری است یا کاربر وارد نشده، چیزی نمایش نمی‌دهیم
  if (isLoading || !user) {
    return null;
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "پروفایل به‌روزرسانی شد",
      description: "اطلاعات پروفایل شما با موفقیت به‌روزرسانی شد",
    });
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "خطا در تغییر رمز عبور",
        description: "رمز عبور جدید و تکرار آن مطابقت ندارند",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "رمز عبور تغییر کرد",
      description: "رمز عبور شما با موفقیت تغییر کرد",
    });

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleNotificationUpdate = () => {
    toast({
      title: "تنظیمات اعلان‌ها به‌روزرسانی شد",
      description: "تنظیمات اعلان‌های شما با موفقیت به‌روزرسانی شد",
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast({
      title: "تم سایت تغییر کرد",
      description: theme === "dark" ? "تم روشن فعال شد" : "تم تیره فعال شد",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <BackButton href="/profile" label="بازگشت به پروفایل" />
        </div>
        <Breadcrumb
          items={[
            { label: "پروفایل", href: "/profile" },
            { label: "تنظیمات حساب کاربری", href: "/profile/settings", isCurrent: true },
          ]}
        />
      </div>

      <Tabs defaultValue="profile" className="space-y-6 ">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8 h-15 sm:h-12">
          <TabsTrigger
            value="profile"
            className="flex items-center justify-center px-4 py-2 font-vazirmatn"
          >
            <User className="ml-2 h-4 w-4" />
            پروفایل
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center justify-center px-4 py-2 font-vazirmatn"
          >
            <Lock className="ml-2 h-4 w-4" />
            امنیت
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center justify-center px-4 py-2 font-vazirmatn"
          >
            <Bell className="ml-2 h-4 w-4" />
            اعلان‌ها
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="font-vazirmatn">اطلاعات پروفایل</CardTitle>
              <CardDescription className="font-vazirmatn">
                اطلاعات شخصی خود را مدیریت کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative h-24 w-24 mb-4">
                    <Image
                      src={
                        profileData.avatar ||
                        "/placeholder.svg?height=96&width=96"
                      }
                      alt="تصویر پروفایل"
                      fill
                      className="object-cover rounded-full border-2 border-purple-200 dark:border-purple-800"
                      sizes="96px"
                    />
                    <div className="absolute -bottom-2 -right-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700"
                      >
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">آپلود تصویر</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
                    تصویر پروفایل (حداکثر 2MB)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="font-vazirmatn">
                      نام
                    </Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          firstName: e.target.value,
                        })
                      }
                      className="font-vazirmatn"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="font-vazirmatn">
                      نام خانوادگی
                    </Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          lastName: e.target.value,
                        })
                      }
                      className="font-vazirmatn"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-vazirmatn">
                      ایمیل
                    </Label>
                    <div className="flex">
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="font-vazirmatn"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-vazirmatn">
                      ایمیل شما قابل تغییر نیست
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-vazirmatn">
                      شماره موبایل
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      className="font-vazirmatn"
                      placeholder="09123456789"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                  >
                    <Save className="ml-2 h-4 w-4" />
                    ذخیره تغییرات
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="font-vazirmatn">تنظیمات امنیتی</CardTitle>
              <CardDescription className="font-vazirmatn">
                رمز عبور خود را تغییر دهید و امنیت حساب کاربری خود را افزایش
                دهید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="font-vazirmatn">
                      رمز عبور فعلی
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="font-vazirmatn"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="font-vazirmatn">
                      رمز عبور جدید
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="font-vazirmatn"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-vazirmatn">
                      رمز عبور باید حداقل 8 کاراکتر و شامل حروف بزرگ، کوچک و
                      اعداد باشد
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-vazirmatn">
                      تکرار رمز عبور جدید
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="font-vazirmatn"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                  >
                    <Lock className="ml-2 h-4 w-4" />
                    تغییر رمز عبور
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="font-vazirmatn">تنظیمات اعلان‌ها</CardTitle>
              <CardDescription className="font-vazirmatn">
                نحوه دریافت اعلان‌ها و اطلاع‌رسانی‌ها را مدیریت کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5 max-w-[70%]">
                      <Label className="font-vazirmatn">
                        به‌روزرسانی سفارش‌ها
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
                        دریافت اعلان درباره وضعیت سفارش‌ها و ارسال آن‌ها
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.orderUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          orderUpdates: checked,
                        })
                      }
                      className="scale-75 sm:scale-100"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5 max-w-[70%]">
                      <Label className="font-vazirmatn">
                        تخفیف‌ها و پیشنهادات ویژه
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
                        دریافت اعلان درباره تخفیف‌ها و پیشنهادات ویژه
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.promotions}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          promotions: checked,
                        })
                      }
                      className="scale-75 sm:scale-100"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5 max-w-[70%]">
                      <Label className="font-vazirmatn">محصولات جدید</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
                        دریافت اعلان درباره محصولات جدید اضافه شده به فروشگاه
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.newProducts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          newProducts: checked,
                        })
                      }
                      className="scale-75 sm:scale-100"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5 max-w-[70%]">
                      <Label className="font-vazirmatn">خبرنامه</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
                        دریافت خبرنامه هفتگی با آخرین اخبار و به‌روزرسانی‌ها
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.newsletter}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          newsletter: checked,
                        })
                      }
                      className="scale-75 sm:scale-100"
                    />
                  </div>
                </div>
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5 max-w-[70%]">
                      <Label className="font-vazirmatn">حالت تیره</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-vazirmatn">
                        تغییر بین حالت روشن و تیره
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400" />
                      <Switch
                        checked={theme === "dark"}
                        onCheckedChange={toggleTheme}
                        className="scale-75 sm:scale-100"
                      />
                      <Moon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                    onClick={handleNotificationUpdate}
                  >
                    <Save className="ml-2 h-4 w-4" />
                    ذخیره تنظیمات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
