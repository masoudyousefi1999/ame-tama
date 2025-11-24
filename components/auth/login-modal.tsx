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
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import OtpInput from "@/components/auth/otp-input";
import { sendOtp } from "@/hooks/use-otp";
import { useAuth } from "@/context/auth-context";

type LoginMethod = "otp" | "password";
type OtpStep = "phone" | "verify";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
}: LoginModalProps) {
  const router = useRouter();
  const { loginWithOtp, loginWithPassword } = useAuth();
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
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setLoginMethod("otp");
    setOtpStep("phone");
    setPhoneNumber("");
    setOtpCode("");
    setIdentifier("");
    setPassword("");
    setError("");
    setCountdown(0);
    setCanResend(true);
    setIsLoading(false);
  };

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

    try {
      await sendOtp(phoneNumber);
      setOtpStep("verify");
      startCountdown();
      toast({
        title: "کد تأیید ارسال شد",
        description: `کد تأیید به شماره ${phoneNumber} ارسال شد`,
      });
    } catch (error) {
      setError("خطا در ارسال کد تأیید");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setError("");
    setIsLoading(true);

    try {
      await sendOtp(phoneNumber);
      startCountdown();
      toast({
        title: "کد تأیید مجدداً ارسال شد",
        description: `کد تأیید جدید به شماره ${phoneNumber} ارسال شد`,
      });
    } catch (error) {
      setError("خطا در ارسال مجدد کد تأیید");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 4) {
      toast({
        variant: "error",
        title: "خطا",
        description: "لطفاً کد ۴ رقمی را وارد کنید",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginWithOtp(phoneNumber, otpCode);
      if (result.success) {
        toast({
          variant: "login",
          title: " موفقیت‌آمیز",
          description: "با موفقیت وارد حساب کاربری خود شدید",
        });
        window.location.reload(); // Force UI update after login
        // onSuccess?.();
        // onClose();
      } else {
        toast({
          variant: "error",
          title: "خطا در ورود",
          description:
            typeof result.message === "string"
              ? result.message
              : (result.message && JSON.stringify(result.message)) ||
                "کد وارد شده صحیح نیست",
        });
      }
    } catch (error: any) {
      toast({
        variant: "error",
        title: "خطا در ورود",
        description:
          typeof error?.message === "string"
            ? error.message
            : (error && JSON.stringify(error)) ||
              "مشکلی در ورود به حساب کاربری رخ داد",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Password Login handler
  const handlePasswordLogin = async () => {
    if (!identifier || !password) {
      toast({
        variant: "error",
        title: "خطا",
        description: "لطفاً تمام فیلدها را پر کنید",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginWithPassword(identifier, password);
      if (result.success) {
        toast({
          variant: "login",
          title: "ورود موفقیت‌آمیز",
          description: "با موفقیت وارد حساب کاربری خود شدید",
        });
        window.location.reload(); // Force UI update after login
        onSuccess?.();
        onClose();
      } else {
        toast({
          variant: "error",
          title: "خطا در ورود",
          description:
            typeof result.message === "string"
              ? result.message
              : (result.message && JSON.stringify(result.message)) ||
                "اطلاعات وارد شده صحیح نیست",
        });
      }
    } catch (error: any) {
      toast({
        variant: "error",
        title: "خطا در ورود",
        description:
          typeof error?.message === "string"
            ? error.message
            : (error && JSON.stringify(error)) ||
              "مشکلی در ورود به حساب کاربری رخ داد",
      });
    } finally {
      setIsLoading(false);
    }
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

  const resetToPhoneInput = () => {
    setOtpStep("phone");
    setOtpCode("");
    setError("");
    setCountdown(0);
    setCanResend(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[800px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            ورود به حساب کاربری
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* error alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="  text-right">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/*  OTP flow  */}
          {loginMethod === "otp" && (
            <>
              {otpStep === "phone" ? (
                /* phone-input step */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="  flex items-center gap-2"
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
                      className="  text-left"
                    />
                  </div>

                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
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
                    <p className="text-sm text-muted-foreground">
                      کد تأیید به شماره&nbsp;
                      <span className="font-bold">{phoneNumber}</span>
                      &nbsp;ارسال شد
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="  text-center block">
                      کد تأیید ۴ رقمی را وارد کنید
                    </Label>
                    <OtpInput
                      value={otpCode}
                      onChange={setOtpCode}
                      disabled={isLoading}
                      className="justify-center"
                    />
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleVerifyOtp();
                    }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading || otpCode.length !== 4}
                      className="w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
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
                  </form>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleResendOtp}
                      variant="ghost"
                      disabled={isLoading || !canResend}
                      className="w-full"
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
                      onClick={resetToPhoneInput}
                      variant="ghost"
                      disabled={isLoading}
                      className="w-full text-sm"
                    >
                      <ArrowRight className="w-4 h-4 ml-2" />
                      تغییر شماره تلفن
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/*  Password flow  */}
          {loginMethod === "password" && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordLogin();
              }}
            >
              <div className="space-y-2">
                <Label
                  htmlFor="identifier"
                  className="  flex items-center gap-2"
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="  flex items-center gap-2">
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
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
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
            </form>
          )}

          {/*  switch method  */}
          <div className="pt-4 border-t border-border">
            {loginMethod === "otp" ? (
              <Button
                onClick={switchToPasswordLogin}
                variant="outline"
                disabled={isLoading}
                className="w-full"
              >
                <Lock className="w-4 h-4 ml-2" />
                ورود با رمز عبور
              </Button>
            ) : (
              <Button
                onClick={switchToOtpLogin}
                variant="outline"
                disabled={isLoading}
                className="w-full"
              >
                <Shield className="w-4 h-4 ml-2" />
                ورود با کد تأیید
              </Button>
            )}
          </div>

          {/*  full login page link  */}
          <div className="text-center pt-2">
            <Link
              href="/login"
              onClick={onClose}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
            >
              صفحه ورود کامل
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
