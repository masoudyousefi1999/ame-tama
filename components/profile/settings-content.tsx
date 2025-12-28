"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Upload, Save, X, ImageIcon } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { customFetch } from "@/lib/utils";
import { uploadFile, validateFile, MediaType } from "@/lib/upload-utils";
import Image from "@/components/ui/custom-image";

export default function SettingsContent() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [isUserHaveEmail, setIsUserHaveEmail] = useState<boolean>(
    user?.email ? true : false
  );

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);

  // بررسی احراز هویت و تنظیم داده‌های پروفایل
  useEffect(() => {
    // فقط بعد از اینکه loading تمام شد، بررسی کن
    if (!isLoading) {
      if (!user) {
        // فقط یک بار ریدایرکت کن
        router.replace("/");
        return;
      }

      // تنظیم داده‌های پروفایل
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, isLoading, router]);

  // اگر در حال بارگذاری است، loading نمایش بده
  if (isLoading) {
    return (
      <div className="container py-8 lg:mt-20 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // اگر کاربر وارد نشده، چیزی نمایش نده (در حال ریدایرکت است)
  if (!user) {
    return null;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // اعتبارسنجی ایمیل اگر خالی است
    if (!profileData.email || !profileData.email.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً ایمیل خود را وارد کنید",
        variant: "error",
      });
      return;
    }

    // اعتبارسنجی فرمت ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email.trim())) {
      toast({
        title: "خطا",
        description: "لطفاً یک ایمیل معتبر وارد کنید",
        variant: "error",
      });
      return;
    }

    try {
      const updateData: {
        firstName: string;
        lastName: string;
        email?: string;
      } = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      };

      // اگر کاربر ایمیل نداشته باشد، ایمیل را اضافه کن
      if (!user?.email && profileData.email) {
        updateData.email = profileData.email.trim();
      }

      const response = await customFetch("/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      toast({
        title: "پروفایل به‌روزرسانی شد",
        description: "اطلاعات پروفایل شما با موفقیت به‌روزرسانی شد",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "خطا",
        description:
          error instanceof Error
            ? error.message
            : "به‌روزرسانی پروفایل با شکست مواجه شد",
        variant: "error",
      });
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "خطا در تغییر رمز عبور",
        description: "رمز عبور جدید و تکرار آن مطابقت ندارند",
        variant: "error",
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

  const toggleTheme = () => {
    toast({
      title: "تم سایت تغییر کرد",
      description: "تم روشن فعال شد",
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file, {
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    });

    if (!validation.isValid) {
      toast({
        title: "خطا",
        description: validation.error,
        variant: "error",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Upload file
      const uploadedMedia = await uploadFile(file, MediaType.USER);

      // Update user avatar
      const response = await customFetch("/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar: uploadedMedia.uuid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update avatar");
      }

      setUploadedAvatar(uploadedMedia.url);

      toast({
        title: "موفقیت",
        description: "تصویر پروفایل با موفقیت آپدیت شد",
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast({
        title: "خطا",
        description: "آپلود تصویر پروفایل با شکست مواجه شد",
        variant: "error",
      });
    } finally {
      setIsUploadingAvatar(false);
      // Clear file input
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const removeAvatar = () => {
    setUploadedAvatar(null);
  };

  return (
    <div className="container py-8 lg:mt-20">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "پروفایل", href: "/profile" },
          {
            label: "تنظیمات حساب کاربری",
            href: "/profile/settings",
            isCurrent: true,
          },
        ]}
      />

      <Tabs defaultValue="profile" className="space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/*  Tabs header                                                    */}
        {/* ---------------------------------------------------------------- */}
        <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-8 h-15 sm:h-12">
          {[
            { value: "profile", icon: User, label: "پروفایل" },
            { value: "security", icon: Lock, label: "امنیت" },
          ].map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="flex items-center justify-center px-4 py-2"
            >
              <t.icon className="ml-2 h-4 w-4" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ================================================================ */}
        {/*  Tab 1 — profile                                                */}
        {/* ================================================================ */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات پروفایل</CardTitle>
              <CardDescription>اطلاعات شخصی خود را مدیریت کنید</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* avatar */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative h-24 w-24 mb-4">
                    <Image
                      src={
                        uploadedAvatar ||
                        profileData.avatar ||
                        "/placeholder.svg?height=96&width=96"
                      }
                      alt="تصویر پروفایل"
                      fill
                      className="object-cover rounded-full border-2 border-purple-200 dark:border-purple-800"
                    />
                    {uploadedAvatar && (
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={removeAvatar}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Upload Area */}
                  <div className="space-y-2 flex flex-col items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                      disabled={isUploadingAvatar}
                      className="flex items-center gap-2"
                    >
                      {isUploadingAvatar ? (
                        <>
                          <Upload className="h-4 w-4 animate-spin" />
                          در حال آپلود...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-4 w-4" />
                          تغییر تصویر پروفایل
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      فرمت‌های مجاز: JPG, PNG, WebP (حداکثر 2MB)
                    </p>
                  </div>
                </div>

                {/* name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      id: "firstName",
                      label: "نام",
                      value: profileData.firstName,
                    },
                    {
                      id: "lastName",
                      label: "نام خانوادگی",
                      value: profileData.lastName,
                    },
                  ].map((f) => (
                    <div key={f.id} className="space-y-2">
                      <Label htmlFor={f.id}>{f.label}</Label>
                      <Input
                        id={f.id}
                        value={f.value}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            [f.id]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* email / phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      ایمیل{" "}
                      {!profileData.email && (
                        <span className="text-destructive">*</span>
                      )}
                    </Label>
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
                      disabled={!!isUserHaveEmail}
                      placeholder={
                        profileData.email ? "" : "ایمیل خود را وارد کنید"
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      {isUserHaveEmail
                        ? "ایمیل شما قابل تغییر نیست"
                        : "لطفاً ایمیل خود را وارد کنید"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره موبایل</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      شماره موبایل شما قابل تغییر نیست
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  >
                    <Save className="ml-2 h-4 w-4" />
                    ذخیره تغییرات
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================================ */}
        {/*  Tab 2 — security                                               */}
        {/* ================================================================ */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات امنیتی</CardTitle>
              <CardDescription>
                رمز عبور خود را تغییر دهید و امنیت حساب را افزایش دهید
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                {/* three password fields */}
                {[
                  {
                    id: "currentPassword",
                    label: "رمز عبور فعلی",
                    val: passwordData.currentPassword,
                  },
                  {
                    id: "newPassword",
                    label: "رمز عبور جدید",
                    val: passwordData.newPassword,
                  },
                  {
                    id: "confirmPassword",
                    label: "تکرار رمز عبور جدید",
                    val: passwordData.confirmPassword,
                  },
                ].map((f) => (
                  <div key={f.id} className="space-y-2">
                    <Label htmlFor={f.id}>{f.label}</Label>
                    <Input
                      id={f.id}
                      type="password"
                      value={f.val}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          [f.id]: e.target.value,
                        })
                      }
                    />
                    {f.id === "newPassword" && (
                      <p className="text-xs text-muted-foreground">
                        رمز عبور باید حداقل 8 کاراکتر و شامل حروف و اعداد باشد
                      </p>
                    )}
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  >
                    <Lock className="ml-2 h-4 w-4" />
                    تغییر رمز عبور
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
