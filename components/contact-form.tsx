"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Send, Loader2 } from "lucide-react";
import { submitContactForm } from "@/app/(main)/actions/contact";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [state, setState] = useState<{
    errors?: {
      name?: string[];
      email?: string[];
      subject?: string[];
      message?: string[];
      _form?: string[];
    };
    success?: boolean;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setState({});

    try {
      const result = await submitContactForm(state, formData);
      setState(result);

      if (result.success) {
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      setState({
        errors: {
          _form: ["خطا در ارسال پیام. لطفاً دوباره تلاش کنید."],
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (state.errors?.[field as keyof typeof state.errors]) {
      setState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: undefined,
        },
      }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form action={handleSubmit} className="space-y-6">
        {/* Success Message */}
        {state.success && (
          <Alert className="border-success bg-success/10 text-success">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        {/* Form Error */}
        {state.errors?._form && (
          <Alert variant="destructive">
            <AlertDescription>{state.errors._form.join(", ")}</AlertDescription>
          </Alert>
        )}

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            نام و نام خانوادگی
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={!!state.errors?.name}
            className="transition-all duration-200"
            placeholder="نام خود را وارد کنید"
            required
          />
          {state.errors?.name && (
            <p className="text-sm text-destructive transition-opacity duration-200">
              {state.errors.name.join(", ")}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            ایمیل
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!state.errors?.email}
            className="transition-all duration-200"
            placeholder="example@email.com"
            required
          />
          {state.errors?.email && (
            <p className="text-sm text-destructive transition-opacity duration-200">
              {state.errors.email.join(", ")}
            </p>
          )}
        </div>

        {/* Subject Field */}
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-medium">
            موضوع
          </Label>
          <Input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            error={!!state.errors?.subject}
            className="transition-all duration-200"
            placeholder="موضوع پیام خود را وارد کنید"
            required
          />
          {state.errors?.subject && (
            <p className="text-sm text-destructive transition-opacity duration-200">
              {state.errors.subject.join(", ")}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium">
            پیام
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            className={cn(
              "min-h-[120px] resize-none transition-all duration-200",
              state.errors?.message &&
                "border-destructive focus-visible:ring-destructive",
            )}
            placeholder="پیام خود را اینجا بنویسید..."
            required
          />
          {state.errors?.message && (
            <p className="text-sm text-destructive transition-opacity duration-200">
              {state.errors.message.join(", ")}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200 hover:scale-105 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              در حال ارسال...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              ارسال پیام
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
