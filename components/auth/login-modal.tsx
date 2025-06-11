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
import { sendOtp, verifyOtp } from "@/hooks/use-otp";

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

    await sendOtp(phoneNumber);
    setOtpStep("verify");
    startCountdown();
    setIsLoading(false);
    toast({
      title: "کد تأیید ارسال شد",
      description: `کد تأیید به شماره ${phoneNumber} ارسال شد`,
    });
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

    const loginResult = await verifyOtp(phoneNumber, otpCode);

    if (loginResult) {
      toast({
        title: "ورود موفقیت‌آمیز",
        description: "با موفقیت وارد حساب کاربری خود شدید",
      });

      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError("کد تأیید وارد شده صحیح نیست");
    }

    setIsLoading(false);
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
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError("ایمیل/شماره تلفن یا رمز عبور اشتباه است");
      }
      setIsLoading(false);
    }, 1000);
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-vazirmatn text-xl">
            ورود به حساب کاربری
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="font-vazirmatn text-right">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* OTP Login Flow */}
          {loginMethod === "otp" && (
            <>
              {otpStep === "phone" ? (
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
                      type="tel"
                      placeholder="09123456789"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={isLoading}
                      className="font-vazirmatn text-left"
                      dir="ltr"
                      maxLength={11}
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
                <div className="space-y-4">
                  <div className="text-center space-y-3">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-vazirmatn">
                      کد تأیید به شماره{" "}
                      <span className="font-bold">{phoneNumber}</span> ارسال شد
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
                      onClick={handleResendOtp}
                      variant="ghost"
                      className="w-full font-vazirmatn"
                      disabled={isLoading || !canResend}
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
                      className="w-full font-vazirmatn text-sm"
                      disabled={isLoading}
                    >
                      <ArrowRight className="w-4 h-4 ml-2" />
                      تغییر شماره تلفن
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Password Login Flow */}
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
                  type="text"
                  placeholder="example@gmail.com یا 09123456789"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                  className="font-vazirmatn"
                  dir="ltr"
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
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="font-vazirmatn"
                  dir="ltr"
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

          {/* Switch Login Method */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {loginMethod === "otp" ? (
              <Button
                onClick={switchToPasswordLogin}
                variant="outline"
                className="w-full font-vazirmatn"
                disabled={isLoading}
              >
                <Lock className="w-4 h-4 ml-2" />
                ورود با رمز عبور
              </Button>
            ) : (
              <Button
                onClick={switchToOtpLogin}
                variant="outline"
                className="w-full font-vazirmatn"
                disabled={isLoading}
              >
                <Shield className="w-4 h-4 ml-2" />
                ورود با کد تأیید
              </Button>
            )}
          </div>

          {/* Link to full login page */}
          <div className="text-center pt-2">
            <Link
              href="/login"
              onClick={() => onClose()}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-vazirmatn inline-flex items-center gap-1"
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
