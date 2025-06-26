"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  Mail,
  Lock,
  Shield,
  CheckCircle,
  Clock,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import OtpInput from "@/components/auth/otp-input";

type LoginMethod = "otp" | "password";
type OtpStep = "phone" | "verify";

// Test data for simulation
const TEST_DATA = {
  validPhones: ["09123456789", "09987654321"],
  validOtp: "1234",
  validCredentials: [
    { identifier: "user@example.com", password: "123456" },
    { identifier: "09123456789", password: "123456" },
  ],
};

export default function LoginPageComponent() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("otp");
  const [otpStep, setOtpStep] = useState<OtpStep>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Timer state
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Form data
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (otpStep === "verify" && otpCode.length === 4 && !isLoading) {
      handleVerifyOtp();
    }
  }, [otpCode, otpStep, isLoading]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  // Validation functions
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateIdentifier = (value: string): boolean => {
    return validateEmail(value) || validatePhoneNumber(value);
  };

  // Start countdown timer
  const startCountdown = () => {
    setCountdown(120); // 2 minutes
    setCanResend(false);
  };

  // Format countdown time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // OTP Login handlers
  const handleSendOtp = async () => {
    setError("");

    if (!phoneNumber.trim()) {
      setError("لطفاً شماره تلفن خود را وارد کنید");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError("شماره تلفن وارد شده معتبر نیست");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (TEST_DATA.validPhones.includes(phoneNumber)) {
        setOtpStep("verify");
        startCountdown();
        toast({
          title: "کد تأیید ارسال شد",
          description: `کد تأیید به شماره ${phoneNumber} ارسال شد`,
        });
      } else {
        setError("شماره تلفن در سیستم موجود نیست");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setError("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      startCountdown();
      toast({
        title: "کد تأیید مجدداً ارسال شد",
        description: `کد تأیید جدید به شماره ${phoneNumber} ارسال شد`,
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    setError("");

    if (!otpCode.trim()) {
      setError("لطفاً کد تأیید را وارد کنید");
      return;
    }

    if (otpCode.length !== 4) {
      setError("کد تأیید باید ۴ رقم باشد");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (otpCode === TEST_DATA.validOtp) {
        toast({
          title: "ورود موفقیت‌آمیز",
          description: "با موفقیت وارد حساب کاربری خود شدید",
        });
        router.push("/profile");
      } else {
        setError("کد تأیید وارد شده صحیح نیست");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Password Login handler
  const handlePasswordLogin = async () => {
    setError("");

    if (!identifier.trim()) {
      setError("لطفاً ایمیل یا شماره تلفن خود را وارد کنید");
      return;
    }

    if (!validateIdentifier(identifier)) {
      setError("ایمیل یا شماره تلفن وارد شده معتبر نیست");
      return;
    }

    if (!password.trim()) {
      setError("لطفاً رمز عبور خود را وارد کنید");
      return;
    }

    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const validCredential = TEST_DATA.validCredentials.find(
        (cred) => cred.identifier === identifier && cred.password === password
      );

      if (validCredential) {
        toast({
          title: "ورود موفقیت‌آمیز",
          description: "با موفقیت وارد حساب کاربری خود شدید",
        });
        router.push("/profile");
      } else {
        setError("ایمیل/شماره تلفن یا رمز عبور اشتباه است");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Reset functions
  const resetToPhoneInput = () => {
    setOtpStep("phone");
    setOtpCode("");
    setError("");
    setCountdown(0);
    setCanResend(true);
  };

  const switchToOtpLogin = () => {
    setLoginMethod("otp");
    setOtpStep("phone");
    setIdentifier("");
    setPassword("");
    setError("");
  };

  const switchToPasswordLogin = () => {
    setLoginMethod("password");
    setPhoneNumber("");
    setOtpCode("");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        {/* ── header ───────────────────────────────────────────── */}
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-5 h-5" />
            </Link>
            <CardTitle className="text-2xl font-bold font-vazirmatn bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              ورود به حساب کاربری
            </CardTitle>
            <span className="w-5 h-5" /> {/* spacer */}
          </div>

          <p className="text-sm text-muted-foreground font-vazirmatn">
            {loginMethod === "otp"
              ? "برای ورود، شماره تلفن خود را وارد کنید"
              : "با ایمیل یا شماره تلفن و رمز عبور وارد شوید"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* error alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="font-vazirmatn text-right">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* ── OTP flow ─────────────────────────────────────── */}
          {loginMethod === "otp" && (
            <>
              {otpStep === "phone" ? (
                /* phone-input step */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="font-vazirmatn flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      شماره تلفن
                    </Label>
                    <Input
                      id="phone"
                      dir="ltr"
                      maxLength={11}
                      type="tel"
                      placeholder="09123456789"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={isLoading}
                      className="font-vazirmatn text-left"
                    />
                  </div>

                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 ml-2" />
                        ارسال کد تأیید
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                /* code-input step */
                <div className="space-y-4">
                  <div className="text-center space-y-3">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="text-sm text-muted-foreground font-vazirmatn">
                      کد تأیید به شماره&nbsp;
                      <span className="font-bold">{phoneNumber}</span>
                      &nbsp;ارسال شد
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-vazirmatn text-center block">
                      کد تأیید ۴ رقمی را وارد کنید
                    </Label>
                    <OtpInput
                      value={otpCode}
                      onChange={setOtpCode}
                      disabled={isLoading}
                      className="justify-center"
                    />
                  </div>

                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otpCode.length !== 4}
                    className="w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-vazirmatn"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                        در حال تأیید...
                      </>
                    ) : (
                      "تأیید و ورود"
                    )}
                  </Button>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      onClick={handleResendOtp}
                      disabled={isLoading || !canResend}
                      className="w-full font-vazirmatn"
                    >
                      {canResend ? (
                        "ارسال مجدد کد"
                      ) : (
                        <>
                          <Clock className="w-4 h-4 ml-2" />
                          ارسال مجدد در {formatTime(countdown)}
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={resetToPhoneInput}
                      disabled={isLoading}
                      className="w-full font-vazirmatn text-sm"
                    >
                      <ArrowRight className="w-4 h-4 ml-2" />
                      تغییر شماره تلفن
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Password flow ─────────────────────────────────── */}
          {loginMethod === "password" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="identifier"
                  className="font-vazirmatn flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  ایمیل یا شماره تلفن
                </Label>
                <Input
                  id="identifier"
                  dir="ltr"
                  type="text"
                  placeholder="example@gmail.com یا 09123456789"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                  className="font-vazirmatn"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-vazirmatn flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  رمز عبور
                </Label>
                <Input
                  id="password"
                  dir="ltr"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="font-vazirmatn"
                />
              </div>

              <Button
                onClick={handlePasswordLogin}
                disabled={isLoading}
                className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                    در حال ورود...
                  </>
                ) : (
                  "ورود"
                )}
              </Button>
            </div>
          )}

          {/* ── switch method button ──────────────────────────── */}
          <div className="pt-4 border-t border-border">
            {loginMethod === "otp" ? (
              <Button
                onClick={switchToPasswordLogin}
                variant="outline"
                disabled={isLoading}
                className="w-full font-vazirmatn"
              >
                <Lock className="w-4 h-4 ml-2" />
                ورود با رمز عبور
              </Button>
            ) : (
              <Button
                onClick={switchToOtpLogin}
                variant="outline"
                disabled={isLoading}
                className="w-full font-vazirmatn"
              >
                <Shield className="w-4 h-4 ml-2" />
                ورود با کد تأیید
              </Button>
            )}
          </div>

          {/* ── extra links & test data ───────────────────────── */}
          <div className="pt-4 border-t border-border space-y-3">
            <div className="text-center">
              <Link
                href="/register"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-vazirmatn"
              >
                حساب کاربری ندارید؟ ثبت‌نام کنید
              </Link>
            </div>

            {loginMethod === "password" && (
              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:underline font-vazirmatn"
                >
                  فراموشی رمز عبور؟
                </Link>
              </div>
            )}
          </div>

          {/* test credentials box */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-semibold font-vazirmatn mb-2">
              اطلاعات تست:
            </h4>
            <div className="text-xs text-muted-foreground font-vazirmatn space-y-1">
              <p>
                <strong>شماره‌های معتبر:</strong> 09123456789, 09987654321
              </p>
              <p>
                <strong>کد تأیید:</strong> 1234
              </p>
              <p>
                <strong>ایمیل تست:</strong> user@example.com
              </p>
              <p>
                <strong>رمز عبور تست:</strong> 123456
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
